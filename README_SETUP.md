# 🎾 Tennis Borgata Closs - Premium Tennis Court Booking Platform

A modern, secure, and GDPR-compliant tennis court booking platform built with SvelteKit, SQLite, and Node.js.

## 🌟 Features

### User Management
- **Three User Roles**: Admin, Gestore (Manager), and Utente (User)
- **OTP-Based Registration**: Secure email verification with 6-digit OTP codes
- **Strong Password Requirements**: 8+ characters, uppercase, lowercase, numbers, and special characters
- **Secure Authentication**: JWT-based token system with HTTP-only cookie support

### Booking System
- **2-Hour Daily Limit**: Maximum 2 hours of court time per user per day
- **Real-Time Availability**: Check and manage court availability
- **Booking Status Tracking**: Pending, Confirmed, Cancelled, Completed
- **Email Notifications**: Automated emails for OTP, booking confirmations, and manager alerts

### Admin Dashboard
- **User Management**: Create and manage users of all roles
- **Statistics**: View total users, bookings, pending, and confirmed reservations
- **Booking Management**: View and manage all bookings in the system

### Manager (Gestore) Dashboard
- **Booking Confirmation**: Review and confirm pending bookings
- **Booking Cancellation**: Cancel bookings with reasons
- **Email Alerts**: Receive immediate notifications for new bookings

### User Dashboard
- **Book Court**: Create new bookings with date and time selection
- **View Bookings**: See all your bookings with status updates
- **Booking History**: Track your booking history

### GDPR Compliance
- ✅ Privacy Policy page
- ✅ GDPR rights information and data portability
- ✅ Cookie consent management
- ✅ Data access and deletion request functionality
- ✅ Audit logs for all actions

### SEO Optimization
- ✅ Meta tags and descriptions
- ✅ Structured data (Schema.org)
- ✅ Sitemap support
- ✅ Open Graph tags for social sharing
- ✅ Mobile-responsive design

### Design & UX
- **Modern 3D Design**: Gradient backgrounds and animated blobs
- **Tennis-Themed Animations**: Custom CSS animations related to tennis
- **Glassmorphism Effects**: Modern UI with glass-effect cards
- **Dark Theme**: Eye-friendly dark mode interface
- **Fully Responsive**: Mobile, tablet, and desktop optimized

## 🛠️ Tech Stack

- **Frontend**: Svelte + SvelteKit
- **Styling**: Tailwind CSS with custom animations
- **Backend**: SvelteKit Server Routes
- **Database**: SQLite with better-sqlite3
- **Authentication**: JWT tokens + OTP system
- **Email**: Nodemailer (Gmail SMTP)
- **Security**: bcryptjs for password hashing
- **Cryptography**: Node.js crypto for secure token generation

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Gmail account with App Password (for email service)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
cd /Users/maverick/work/tenniscloss
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
```bash
cp .env.example .env.local
```

Edit `.env.local` and set:
- `SMTP_HOST` and `SMTP_PORT` for email service
- `EMAIL_USER` and `EMAIL_PASSWORD` for email authentication
- `JWT_SECRET` for token signing
- `ADMIN_EMAIL` for admin account

Example Gmail configuration:
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
JWT_SECRET=your-super-secret-key
```

### 4. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 5. First Login
- Email: `admin@tennisborgatacloss.it` (or your configured `ADMIN_EMAIL`)
- Password: `Admin123!`

## 📁 Project Structure

```
src/
├── routes/
│   ├── +page.svelte                # Home page
│   ├── +layout.svelte              # Main layout
│   ├── +layout.server.js           # Server-side layout
│   ├── auth/
│   │   ├── register/               # Registration page
│   │   ├── verify-otp/             # OTP verification
│   │   └── login/                  # Login page
│   ├── dashboard/                  # User dashboard
│   ├── admin/                      # Admin dashboard
│   ├── gestore/                    # Manager dashboard
│   ├── privacy/                    # Privacy policy
│   ├── gdpr/                       # GDPR compliance page
│   └── api/
│       ├── auth/                   # Authentication endpoints
│       ├── bookings/               # Booking management
│       ├── admin/                  # Admin operations
│       └── gestore/                # Manager operations
├── lib/
│   ├── server/
│   │   ├── db.js                   # Database setup
│   │   ├── auth.js                 # Authentication utilities
│   │   └── email.js                # Email service
│   └── assets/                     # Icons and images
├── components/
│   ├── Navbar.svelte               # Navigation
│   └── Footer.svelte               # Footer with Rizzolo.cloud credit
├── app.css                         # Global styles & animations
└── hooks.server.js                 # Server hooks & initialization

static/
└── images/                         # Static images and uploads
```

## 📊 Database Schema

### Tables
- `users` - User accounts and roles
- `otp_codes` - One-time passwords for registration
- `bookings` - Court reservations
- `settings` - Application settings
- `audit_logs` - Activity logging for compliance
- `media` - Images and file uploads
- `gdpr_consents` - User consent tracking

## 🔐 Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Tokens**: Secure authentication tokens with expiration
- **OTP Verification**: Time-limited 6-digit codes
- **SQL Injection Prevention**: Parameterized queries
- **HTTPS Ready**: Compatible with SSL/TLS
- **Environment Secrets**: All sensitive data in environment variables
- **Audit Logging**: Track all user actions for GDPR compliance

## 📧 Email Configuration

### Gmail Setup
1. Enable 2-Factor Authentication on your Gmail account
2. Create an App Password: https://myaccount.google.com/apppasswords
3. Use this password in `.env.local`

### Email Types Sent
- OTP verification codes
- Booking confirmations
- Manager notifications for new bookings
- Booking status updates

## 🎨 Customization

### Change Colors
Edit `tailwind.config.js` and `src/app.css`:
- Primary gradient: `from-purple-500 to-pink-500`
- Dark background: `from-slate-900 to-slate-900`

### Change Branding
- Site name: Update in `src/routes/+layout.svelte`
- Logo: Place in `static/images/`
- Footer credit: Edit in `src/components/Footer.svelte`

### Add Images
Place images in `static/images/` and reference them:
```svelte
<img src="/images/your-image.png" alt="Description" />
```

## 📱 Responsive Design

The application is fully responsive with breakpoints for:
- Mobile: 320px - 640px
- Tablet: 640px - 1024px
- Desktop: 1024px+

## 🧪 Testing

Run the development server and test:
1. Register with email and OTP
2. Login with credentials
3. Create a booking
4. Check admin dashboard
5. Test manager approval workflow

## 📈 Performance Optimizations

- CSS animations with GPU acceleration
- Lazy loading for images
- Minified CSS with Tailwind
- SQLite WAL mode for concurrent access
- Indexed database queries

## 🛡️ GDPR Compliance Checklist

- ✅ Privacy Policy page
- ✅ GDPR rights documentation
- ✅ Data minimization
- ✅ User consent tracking
- ✅ Secure password storage
- ✅ Audit logging
- ✅ Secure email verification
- ✅ Data retention policies (consider implementing)

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables for Production
```bash
JWT_SECRET=<strong-random-key>
EMAIL_USER=<verified-email>
EMAIL_PASSWORD=<app-password>
SITE_URL=https://your-domain.com
```

### Deployment Platforms
- Vercel (recommended for SvelteKit)
- Netlify
- Railway
- Render
- DigitalOcean

## 📝 Future Enhancements

- Payment integration (if needed)
- Seasonal pricing
- Advanced statistics and reporting
- Email reminders before bookings
- Calendar view for availability
- Multi-language support
- SMS notifications
- Mobile app

## 👨‍💼 Credits

- **Developed by**: Copilot
- **Powered by**: Rizzolo.cloud
- **Framework**: SvelteKit
- **Styling**: Tailwind CSS

## 📄 License

All rights reserved. Tennis Borgata Closs © 2024

## 📞 Support

For support or issues, contact:
📧 privacy@tennisborgatacloss.it

---

**Ready to book your tennis court? Start today!** 🎾
