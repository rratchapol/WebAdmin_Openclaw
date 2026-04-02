---
description: Git workflow for Openclaw
---

## Git Workflow

### Branch Naming
- `main` — production-ready code
- `dev` — development branch
- `feature/<name>` — new features (e.g. `feature/product-crud`)
- `fix/<name>` — bug fixes (e.g. `fix/login-error`)

### Commit Message Format
```
<type>: <short description>

Examples:
feat: add product CRUD API
fix: resolve JWT expiry bug
chore: update dependencies
docs: update README
refactor: simplify asyncHandler usage
```

### Workflow
1. Create branch from `dev`
2. Make changes
3. Commit with clear message
4. Push and open Pull Request to `dev`
5. Merge to `main` only for releases

### Rules
- Never commit `.env` files
- Never push directly to `main`
- Keep commits small and focused
