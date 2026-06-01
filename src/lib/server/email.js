import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

let transporter;

export function initializeEmailService() {
	const port = parseInt(process.env.SMTP_PORT || '587');
	const secure = port === 465 ? true : false; // Use TLS for 587, SSL for 465
	
	transporter = nodemailer.createTransport({
		host: process.env.SMTP_HOST || 'smtp.gmail.com',
		port: port,
		secure: secure,
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASSWORD
		}
	});
}

export async function sendOTPEmail(email, otp, name) {
	try {
		if (!transporter) initializeEmailService();

		const mailOptions = {
			from: process.env.EMAIL_USER,
			to: email,
			subject: `🎾 Tennis Borgata Closs - Il Tuo Codice di Verifica`,
			html: `
				<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
					<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; color: white; text-align: center; border-radius: 10px 10px 0 0;">
						<h1>🎾 Tennis Borgata Closs</h1>
						<p>Verifica Email</p>
					</div>
					<div style="background: #f9f9f9; padding: 30px; text-align: center;">
						<p>Ciao <strong>${name}</strong>,</p>
						<p>Grazie per esserti registrato a Tennis Borgata Closs! Il tuo codice di verifica è:</p>
						<div style="background: white; padding: 20px; margin: 20px 0; border-radius: 8px; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #667eea;">
							${otp}
						</div>
						<p style="color: #666;">Questo codice scadrà in 10 minuti.</p>
						<p style="color: #999; font-size: 12px;">Se non ti sei registrato su questo account, ignora questa email.</p>
					</div>
					<div style="background: #333; color: white; padding: 15px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px;">
						<p>Powered by <a href="https://rizzolo.cloud" style="color: #667eea; text-decoration: none;">Rizzolo.cloud</a></p>
					</div>
				</div>
			`
		};

		await transporter.sendMail(mailOptions);
		return true;
	} catch (error) {
		console.error('Email send error:', error);
		return false;
	}
}

export async function sendBookingConfirmationEmail(email, name, bookingDate, startTime, endTime, bookingId) {
	try {
		if (!transporter) initializeEmailService();

		const mailOptions = {
			from: process.env.EMAIL_USER,
			to: email,
			subject: `🎾 Prenotazione Confermata - Tennis Borgata Closs`,
			html: `
				<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
					<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; color: white; text-align: center; border-radius: 10px 10px 0 0;">
						<h1>🎾 Tennis Borgata Closs</h1>
						<p>Conferma Prenotazione</p>
					</div>
					<div style="background: #f9f9f9; padding: 30px;">
						<p>Caro <strong>${name}</strong>,</p>
						<p>La tua prenotazione è stata confermata! Ecco i dettagli:</p>
						<div style="background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #667eea;">
							<p><strong>ID Prenotazione:</strong> ${bookingId}</p>
							<p><strong>Data:</strong> ${bookingDate}</p>
							<p><strong>Orario:</strong> ${startTime} - ${endTime}</p>
						</div>
						<p style="color: #666;">Ti preghiamo di arrivare 10 minuti prima dell'orario della tua prenotazione.</p>
					</div>
					<div style="background: #333; color: white; padding: 15px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px;">
						<p>Powered by <a href="https://rizzolo.cloud" style="color: #667eea; text-decoration: none;">Rizzolo.cloud</a></p>
					</div>
				</div>
			`
		};

		await transporter.sendMail(mailOptions);
		return true;
	} catch (error) {
		console.error('Email send error:', error);
		return false;
	}
}

export async function sendManagerBookingNotification(managerEmail, userName, bookingDate, startTime, endTime, bookingId, action) {
	try {
		if (!transporter) initializeEmailService();

		const subject = action === 'new' ? '🎾 Nuova Prenotazione - Richiede Conferma' : '🎾 Prenotazione Cancellata';
		const actionText = action === 'new' ? 'NUOVA PRENOTAZIONE - RICHIEDE CONFERMA' : 'PRENOTAZIONE CANCELLATA';

		const mailOptions = {
			from: process.env.EMAIL_USER,
			to: managerEmail,
			subject: subject,
			html: `
				<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
					<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; color: white; text-align: center; border-radius: 10px 10px 0 0;">
						<h1>🎾 Tennis Borgata Closs</h1>
						<p>${actionText}</p>
					</div>
					<div style="background: #f9f9f9; padding: 30px;">
						<p>Ciao Gestore,</p>
						<div style="background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #667eea;">
							<p><strong>Utente:</strong> ${userName}</p>
							<p><strong>ID Prenotazione:</strong> ${bookingId}</p>
							<p><strong>Data:</strong> ${bookingDate}</p>
							<p><strong>Orario:</strong> ${startTime} - ${endTime}</p>
						</div>
						<p style="color: #666;">Accedi alla dashboard per gestire questa prenotazione.</p>
					</div>
					<div style="background: #333; color: white; padding: 15px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px;">
						<p>Powered by <a href="https://rizzolo.cloud" style="color: #667eea; text-decoration: none;">Rizzolo.cloud</a></p>
					</div>
				</div>
			`
		};

		await transporter.sendMail(mailOptions);
		return true;
	} catch (error) {
		console.error('Email send error:', error);
		return false;
	}
}

export async function sendApprovalNotificationEmail(email, name) {
	try {
		if (!transporter) initializeEmailService();

		const mailOptions = {
			from: process.env.EMAIL_USER,
			to: email,
			subject: `🎾 Tennis Borgata Closs - Account Approvato`,
			html: `
				<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
					<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; color: white; text-align: center; border-radius: 10px 10px 0 0;">
						<h1>🎾 Tennis Borgata Closs</h1>
						<p>Account Approvato</p>
					</div>
					<div style="background: #f9f9f9; padding: 30px; text-align: center;">
						<p>Ciao <strong>${name}</strong>,</p>
						<p>Il tuo account per Tennis Borgata Closs è stato <strong>approvato</strong>!</p>
						<p>Ora puoi accedere alla piattaforma e prenotare i campi da tennis.</p>
						<div style="background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #667eea;">
							<p style="margin: 0; color: #333;">Accedi subito con le tue credenziali per iniziare a prenotare!</p>
						</div>
						<p style="color: #666;">Benvenuto nella community!</p>
					</div>
					<div style="background: #333; color: white; padding: 15px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px;">
						<p>Powered by <a href="https://rizzolo.cloud" style="color: #667eea; text-decoration: none;">Rizzolo.cloud</a></p>
					</div>
				</div>
			`
		};

		await transporter.sendMail(mailOptions);
		return true;
	} catch (error) {
		console.error('Email send error:', error);
		return false;
	}
}

export async function sendNewRegistrationNotification(managerEmail, userName, userEmail) {
	try {
		if (!transporter) initializeEmailService();

		const mailOptions = {
			from: process.env.EMAIL_USER,
			to: managerEmail,
			subject: `🎾 Tennis Borgata Closs - Nuovo Utente in Attesa di Approvazione`,
			html: `
				<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
					<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; color: white; text-align: center; border-radius: 10px 10px 0 0;">
						<h1>🎾 Tennis Borgata Closs</h1>
						<p>NUOVO UTENTE IN ATTESA DI APPROVAZIONE</p>
					</div>
					<div style="background: #f9f9f9; padding: 30px;">
						<p>Ciao Gestore,</p>
						<p>Un nuovo utente si è registrato ed è in attesa di approvazione:</p>
						<div style="background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #667eea;">
							<p><strong>Nome:</strong> ${userName}</p>
							<p><strong>Email:</strong> ${userEmail}</p>
						</div>
						<p style="color: #666;">Accedi al pannello di gestione per approvare o rifiutare la richiesta.</p>
					</div>
					<div style="background: #333; color: white; padding: 15px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px;">
						<p>Powered by <a href="https://rizzolo.cloud" style="color: #667eea; text-decoration: none;">Rizzolo.cloud</a></p>
					</div>
				</div>
			`
		};

		await transporter.sendMail(mailOptions);
		return true;
	} catch (error) {
		console.error('Email send error:', error);
		return false;
	}
}
