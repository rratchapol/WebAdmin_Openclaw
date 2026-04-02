---
description: Testing conventions for Openclaw
---

## Testing

### Backend (Jest + Supertest)
- Test files: `src/**/__tests__/*.test.js`
- Unit test: controllers, utils, models in isolation
- Integration test: routes with supertest
- Mock MongoDB with `jest.mock` or use in-memory DB

### Running Tests
```bash
cd backend
npm test
```

### Test Structure
```js
describe('POST /api/auth/login', () => {
  it('should return JWT on valid credentials', async () => { ... });
  it('should return 401 on wrong password', async () => { ... });
});
```

### Frontend
- Test components with React Testing Library (future phase)
- Mock API calls in tests

### Coverage Goals
- Controllers: 80%+
- Middleware: 100%
- Utils: 100%
