import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db.js';
import { verifyPassword, generateToken } from '$lib/server/auth.js';

export async function POST({ request }) {
	try {
		const { email, password } = await request.json();

		if (!email || !password) {
			return json({ error: 'Email and password are required' }, { status: 400 });
		}

		// Find user
		const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

		if (!user) {
			return json({ error: 'Invalid email or password' }, { status: 401 });
		}

		if (!user.is_verified) {
			return json({ error: 'Email not verified. Please complete registration.' }, { status: 401 });
		}

		// Verify password
		const passwordMatch = await verifyPassword(password, user.password_hash);
		if (!passwordMatch) {
			return json({ error: 'Invalid email or password' }, { status: 401 });
		}

		// Generate token
		const token = generateToken(user.id, user.email, user.role);

		return json({
			success: true,
			user: {
				id: user.id,
				email: user.email,
				name: user.name,
				surname: user.surname,
				role: user.role
			},
			token
		});
	} catch (error) {
		console.error('Login error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
}
