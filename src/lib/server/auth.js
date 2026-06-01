import crypto from 'crypto';
import bcrypt from 'bcryptjs';

export const adminUser = {
				id: '-1',
				email: process.env.ADMIN_EMAIL,
				name: 'Amministratore',
                surname: '',
                role: 'admin'
            }

export function generateId() {
	return crypto.randomBytes(16).toString('hex');
}

export function generateOTP() {
	return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function hashPassword(password) {
	return bcrypt.hash(password, 10);
}

export async function verifyPassword(password, hash) {
	return bcrypt.compare(password, hash);
}

export function generateToken(userId, email, role) {
	const payload = {
		userId,
		email,
		role,
		iat: Math.floor(Date.now() / 1000),
		exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60 // 7 days
	};

	// Simple JWT implementation
	const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64');
	const body = Buffer.from(JSON.stringify(payload)).toString('base64');
	const signature = crypto
		.createHmac('sha256', process.env.JWT_SECRET || 'dev-secret')
		.update(`${header}.${body}`)
		.digest('base64');

	return `${header}.${body}.${signature}`;
}

export function verifyToken(token) {
	try {
		const [header, body, signature] = token.split('.');
		const expectedSignature = crypto
			.createHmac('sha256', process.env.JWT_SECRET || 'dev-secret')
			.update(`${header}.${body}`)
			.digest('base64');

		if (signature !== expectedSignature) {
			return null;
		}

		const payload = JSON.parse(Buffer.from(body, 'base64').toString());

		if (payload.exp < Math.floor(Date.now() / 1000)) {
			return null;
		}

		return {
			userId: payload.userId,
			email: payload.email,
			role: payload.role
		};
	} catch (error) {
		return null;
	}
}

export function getCurrentDateTime() {
	return new Date().toISOString();
}

export function getDateOnly(date = new Date()) {
	return date.toISOString().split('T')[0];
}

export function calculateBookingDuration(startTime, endTime) {
	const [startHour, startMin] = startTime.split(':').map(Number);
	const [endHour, endMin] = endTime.split(':').map(Number);
	const startTotalMin = startHour * 60 + startMin;
	const endTotalMin = endHour * 60 + endMin;
	return endTotalMin - startTotalMin;
}

export function validateEmail(email) {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

export function validatePassword(password) {
	return {
		valid: true,
		errors: []
	}
}
