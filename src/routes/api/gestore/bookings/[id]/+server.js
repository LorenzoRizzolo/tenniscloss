import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db.js';
import { sendBookingConfirmationEmail } from '$lib/server/email.js';

export async function PATCH({ request, locals, params }) {
	try {
		if (!locals.user || (locals.user.role !== 'gestore' && locals.user.role !== 'admin')) {
			return json({ error: 'Unauthorized' }, { status: 403 });
		}

		const { status } = await request.json();
		const { id } = params;

		if (!status || !['confirmed', 'cancelled'].includes(status)) {
			return json({ error: 'Invalid status' }, { status: 400 });
		}

		const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(id);
		if (!booking) {
			return json({ error: 'Booking not found' }, { status: 404 });
		}

		const now = new Date().toISOString();

		if (status === 'confirmed') {
			db.prepare(
				`UPDATE bookings SET status = ?, confirmed_by = ?, confirmed_at = ?, updated_at = ? WHERE id = ?`
			).run(status, locals.user.userId, now, now, id);

			// Send confirmation email to user
			const user = db.prepare('SELECT email, name FROM users WHERE id = ?').get(booking.user_id);
			if (user) {
				await sendBookingConfirmationEmail(
					user.email,
					user.name,
					booking.booking_date,
					booking.start_time,
					booking.end_time,
					booking.id
				);
			}
		} else if (status === 'cancelled') {
			db.prepare(
				`UPDATE bookings SET status = ?, cancelled_at = ?, updated_at = ? WHERE id = ?`
			).run(status, now, now, id);
		}

		return json({
			success: true,
			message: `Booking ${status}`
		});
	} catch (error) {
		console.error('Update booking error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
}
