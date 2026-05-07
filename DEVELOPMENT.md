# Development Guide

## Project Setup

### Frontend Development Environment

1. **Install VSCode Extensions**
   - ES7+ React/Redux/React-Native snippets
   - Tailwind CSS IntelliSense
   - Thunder Client or REST Client for API testing
   - TypeScript Vue Plugin (Volar)

2. **Frontend Debugging**
   ```bash
   # React DevTools extension for Chrome
   # Redux DevTools for state management (future)
   ```

### Backend Development Environment

1. **Install VSCode Extensions**
   - Python
   - Pylance
   - Python Docstring Generator
   - REST Client

2. **Backend Debugging**
   ```bash
   # Use FastAPI interactive docs at http://localhost:8000/docs
   # Use ReDoc at http://localhost:8000/redoc
   ```

---

## Code Style & Standards

### Frontend (React + TypeScript)

**File Structure**
```
components/
├── DashboardStats.tsx        # Component for stats cards
├── ExpenseOverview.tsx       # Line chart component
├── CategoryExpenses.tsx      # Donut chart component
└── Header.tsx                # Header with filters

pages/
├── Dashboard.tsx             # Dashboard page component
├── AddExpense.tsx            # Add expense page
└── Expenses.tsx              # Expenses list page
```

**TypeScript Conventions**
- Use interfaces for props and state
- Avoid `any` type
- Use strict mode in tsconfig.json
- Component names in PascalCase

**React Best Practices**
- Use functional components with hooks
- Memoize expensive computations
- Lazy load components when possible
- Use custom hooks for reusable logic

**Tailwind CSS**
- Use predefined color classes
- Follow mobile-first approach
- Use responsive prefixes (sm:, md:, lg:, xl:)
- Create custom components for repeated patterns

### Backend (FastAPI + Python)

**Code Organization**
```
app/
├── api/routes/
│   ├── auth.py              # Authentication routes
│   ├── expenses.py          # Expense CRUD routes
│   ├── categories.py        # Category CRUD routes
│   └── dashboard.py         # Dashboard analytics routes
├── models/                  # SQLAlchemy models
├── schemas/                 # Pydantic schemas
├── core/
│   ├── config.py           # Configuration management
│   └── security.py         # JWT & password utilities
└── db/                      # Database utilities
```

**Python Conventions**
- Follow PEP 8 style guide
- Use type hints for all functions
- Use docstrings for complex functions
- Keep functions small and focused

**FastAPI Best Practices**
- Use dependency injection for common operations
- Validate input with Pydantic schemas
- Return appropriate HTTP status codes
- Document endpoints with docstrings

---

## Testing

### Frontend Testing

```bash
# Install testing library
npm install --save-dev @testing-library/react @testing-library/jest-dom

# Run tests
npm test

# Coverage report
npm test -- --coverage
```

### Backend Testing

```bash
# Install pytest
pip install pytest pytest-asyncio

# Run tests
pytest

# Verbose output
pytest -v

# Coverage report
pytest --cov=app
```

---

## Debugging

### Frontend Debugging

1. **Browser DevTools**
   - F12 to open DevTools
   - Sources tab for breakpoints
   - Console for logging
   - Network tab for API calls

2. **VSCode Debugging**
   ```json
   // .vscode/launch.json
   {
     "version": "0.2.0",
     "configurations": [
       {
         "type": "chrome",
         "request": "launch",
         "name": "Launch Chrome",
         "url": "http://localhost:3000",
         "webRoot": "${workspaceFolder}/frontend",
         "sourceMaps": true
       }
     ]
   }
   ```

### Backend Debugging

1. **VSCode Debugging**
   ```json
   // .vscode/launch.json
   {
     "version": "0.2.0",
     "configurations": [
       {
         "name": "FastAPI",
         "type": "python",
         "request": "launch",
         "module": "uvicorn",
         "args": ["app.main:app", "--reload"],
         "jinja": true,
         "cwd": "${workspaceFolder}/backend"
       }
     ]
   }
   ```

2. **Print Debugging**
   ```python
   import logging
   
   logger = logging.getLogger(__name__)
   logger.info("Debug message")
   ```

---

## Git Workflow

### Branching Strategy

```
main (production)
  └── develop (staging)
      ├── feature/add-expense
      ├── feature/reports
      └── bugfix/dashboard-stats
```

### Commit Messages

```
Type: Description

Types:
- feat: New feature
- fix: Bug fix
- refactor: Code reorganization
- docs: Documentation
- style: Code style changes
- test: Test additions

Example:
feat: Add expense filtering by category
```

### Pull Request Checklist

- [ ] Code follows project style guide
- [ ] All tests pass
- [ ] No console errors/warnings
- [ ] Database migrations created (if needed)
- [ ] Documentation updated
- [ ] No hardcoded secrets or credentials

---

## Performance Optimization

### Frontend

- Use React.memo for expensive components
- Implement code splitting with React.lazy
- Optimize images and assets
- Minimize bundle size with tree-shaking
- Use virtual scrolling for long lists

### Backend

- Add database indexes on frequently queried fields
- Implement caching with Redis (future)
- Use connection pooling
- Optimize N+1 queries with eager loading
- Add pagination for list endpoints

---

## Security Best Practices

### Frontend

- Never store sensitive data in localStorage
- Sanitize user inputs
- Use HTTPS in production
- Implement Content Security Policy
- Regular dependency updates

### Backend

- Hash passwords with bcrypt
- Validate all inputs
- Use HTTPS only
- Implement rate limiting
- Regular security audits
- Keep dependencies updated

---

## Logging

### Frontend

```typescript
// Use console methods appropriately
console.log('Info:', data);
console.warn('Warning:', message);
console.error('Error:', error);
```

### Backend

```python
import logging

logger = logging.getLogger(__name__)

logger.debug('Debug message')
logger.info('Info message')
logger.warning('Warning message')
logger.error('Error message')
```

---

## Common Development Tasks

### Adding a New API Endpoint

1. **Define Pydantic Schema** in `schemas/__init__.py`
2. **Create Database Model** if needed in `models/`
3. **Add Route Handler** in `api/routes/`
4. **Update Frontend Service** in `frontend/src/services/`
5. **Create Frontend Component** to use the endpoint
6. **Add Tests** for the endpoint
7. **Update API Documentation** in `API.md`

### Adding a New Frontend Page

1. **Create Component** in `pages/`
2. **Define Types** in `types/index.ts`
3. **Create Service** if needed in `services/`
4. **Add Navigation** to Sidebar
5. **Update Router** in `App.tsx`
6. **Test Components** thoroughly

### Adding a New Database Table

1. **Create SQLAlchemy Model** in `models/`
2. **Create Pydantic Schemas** for the model
3. **Create API routes** for CRUD operations
4. **Run Migrations** (when using Alembic)
5. **Update Frontend Types** and services
6. **Add Tests** for new endpoints

---

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000/api
```

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/expense_tracker
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ENVIRONMENT=development
DEBUG=True
```

---

## Useful Commands

### Frontend
```bash
npm install                # Install dependencies
npm run dev               # Start dev server
npm run build             # Build for production
npm run lint              # Run ESLint
npm run preview           # Preview production build
```

### Backend
```bash
pip install -r requirements.txt  # Install dependencies
uvicorn app.main:app --reload   # Start with auto-reload
pytest                           # Run tests
python -m pytest -v              # Verbose output
pytest --cov                     # Coverage report
```

### Docker
```bash
docker-compose up -d             # Start all services
docker-compose down              # Stop all services
docker-compose logs -f           # View logs
docker-compose build             # Rebuild images
docker ps                        # List running containers
```

---

## Troubleshooting

### Frontend Issues

**Module not found error**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Tailwind CSS not working**
- Check `tailwind.config.js` content paths
- Restart dev server
- Check that CSS is imported in main file

**Hot module replacement not working**
- Restart dev server
- Check Vite config

### Backend Issues

**Import errors**
```bash
# Ensure backend directory is in PYTHONPATH
export PYTHONPATH="${PYTHONPATH}:$(pwd)/backend"
```

**Database connection refused**
- Check PostgreSQL is running
- Verify credentials in .env
- Check network connectivity

**API endpoints not working**
- Check backend is running
- Verify endpoint URL
- Check authorization headers
- View logs for errors

---

For more details on specific topics, refer to:
- [README.md](./README.md) - Project overview
- [BUILD.md](./BUILD.md) - Setup instructions
- [API.md](./API.md) - API reference
