import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db.js';

export async function GET({ locals }) {
	try {
		if (!locals.user || locals.user.role !== 'admin') {
			return json({ error: 'Unauthorized' }, { status: 403 });
		}

		const users = db
			.prepare('SELECT id, email, name, surname, role, is_verified, created_at FROM users ORDER BY created_at DESC')
			.all();

		return json({ users });
	} catch (error) {
		console.error('Fetch users error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
}
