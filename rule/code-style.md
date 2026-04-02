---
description: Code style guide for Openclaw
---

## Code Style

### General
- Use **2-space indentation**
- Use **single quotes** for strings
- Trailing comma on multiline objects/arrays
- Max line length: 100 characters

### Naming
- Files: `kebab-case.js` (e.g. `user.model.js`, `auth.middleware.js`)
- Variables/functions: `camelCase`
- Classes/Models: `PascalCase`
- Constants: `UPPER_SNAKE_CASE`

### Backend (Node.js)
- Use `require()` (CommonJS)
- Always use `asyncHandler` for async routes
- Group imports: built-in → npm → local

### Frontend (React)
- Functional components only
- Use hooks (`useState`, `useEffect`)
- Inline styles via JS objects (ตาม Spec.md)
- Component files: `PascalCase.jsx`
