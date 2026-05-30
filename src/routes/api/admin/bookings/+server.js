import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db.js';

export async function GET({ locals }) {
	try {
		if (!locals.user || locals.user.role !== 'admin') {
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
