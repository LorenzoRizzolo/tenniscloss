import { json } from '@sveltejs/kit';
import { db, initializeDatabase } from '$lib/server/db.js';
import { generateId, generateOTP, validateEmail } from '$lib/server/auth.js';
import { sendOTPEmail } from '$lib/server/email.js';

initializeDatabase();

export async function POST({ request }) {
	try {
		const { email, name, surname } = await request.json();

		if (!email || !name || !surname) {
			return json({ error: 'Email, name, and surname are required' }, { status: 400 });
		}

		if (!validateEmail(email)) {
			return json({ error: 'Invalid email format' }, { status: 400 });
		}

		// Check if user already exists
		const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
		if (existingUser) {
			return json({ error: 'Email already registered' }, { status: 400 });
		}

		// Check for existing OTP
		const existingOTP = db
			.prepare('SELECT id FROM otp_codes WHERE email = ? AND expires_at > ?')
			.get(email, new Date().toISOString());
		if (existingOTP) {
			return json({ error: 'An OTP was recently sent. Please check your email.' }, { status: 400 });
		}

		// Generate OTP
		const otp = generateOTP();
		const otpId = generateId();
		const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

		db.prepare('INSERT INTO otp_codes (id, email, code, expires_at) VALUES (?, ?, ?, ?)')
			.run(otpId, email, otp, expiresAt);

		// Log OTP for development (should be removed in production)
		console.log(`📧 OTP for ${email}: ${otp}`);

		// Send OTP email (non-critical for development)
		await sendOTPEmail(email, otp, name).catch(err => {
			console.error('Email send failed (non-critical):', err);
		});

		return json({
			success: true,
			message: 'OTP sent to your email. Please verify to complete registration.'
		});
	} catch (error) {
		console.error('Registration error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
}
