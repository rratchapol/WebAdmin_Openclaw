---
description: Security rules for Openclaw
---

## Security Rules

### Authentication & Authorization
- Use JWT (HS256) with short expiry (7d max)
- Store JWT in `localStorage` on frontend (or `httpOnly` cookie if preferred)
- Always verify token with `protect` middleware on private routes
- Admin-only routes must use `adminOnly` middleware

### Passwords
- Hash with `bcryptjs` (saltRounds = 12)
- Never store or log plain text passwords
- Minimum password length: 6 characters

### Input Validation
- Validate all inputs with `express-validator`
- Sanitize strings to prevent XSS
- Reject unknown fields

### Environment Variables
- Never commit `.env` to version control
- Use `.env.example` as template
- Rotate secrets if exposed

### HTTP Security
- Enable CORS with explicit origin allowlist
- Apply rate limiting to `/api` routes
- Do not expose stack traces in production responses
