import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db.js';

export async function GET({ url, locals }) {
	try {
		if (!locals.user) {
			return json({ error: 'Unauthorized' }, { status: 403 });
		}

		const date = url.searchParams.get('date');
		if (!date) {
			return json({ error: 'Date parameter required' }, { status: 400 });
		}

		// Get all confirmed bookings for the date
		const bookings = db
			.prepare(
				`
				SELECT b.*, u.name, u.surname, u.email 
				FROM bookings b
				LEFT JOIN users u ON b.user_id = u.id
				WHERE b.booking_date = ? AND b.status IN ('pending', 'confirmed')
				ORDER BY b.start_time ASC
			`
			)
			.all(date);

		return json({ bookings });
	} catch (error) {
		console.error('Calendar API error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
}
