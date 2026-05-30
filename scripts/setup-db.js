#!/usr/bin/env node

import { db, initializeDatabase } from './src/lib/server/db.js';
import { generateId, hashPassword } from './src/lib/server/auth.js';
import 'dotenv/config';

async function setupDatabase() {
	try {
		console.log('🚀 Initializing Tennis Borgata Closs database...\n');

		// Initialize database schema
		initializeDatabase();
		console.log('✅ Database schema created/verified');

		// Check for existing admin
		const adminExists = db.prepare('SELECT id FROM users WHERE role = ?').get('admin');

		if (adminExists) {
			console.log('✅ Admin account already exists');
			console.log('\n📧 Admin Email:', process.env.ADMIN_EMAIL || 'admin@tennisborgatacloss.it');
			console.log('🔐 Password: (use the configured password)\n');
		} else {
			// Create admin account
			const adminId = generateId();
			const adminPassword = await hashPassword('Admin123!');
			const adminEmail = process.env.ADMIN_EMAIL || 'admin@tennisborgatacloss.it';

			db.prepare(
				`INSERT INTO users (id, email, name, surname, password_hash, role, is_verified, created_at, updated_at)
				 VALUES (?, ?, 'Admin', 'Borgata Closs', ?, 'admin', 1, datetime('now'), datetime('now'))`
			).run(adminId, adminEmail, adminPassword);

			console.log('✅ Admin account created!');
			console.log('\n📧 Admin Email:', adminEmail);
			console.log('🔐 Password: Admin123!\n');
		}

		// Create default manager account
		const managerExists = db
			.prepare('SELECT id FROM users WHERE role = ? LIMIT 1')
			.get('gestore');

		if (!managerExists) {
			const managerId = generateId();
			const managerPassword = await hashPassword('Manager123!');

			db.prepare(
				`INSERT INTO users (id, email, name, surname, password_hash, role, is_verified, created_at, updated_at)
				 VALUES (?, ?, 'Manager', 'Borgata Closs', ?, 'gestore', 1, datetime('now'), datetime('now'))`
			).run(managerId, 'manager@tennisborgatacloss.it', managerPassword);

			console.log('✅ Manager account created!');
			console.log('📧 Manager Email: manager@tennisborgatacloss.it');
			console.log('🔐 Password: Manager123!\n');
		} else {
			console.log('✅ Manager account already exists\n');
		}

		// Display setup complete message
		console.log('═'.repeat(50));
		console.log('🎾 Tennis Borgata Closs Setup Complete!');
		console.log('═'.repeat(50));
		console.log('\nNext steps:');
		console.log('1. Configure .env.local with email settings');
		console.log('2. Run: npm run dev');
		console.log('3. Visit: http://localhost:5173\n');
	} catch (error) {
		console.error('❌ Error setting up database:', error.message);
		process.exit(1);
	}
}

setupDatabase();
