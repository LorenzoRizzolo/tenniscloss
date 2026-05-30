import { verifyToken } from '$lib/server/auth.js';
import { db, initializeDatabase } from '$lib/server/db.js';
import { initializeEmailService } from '$lib/server/email.js';

// Initialize services
initializeDatabase();
initializeEmailService();

export async function handle({ event, resolve }) {
	const token =
		event.cookies.get('authToken') || event.request.headers.get('authorization')?.replace('Bearer ', '');

	if (token) {
		event.locals.user = verifyToken(token);
	}

	return resolve(event);
}
