import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db.js';
import { sendBookingConfirmationEmail, sendManagerBookingNotification } from '$lib/server/email.js';

export async function GET({ locals }) {
	try {
		if (!locals.user || (locals.user.role !== 'gestore' && locals.user.role !== 'admin')) {
			return json({ error: 'Unauthorized' }, { status: 403 });
		}

		const bookings = db
			.prepare(`
				SELECT b.*, u.name as user_name, u.surname as user_surname, u.email as user_email
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
