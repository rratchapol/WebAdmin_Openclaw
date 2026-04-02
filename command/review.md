---
description: How to review code in this codebase
---

## Code Review Checklist

### General
- [ ] Code follows `rule/code-style.md`
- [ ] No hardcoded secrets or credentials
- [ ] No unused imports or variables

### Backend
- [ ] All async handlers wrapped with `asyncHandler`
- [ ] Input validation applied (express-validator)
- [ ] Auth/admin middleware applied on protected routes
- [ ] Response uses `sendSuccess` / `sendError` helpers
- [ ] Mongoose queries use `.select()` / `.lean()` where appropriate

### Frontend
- [ ] Components are small and focused
- [ ] No direct API calls in components (use `services/`)
- [ ] Loading and error states handled

### Security
- [ ] No sensitive data exposed in responses
- [ ] Follows `rule/security.md`
