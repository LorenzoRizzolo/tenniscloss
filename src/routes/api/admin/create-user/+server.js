import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db.js';
import { generateId, hashPassword, validateEmail } from '$lib/server/auth.js';

export async function POST({ request, locals }) {
	try {
		if (!locals.user || locals.user.role !== 'admin') {
			return json({ error: 'Unauthorized' }, { status: 403 });
		}

		const { email, name, surname, role } = await request.json();

		if (!email || !name || !surname || !role) {
			return json({ error: 'All fields are required' }, { status: 400 });
		}

		if (!validateEmail(email)) {
			return json({ error: 'Invalid email format' }, { status: 400 });
		}

		// Check if user already exists
		const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
		if (existingUser) {
			return json({ error: 'Email already exists' }, { status: 400 });
		}

		// Create user with temporary password
		const userId = generateId();
		const tempPassword = generateId().slice(0, 12);
		const passwordHash = await hashPassword(tempPassword);

		db.prepare(
			`INSERT INTO users (id, email, name, surname, password_hash, role, is_verified, created_by)
			 VALUES (?, ?, ?, ?, ?, ?, 1, ?)`
		).run(userId, email, name, surname, passwordHash, role, locals.user.userId);

		return json({
			success: true,
			message: 'User created successfully',
			user: {
				id: userId,
				email,
				name,
				surname,
				role,
				tempPassword
			}
		});
	} catch (error) {
		console.error('Create user error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
}
