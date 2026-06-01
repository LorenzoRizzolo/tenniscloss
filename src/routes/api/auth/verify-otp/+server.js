import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db.js';
import { generateId, hashPassword, validatePassword } from '$lib/server/auth.js';
import { sendNewRegistrationNotification } from '$lib/server/email.js';

import dotenv from 'dotenv';
dotenv.config();

export async function POST({ request }) {
	try {
		const { email, otp, password, name, surname } = await request.json();

		if (!email || !otp || !password) {
			return json({ error: 'Email, OTP e password sono obbligatori' }, { status: 400 });
		}

		const passwordValidation = validatePassword(password);
		if (!passwordValidation.valid) {
			return json({ error: passwordValidation.errors }, { status: 400 });
		}

		const now = new Date().toISOString();
		const otpRecord = db
			.prepare('SELECT * FROM otp_codes WHERE email = ? AND code = ? AND expires_at > ?')
			.get(email, otp, now);

		if (!otpRecord) {
			const existingOTP = db.prepare('SELECT * FROM otp_codes WHERE email = ? AND expires_at > ?').get(email, now);
			if (existingOTP) {
				db.prepare('UPDATE otp_codes SET attempts = attempts + 1 WHERE id = ?').run(existingOTP.id);
				if (existingOTP.attempts >= existingOTP.max_attempts) {
					return json({ error: 'Troppi tentativi falliti. Richiedi un nuovo OTP.' }, { status: 400 });
				}
			}
			return json({ error: 'OTP non valido o scaduto' }, { status: 400 });
		}

		const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
		if (existingUser) {
			return json({ error: 'Email già registrata' }, { status: 400 });
		}

		// Crea utente con is_approved=0: deve essere approvato da admin/gestore
		const userId = generateId();
		const passwordHash = await hashPassword(password);

		db.prepare(
			`INSERT INTO users (id, email, name, surname, password_hash, role, is_verified, is_approved)
			 VALUES (?, ?, ?, ?, ?, 'utente', 1, 0)`
		).run(userId, email, name, surname, passwordHash);

		db.prepare('DELETE FROM otp_codes WHERE id = ?').run(otpRecord.id);

		// Notifica gestori e admin della nuova registrazione
		try {
			const managers = db.prepare("SELECT email FROM users WHERE role IN ('admin') AND is_verified = 1").all();
			managers.push(
				{email: process.env.ADMIN_EMAIL }
			);
			for (const manager of managers) {
				await sendNewRegistrationNotification(
					manager.email,
					`${name} ${surname}`,
					email
				);
			}
		} catch (e) {
			console.error('Errore invio notifica registrazione:', e);
		}

		return json({
			success: true,
			message: 'Registrazione completata con successo! Il tuo account è in attesa di approvazione da parte di un amministratore. Riceverai una notifica via email quando sarà approvato.',
			requiresApproval: true
		});
	} catch (error) {
		console.error('OTP verification error:', error);
		return json({ error: 'Errore interno del server' }, { status: 500 });
	}
}
