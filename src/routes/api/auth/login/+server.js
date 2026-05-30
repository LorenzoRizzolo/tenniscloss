import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db.js';
import { verifyPassword, generateToken } from '$lib/server/auth.js';

import dotenv from 'dotenv';
dotenv.config();

export async function POST({ request }) {
	try {
		const { email, password } = await request.json();

		if (!email || !password) {
			return json({ error: 'Email and password are required' }, { status: 400 });
		}

		const admin = email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD;
		let user = null;

		if(!admin){
			// Find user
			user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
			if (!user) {
				console.log('User not found for email:', email);
				return json({ error: 'Invalid email or password' }, { status: 401 });
			}
			if (!user.is_verified) {
				return json({ error: 'Email not verified. Please complete registration.' }, { status: 401 });
			}
			// Verify password
			const passwordMatch = await verifyPassword(password, user.password_hash);
			if (!passwordMatch) {
				console.log('Password mismatch for email:', email, "password reale:", user.password_hash, "password inserito:", password);
				return json({ error: 'Invalid email or password' }, { status: 401 });
			}
		}else{
			user = {
				id: '-1',
				email: process.env.ADMIN_EMAIL,
				name: 'Admin',
				surname: '',
				role: 'admin'
			}
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
