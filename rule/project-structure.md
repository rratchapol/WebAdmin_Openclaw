---
description: Project structure reference for Openclaw
---

## Project Structure

```
Web_Openclaw/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Business logic per resource
│   │   ├── middleware/     # auth, validation middlewares
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # Express routers
│   │   ├── utils/          # asyncHandler, response helpers
│   │   ├── app.js          # Express app setup
│   │   └── index.js        # Entry point (DB connect + listen)
│   ├── .env
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Full page components
│   │   ├── services/       # API call functions
│   │   └── utils/          # Helper functions
│   └── package.json
├── command/
│   ├── fix-issue.md
│   └── review.md
├── rule/
│   ├── api-conventions.md
│   ├── code-style.md
│   ├── database.md
│   ├── error-handling.md
│   ├── git-workflow.md
│   ├── project-structure.md
│   ├── security.md
│   └── testing.md
└── docs/
    ├── Doc.md
    └── Spec.md
```
