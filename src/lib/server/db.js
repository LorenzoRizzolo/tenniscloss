import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '../../data.db');

export const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

export function initializeDatabase() {
	// Users table
	db.exec(`
		CREATE TABLE IF NOT EXISTS users (
			id TEXT PRIMARY KEY,
			email TEXT UNIQUE NOT NULL,
			name TEXT NOT NULL,
			surname TEXT NOT NULL,
			password_hash TEXT NOT NULL,
			role TEXT CHECK(role IN ('admin', 'gestore', 'utente')) DEFAULT 'utente',
			is_verified INTEGER DEFAULT 0,
			created_by TEXT,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			FOREIGN KEY (created_by) REFERENCES users(id)
		);

		CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
		CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

		-- OTP table
		CREATE TABLE IF NOT EXISTS otp_codes (
			id TEXT PRIMARY KEY,
			email TEXT NOT NULL,
			code TEXT NOT NULL,
			attempts INTEGER DEFAULT 0,
			max_attempts INTEGER DEFAULT 5,
			expires_at DATETIME NOT NULL,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP
		);

		CREATE INDEX IF NOT EXISTS idx_otp_email ON otp_codes(email);
		CREATE INDEX IF NOT EXISTS idx_otp_expires ON otp_codes(expires_at);

		-- Bookings table
		CREATE TABLE IF NOT EXISTS bookings (
			id TEXT PRIMARY KEY,
			user_id TEXT NOT NULL,
			booking_date DATE NOT NULL,
			start_time TEXT NOT NULL,
			end_time TEXT NOT NULL,
			duration_minutes INTEGER NOT NULL,
			status TEXT CHECK(status IN ('pending', 'confirmed', 'cancelled', 'completed')) DEFAULT 'pending',
			notes TEXT,
			confirmed_by TEXT,
			confirmed_at DATETIME,
			cancelled_reason TEXT,
			cancelled_at DATETIME,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			FOREIGN KEY (user_id) REFERENCES users(id),
			FOREIGN KEY (confirmed_by) REFERENCES users(id)
		);

		CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
		CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(booking_date);
		CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

		-- Settings table
		CREATE TABLE IF NOT EXISTS settings (
			key TEXT PRIMARY KEY,
			value TEXT NOT NULL,
			updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
		);

		-- Audit logs
		CREATE TABLE IF NOT EXISTS audit_logs (
			id TEXT PRIMARY KEY,
			user_id TEXT,
			action TEXT NOT NULL,
			entity_type TEXT,
			entity_id TEXT,
			old_values TEXT,
			new_values TEXT,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			FOREIGN KEY (user_id) REFERENCES users(id)
		);

		CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_logs(user_id);
		CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_logs(action);
		CREATE INDEX IF NOT EXISTS idx_audit_date ON audit_logs(created_at);

		-- Images/Media table
		CREATE TABLE IF NOT EXISTS media (
			id TEXT PRIMARY KEY,
			filename TEXT NOT NULL,
			filepath TEXT NOT NULL,
			type TEXT,
			category TEXT CHECK(category IN ('logo', 'gallery', 'hero', 'other')),
			uploaded_by TEXT NOT NULL,
			uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			FOREIGN KEY (uploaded_by) REFERENCES users(id)
		);

		-- GDPR Consent table
		CREATE TABLE IF NOT EXISTS gdpr_consents (
			id TEXT PRIMARY KEY,
			user_id TEXT NOT NULL,
			analytics INTEGER DEFAULT 0,
			marketing INTEGER DEFAULT 0,
			profiling INTEGER DEFAULT 0,
			accepted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			FOREIGN KEY (user_id) REFERENCES users(id)
		);

		-- Create indexes for performance
		CREATE INDEX IF NOT EXISTS idx_media_category ON media(category);
		CREATE INDEX IF NOT EXISTS idx_gdpr_user ON gdpr_consents(user_id);
	`);
}

export default db;
