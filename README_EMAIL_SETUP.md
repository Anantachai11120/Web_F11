## Email Backend Setup (Gmail App Password)

1. Copy `.env.example` to `.env`
2. Fill values in `.env`:
   - `SMTP_USER` = your Gmail
   - `SMTP_PASS` = 16-char App Password
   - `MAIL_FROM` = same Gmail (or allowed sender)
3. Install packages:
   - `npm install`
4. Run server:
   - `npm start`
5. Open app at:
   - `http://localhost:3000`

Room booking will call `POST /api/send-booking-email`.
If API fails, frontend falls back to `mailto:`.
