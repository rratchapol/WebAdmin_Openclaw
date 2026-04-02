---
description: API conventions for Openclaw backend
---

## API Conventions

### URL Structure
- Base: `/api/<resource>`
- Use **plural** nouns: `/api/products`, `/api/orders`
- Nested: `/api/products/:id/stocks`

### HTTP Methods
| Action        | Method | URL                  |
|---------------|--------|----------------------|
| List all      | GET    | `/api/resource`      |
| Get one       | GET    | `/api/resource/:id`  |
| Create        | POST   | `/api/resource`      |
| Update        | PUT    | `/api/resource/:id`  |
| Partial update| PATCH  | `/api/resource/:id`  |
| Delete        | DELETE | `/api/resource/:id`  |

### Response Format
```json
// Success
{ "success": true, "message": "...", "data": {} }

// Error
{ "success": false, "message": "..." }
```

### Query Parameters
- Pagination: `?page=1&limit=10`
- Search: `?search=keyword`
- Filter: `?status=active&category=xyz`
- Sort: `?sort=createdAt&order=desc`
