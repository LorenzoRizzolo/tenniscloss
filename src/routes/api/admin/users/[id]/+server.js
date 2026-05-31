import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db.js';
import { sendApprovalNotificationEmail } from '$lib/server/email.js';

export async function DELETE({ locals, params }) {
	try {
		if (!locals.user || locals.user.role !== 'admin') {
			return json({ error: 'Unauthorized' }, { status: 403 });
		}

		const { id } = params;
		if (!id) {
			return json({ error: 'User id is required' }, { status: 400 });
		}

		if (locals.user.userId === id) {
			return json({ error: 'You cannot delete your own account' }, { status: 400 });
		}

		const user = db.prepare('SELECT id, role, email FROM users WHERE id = ?').get(id);
		if (!user) {
			return json({ error: 'User not found' }, { status: 404 });
		}

		if (user.role === 'admin') {
			const adminCount = db
				.prepare("SELECT COUNT(*) AS count FROM users WHERE role = 'admin'")
				.get();
			if (adminCount.count <= 1) {
				return json({ error: 'Cannot delete the last admin account' }, { status: 400 });
			}
		}

		const now = new Date().toISOString();

		db.prepare('UPDATE bookings SET confirmed_by = NULL, updated_at = ? WHERE confirmed_by = ?').run(
			now,
			id
		);
		db.prepare('UPDATE users SET created_by = NULL, updated_at = ? WHERE created_by = ?').run(now, id);

		db.prepare('DELETE FROM bookings WHERE user_id = ?').run(id);
		db.prepare('DELETE FROM gdpr_consents WHERE user_id = ?').run(id);
		db.prepare('DELETE FROM media WHERE uploaded_by = ?').run(id);
		db.prepare('DELETE FROM audit_logs WHERE user_id = ?').run(id);
		db.prepare('DELETE FROM otp_codes WHERE email = ?').run(user.email);
		db.prepare('DELETE FROM users WHERE id = ?').run(id);

		return json({ success: true, message: 'User deleted successfully' });
	} catch (error) {
		console.error('Delete user error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
}

export async function PATCH({ request, locals, params }) {
	try {
		if (!locals.user || (locals.user.role !== 'admin' && locals.user.role !== 'gestore')) {
			return json({ error: 'Unauthorized' }, { status: 403 });
		}

		const { id } = params;
		const { action } = await request.json();

		if (!id || !action || !['approve', 'reject'].includes(action)) {
			return json({ error: 'Invalid request' }, { status: 400 });
		}

		const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
		if (!user) {
			return json({ error: 'User not found' }, { status: 404 });
		}

		// if (user.role !== 'utente') {
		// 	return json({ error: 'Can only approve/reject utente users' }, { status: 400 });
		// }

		const now = new Date().toISOString();

		if (action === 'approve') {
			db.prepare(
				`UPDATE users SET is_approved = 1, approved_by = ?, approved_at = ?, updated_at = ? WHERE id = ?`
			).run(locals.user.userId, now, now, id);

			// Send approval email to user
			await sendApprovalNotificationEmail(user.email, user.name).catch(err => {
				console.error('Failed to send approval email:', err);
			});

			return json({ success: true, message: 'Utente approvato con successo' });
		} else if (action === 'reject') {
			// Delete user and related data
			db.prepare('DELETE FROM bookings WHERE user_id = ?').run(id);
			db.prepare('DELETE FROM gdpr_consents WHERE user_id = ?').run(id);
			db.prepare('DELETE FROM audit_logs WHERE user_id = ?').run(id);
			db.prepare('DELETE FROM otp_codes WHERE email = ?').run(user.email);
			db.prepare('DELETE FROM users WHERE id = ?').run(id);

			return json({ success: true, message: 'Utente rifiutato e rimosso' });
		}
	} catch (error) {
		console.error('User approval error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
}
