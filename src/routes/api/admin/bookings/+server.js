import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db.js';
import { generateId } from '$lib/server/auth.js';

export async function GET({ locals }) {
	try {
		if (
			!locals.user ||
			((locals.user.role !== 'admin' && locals.user.role !== 'gestore') && locals.user.id !== '-1')
		) {
			return json({ error: 'Unauthorized' }, { status: 403 });
		}

		const bookings = db
			.prepare(`
				SELECT b.*, u.name, u.surname, u.email 
				FROM bookings b
				LEFT JOIN users u ON b.user_id = u.id
				ORDER BY b.booking_date DESC, b.start_time DESC
			`)
			.all();

		return json({ bookings });
	} catch (error) {
		console.error('Fetch bookings error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
}

export async function PATCH({ request, locals }) {
	try {
		if (
			!locals.user ||
			((locals.user.role !== 'admin' && locals.user.role !== 'gestore') && locals.user.id !== '-1')
		) {
			return json({ error: 'Unauthorized' }, { status: 403 });
		}

		const { bookingId, action } = await request.json();

		if (!bookingId || !action) {
			return json({ error: 'bookingId and action required' }, { status: 400 });
		}

		if (action === 'confirm') {
			db.prepare(
				`
				UPDATE bookings 
				SET status = 'confirmed', confirmed_by = ?, confirmed_at = CURRENT_TIMESTAMP
				WHERE id = ?
			`
			).run(locals.user.id, bookingId);

			return json({ success: true, message: 'Prenotazione confermata' });
		} else if (action === 'cancel') {
			db.prepare(
				`
				UPDATE bookings 
				SET status = 'cancelled', cancelled_at = CURRENT_TIMESTAMP
				WHERE id = ?
			`
			).run(bookingId);

			return json({ success: true, message: 'Prenotazione cancellata' });
		}

		return json({ error: 'Invalid action' }, { status: 400 });
	} catch (error) {
		console.error('Update booking error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
}
