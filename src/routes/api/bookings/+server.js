import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db.js';
import { generateId, calculateBookingDuration, getDateOnly } from '$lib/server/auth.js';
import { sendManagerBookingNotification } from '$lib/server/email.js';

const DAILY_BOOKING_LIMIT_MINUTES = 120; // 2 hours

function getUserBookingMinutesToday(userId, bookingDate) {
	const result = db
		.prepare(
			`SELECT SUM(duration_minutes) as total FROM bookings 
			 WHERE user_id = ? AND booking_date = ? AND status IN ('pending', 'confirmed')`
		)
		.get(userId, bookingDate);
	return result.total || 0;
}

function getManagerEmail() {
	const manager = db
		.prepare('SELECT email FROM users WHERE role IN ("admin", "gestore") ORDER BY role DESC LIMIT 1')
		.get();
	return manager?.email;
}

export async function POST({ request, locals }) {
	try {
		const user = locals.user;
		if (!user) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		const { bookingDate, startTime, endTime, notes } = await request.json();

		if (!bookingDate || !startTime || !endTime) {
			return json({ error: 'Booking date, start time, and end time are required' }, { status: 400 });
		}

		// Validate booking date is in the future
		if (new Date(bookingDate) < new Date(getDateOnly())) {
			return json({ error: 'Cannot book in the past' }, { status: 400 });
		}

		// Calculate duration
		const duration = calculateBookingDuration(startTime, endTime);
		if (duration <= 0) {
			return json({ error: 'Invalid time range' }, { status: 400 });
		}
		if (duration > 120) {
			return json({ error: 'Maximum booking duration is 2 hours' }, { status: 400 });
		}

		// Check daily booking limit
		const currentMinutes = getUserBookingMinutesToday(user.userId, bookingDate);
		if (currentMinutes + duration > DAILY_BOOKING_LIMIT_MINUTES) {
			const remaining = DAILY_BOOKING_LIMIT_MINUTES - currentMinutes;
			return json(
				{
					error: `Daily booking limit exceeded. You have ${remaining} minutes available today.`
				},
				{ status: 400 }
			);
		}

		// Check for conflicts
		const conflict = db
			.prepare(
				`SELECT id FROM bookings 
				 WHERE booking_date = ? AND status IN ('confirmed', 'pending')
				 AND (
					(start_time < ? AND end_time > ?)
					OR (start_time < ? AND end_time > ?)
					OR (start_time >= ? AND end_time <= ?)
				 )`
			)
			.get(bookingDate, endTime, startTime, endTime, startTime, startTime, endTime);

		if (conflict) {
			return json({ error: 'Time slot is already booked' }, { status: 400 });
		}

		// Create booking
		const bookingId = generateId();
		const now = new Date().toISOString();

		db.prepare(
			`INSERT INTO bookings (id, user_id, booking_date, start_time, end_time, duration_minutes, notes, created_at, updated_at)
			 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
		).run(bookingId, user.userId, bookingDate, startTime, endTime, duration, notes, now, now);

		// Notify manager
		const managerEmail = getManagerEmail();
		const userData = db.prepare('SELECT name, surname FROM users WHERE id = ?').get(user.userId);

		if (managerEmail && userData) {
			await sendManagerBookingNotification(
				managerEmail,
				`${userData.name} ${userData.surname}`,
				bookingDate,
				startTime,
				endTime,
				bookingId,
				'new'
			);
		}

		return json({
			success: true,
			message: 'Booking created and awaiting confirmation',
			booking: {
				id: bookingId,
				bookingDate,
				startTime,
				endTime,
				duration,
				status: 'pending'
			}
		});
	} catch (error) {
		console.error('Booking error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
}

export async function GET({ locals }) {
	try {
		const user = locals.user;
		if (!user) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		let query = 'SELECT * FROM bookings WHERE user_id = ? ORDER BY booking_date DESC';
		const bookings = db.prepare(query).all(user.userId);

		return json({ bookings });
	} catch (error) {
		console.error('Fetch bookings error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
}
