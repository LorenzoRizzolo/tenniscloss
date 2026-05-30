# 🎾 Tennis Borgata Closs - Quick Start Guide

## Installation

```bash
cd /Users/maverick/work/tenniscloss
npm install
```

## Environment Setup

```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local and add:
JWT_SECRET=your-secret-key
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=your-app-password
```

## Development

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

## Production Build

```bash
npm run build
npm run preview
```

## Database

- SQLite database at `./data.db`
- Auto-created on first run
- Default admin: `admin@tenniscloss.local` / `Admin123!`

## Key Features

✅ OTP-based registration  
✅ JWT authentication  
✅ Role-based access (admin/manager/user)  
✅ 2-hour daily booking limit  
✅ Email notifications  
✅ GDPR compliance  
✅ Modern 3D design  

## Test Credentials

**Admin Account:**
- Email: admin@tenniscloss.local
- Password: Admin123!

**Create your own:**
1. Go to /auth/register
2. Enter email, name, surname
3. Copy OTP from server logs
4. Verify and set password

## Deployment

See `DEPLOYMENT_CHECKLIST.md` for complete deployment guide.

---

**Status**: Production Ready ✅
