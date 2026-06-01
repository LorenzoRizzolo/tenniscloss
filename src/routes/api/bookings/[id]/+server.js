import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db.js';

export async function DELETE({ locals, params }) {
	try {
		const user = locals.user;
		if (!user) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		const { id } = params;
		if (!id) {
			return json({ error: 'Booking id is required' }, { status: 400 });
		}

		const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(id);
		if (!booking) {
			return json({ error: 'Booking not found' }, { status: 404 });
		}

		// Only the booking owner can cancel their own booking
		if (booking.user_id !== user.userId) {
			return json({ error: 'You can only cancel your own bookings' }, { status: 403 });
		}

		// Can only cancel pending or confirmed bookings (not already cancelled)
		if (booking.status === 'cancelled') {
			return json({ error: 'Booking is already cancelled' }, { status: 400 });
		}

		const now = new Date().toISOString();
		db.prepare(
			`UPDATE bookings SET status = 'cancelled', cancelled_at = ?, updated_at = ? WHERE id = ?`
		).run(now, now, id);

		return json({ success: true, message: 'Booking cancelled successfully' });
	} catch (error) {
		console.error('Delete booking error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
}
