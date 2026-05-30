import nodemailer from 'nodemailer';

let transporter;

export function initializeEmailService() {
	transporter = nodemailer.createTransport({
		host: process.env.SMTP_HOST || 'smtp.gmail.com',
		port: parseInt(process.env.SMTP_PORT || '587'),
		secure: false,
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
			subject: `🎾 Tennis Borgata Closs - Your Verification Code`,
			html: `
				<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
					<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; color: white; text-align: center; border-radius: 10px 10px 0 0;">
						<h1>🎾 Tennis Borgata Closs</h1>
						<p>Email Verification</p>
					</div>
					<div style="background: #f9f9f9; padding: 30px; text-align: center;">
						<p>Hello <strong>${name}</strong>,</p>
						<p>Thank you for registering with Tennis Borgata Closs! Your verification code is:</p>
						<div style="background: white; padding: 20px; margin: 20px 0; border-radius: 8px; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #667eea;">
							${otp}
						</div>
						<p style="color: #666;">This code will expire in 10 minutes.</p>
						<p style="color: #999; font-size: 12px;">If you didn't register for this account, please ignore this email.</p>
					</div>
					<div style="background: #333; color: white; padding: 15px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px;">
						<p>© 2024 Tennis Borgata Closs - Powered by <a href="https://rizzolo.cloud" style="color: #667eea; text-decoration: none;">Rizzolo.cloud</a></p>
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
			subject: `🎾 Booking Confirmation - Tennis Borgata Closs`,
			html: `
				<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
					<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; color: white; text-align: center; border-radius: 10px 10px 0 0;">
						<h1>🎾 Tennis Borgata Closs</h1>
						<p>Booking Confirmation</p>
					</div>
					<div style="background: #f9f9f9; padding: 30px;">
						<p>Dear <strong>${name}</strong>,</p>
						<p>Your booking has been confirmed! Here are the details:</p>
						<div style="background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #667eea;">
							<p><strong>Booking ID:</strong> ${bookingId}</p>
							<p><strong>Date:</strong> ${bookingDate}</p>
							<p><strong>Time:</strong> ${startTime} - ${endTime}</p>
						</div>
						<p style="color: #666;">Please arrive 10 minutes before your booking time.</p>
					</div>
					<div style="background: #333; color: white; padding: 15px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px;">
						<p>© 2024 Tennis Borgata Closs - Powered by <a href="https://rizzolo.cloud" style="color: #667eea; text-decoration: none;">Rizzolo.cloud</a></p>
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

		const subject = action === 'new' ? '🎾 New Booking - Requires Confirmation' : '🎾 Booking Cancelled';
		const actionText = action === 'new' ? 'NEW BOOKING - REQUIRES CONFIRMATION' : 'BOOKING CANCELLED';

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
						<p>Hello Manager,</p>
						<div style="background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #667eea;">
							<p><strong>User:</strong> ${userName}</p>
							<p><strong>Booking ID:</strong> ${bookingId}</p>
							<p><strong>Date:</strong> ${bookingDate}</p>
							<p><strong>Time:</strong> ${startTime} - ${endTime}</p>
						</div>
						<p style="color: #666;">Please log in to the dashboard to manage this booking.</p>
					</div>
					<div style="background: #333; color: white; padding: 15px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px;">
						<p>© 2024 Tennis Borgata Closs - Powered by <a href="https://rizzolo.cloud" style="color: #667eea; text-decoration: none;">Rizzolo.cloud</a></p>
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
