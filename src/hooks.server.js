import { verifyToken } from '$lib/server/auth.js';
import { db, initializeDatabase } from '$lib/server/db.js';
import { initializeEmailService } from '$lib/server/email.js';
import { generateId, hashPassword } from '$lib/server/auth.js';

// Initialize services
initializeDatabase();
initializeEmailService();

// Create default admin if not exists (sync part)
const adminExists = db.prepare('SELECT id FROM users WHERE role = ? LIMIT 1').get('admin');
if (!adminExists) {
	console.log('ℹ️ Admin account will be created on first request...');
}

export async function handle({ event, resolve }) {
	// Create admin on first request if needed
	const adminExists = db.prepare('SELECT id FROM users WHERE role = ? LIMIT 1').get('admin');
	if (!adminExists) {
		const adminId = generateId();
		const adminPassword = await hashPassword('Admin123!');
		const adminEmail = process.env.ADMIN_EMAIL || 'admin@tennisborgatacloss.it';

		try {
			const now = new Date().toISOString();
			db.prepare(
				`INSERT INTO users (id, email, name, surname, password_hash, role, is_verified, created_at, updated_at)
				 VALUES (?, ?, 'Admin', 'Borgata Closs', ?, 'admin', 1, ?, ?)`
			).run(adminId, adminEmail, adminPassword, now, now);

			console.log('✅ Admin account created:', adminEmail);
		} catch (error) {
			console.log('ℹ️ Admin account already exists');
		}
	}

	const token =
		event.cookies.get('authToken') || event.request.headers.get('authorization')?.replace('Bearer ', '');

	if (token) {
		event.locals.user = verifyToken(token);
	}

	return resolve(event);
}
