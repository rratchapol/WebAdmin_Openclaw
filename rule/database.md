---
description: Database conventions for Openclaw (MongoDB + Mongoose)
---

## Database Conventions

### Mongoose
- Define schemas in `src/models/<name>.model.js`
- Always use `{ timestamps: true }` on schemas
- Use `.select('-password')` to exclude sensitive fields
- Use `.lean()` for read-only queries for performance

### Naming
- Collections: **plural, lowercase** (auto by Mongoose)
- Fields: `camelCase`
- Ref fields: end with `Id` or use `ref` option (e.g. `categoryId`, `ref: 'Category'`)

### Indexes
- Always index frequently queried fields (email, slug, product ref)
- Use `unique: true` where needed

### Soft Delete
- Prefer `isActive: Boolean` flag over hard delete where applicable
