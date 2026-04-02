---
description: Error handling conventions for Openclaw
---

## Error Handling

### Backend
- All async route handlers **must** use `asyncHandler` wrapper
- Throw `AppError` for expected errors:
  ```js
  throw new AppError('Product not found', 404);
  ```
- Global error handler in `app.js` catches all unhandled errors
- Never return raw `err.stack` in production

### HTTP Status Codes
| Code | Meaning             |
|------|---------------------|
| 200  | Success             |
| 201  | Created             |
| 400  | Bad Request         |
| 401  | Unauthorized        |
| 403  | Forbidden           |
| 404  | Not Found           |
| 422  | Validation Error    |
| 500  | Internal Server Error |

### Frontend
- Always handle errors from API calls with try/catch
- Show user-friendly error messages (not raw error objects)
- Log errors to console only in development
