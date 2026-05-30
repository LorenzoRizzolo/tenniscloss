import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db.js';
import { generateId, hashPassword, validatePassword, generateToken } from '$lib/server/auth.js';
import { sendManagerBookingNotification } from '$lib/server/email.js';

export async function POST({ request }) {
	try {
		const { email, otp, password, name, surname } = await request.json();

		if (!email || !otp || !password) {
			return json({ error: 'Email, OTP, and password are required' }, { status: 400 });
		}

		// Validate password
		const passwordValidation = validatePassword(password);
		if (!passwordValidation.valid) {
			return json({ error: passwordValidation.errors }, { status: 400 });
		}

		// Find and verify OTP
		const now = new Date().toISOString();
		const otpRecord = db
			.prepare('SELECT * FROM otp_codes WHERE email = ? AND code = ? AND expires_at > ?')
			.get(email, otp, now);

		if (!otpRecord) {
			// Increment attempts
			const existingOTP = db.prepare('SELECT * FROM otp_codes WHERE email = ? AND expires_at > ?').get(email, now);
			if (existingOTP) {
				db.prepare('UPDATE otp_codes SET attempts = attempts + 1 WHERE id = ?').run(existingOTP.id);
				if (existingOTP.attempts >= existingOTP.max_attempts) {
					return json({ error: 'Too many failed attempts. Request a new OTP.' }, { status: 400 });
				}
			}
			return json({ error: 'Invalid or expired OTP' }, { status: 400 });
		}

		// Check if user already exists
		const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
		if (existingUser) {
			return json({ error: 'Email already registered' }, { status: 400 });
		}

		// Create user
		const userId = generateId();
		const passwordHash = await hashPassword(password);

		db.prepare(
			`INSERT INTO users (id, email, name, surname, password_hash, role, is_verified)
			 VALUES (?, ?, ?, ?, ?, 'utente', 1)`
		).run(userId, email, name, surname, passwordHash);

		// Delete used OTP
		db.prepare('DELETE FROM otp_codes WHERE id = ?').run(otpRecord.id);

		// Generate token
		const token = generateToken(userId, email, 'utente');

		return json({
			success: true,
			message: 'Registration completed successfully',
			user: {
				id: userId,
				email,
				name,
				surname,
				role: 'utente'
			},
			token
		});
	} catch (error) {
		console.error('OTP verification error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
}
