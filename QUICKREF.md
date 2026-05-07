# Project Summary & Quick Reference

## 📌 Project Overview

**Expense Tracker** is a full-stack personal finance management application that helps users track, audit, and analyze their daily and monthly expenses.

### Tech Stack

| Component | Technology |
|-----------|-----------|
| **Frontend** | React 18 + TypeScript + Tailwind CSS |
| **Backend** | Python FastAPI |
| **Database** | PostgreSQL 15 |
| **Charts** | Recharts |
| **Authentication** | JWT (JSON Web Tokens) |
| **Containerization** | Docker + Docker Compose |
| **Reverse Proxy** | Nginx |

---

## 🚀 Quick Start (5 minutes)

### Prerequisites
- Docker Desktop installed and running

### Setup

1. **Navigate to project directory**
```bash
cd expense-tracker
```

2. **Copy environment file**
```bash
cp backend/.env.example backend/.env
```

3. **Start all services**
```bash
# Using script (Linux/Mac)
chmod +x start.sh
./start.sh

# Using script (Windows)
start.bat

# Or manually
docker-compose up -d
```

4. **Access the application**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

---

## 📁 Project Structure

```
expense-tracker/
├── frontend/                           # React + TypeScript frontend
│   ├── src/
│   │   ├── components/                # Reusable components
│   │   │   ├── DashboardStats.tsx
│   │   │   ├── ExpenseOverview.tsx
│   │   │   ├── CategoryExpenses.tsx
│   │   │   ├── RecentTransactions.tsx
│   │   │   ├── BudgetOverview.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Header.tsx
│   │   ├── pages/                     # Page components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── AddExpense.tsx
│   │   │   └── Expenses.tsx
│   │   ├── services/                  # API services
│   │   │   ├── api.ts
│   │   │   ├── dashboard.ts
│   │   │   ├── expense.ts
│   │   │   ├── category.ts
│   │   │   └── auth.ts
│   │   ├── context/                   # React context
│   │   │   └── AuthContext.tsx
│   │   ├── types/                     # TypeScript types
│   │   │   └── index.ts
│   │   ├── App.tsx                    # Root component
│   │   ├── main.tsx                   # Entry point
│   │   └── index.css                  # Global styles
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   ├── Dockerfile
│   └── tsconfig.json
│
├── backend/                            # Python FastAPI backend
│   ├── app/
│   │   ├── api/
│   │   │   ├── routes/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── auth.py            # Authentication endpoints
│   │   │   │   ├── expenses.py        # Expense CRUD endpoints
│   │   │   │   ├── categories.py      # Category endpoints
│   │   │   │   ├── dashboard.py       # Dashboard analytics
│   │   │   │   └── reports.py         # Reports endpoints
│   │   │   └── deps.py
│   │   ├── core/
│   │   │   ├── config.py              # App configuration
│   │   │   ├── security.py            # JWT & password security
│   │   │   └── constants.py
│   │   ├── models/
│   │   │   ├── user.py                # User model
│   │   │   └── expense.py             # Expense models
│   │   ├── schemas/
│   │   │   └── __init__.py            # Pydantic schemas
│   │   ├── db/
│   │   │   ├── session.py             # Database session
│   │   │   └── __init__.py
│   │   └── main.py                    # FastAPI app
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── README.md
│   └── .env.example
│
├── docker-compose.yml                 # Docker services
├── nginx.conf                         # Nginx configuration
├── README.md                          # Project documentation
├── BUILD.md                           # Build instructions
├── API.md                             # API reference
├── DEVELOPMENT.md                     # Development guide
├── start.sh                           # Linux/Mac startup script
├── start.bat                          # Windows startup script
└── .gitignore
```

---

## 🎯 Key Features Implemented

### ✅ Dashboard
- [ ] Total Expenses Card
- [ ] Total Income Card
- [ ] Savings Card
- [ ] Transactions Count Card
- [ ] Monthly date filter
- [ ] Percentage change indicators

### ✅ Charts & Visualizations
- [ ] Daily expense line chart
- [ ] Category-wise donut chart
- [ ] Budget progress bars
- [ ] Responsive chart containers

### ✅ Expense Management
- [ ] Add new expenses
- [ ] Edit expenses
- [ ] Delete expenses
- [ ] Filter by month and category
- [ ] Receipt upload functionality

### ✅ Budget Management
- [ ] Set category budgets
- [ ] Track spending vs budget
- [ ] Visual progress indicators
- [ ] Budget alerts (over-budget detection)

### ✅ Categories
- [ ] Create custom categories
- [ ] Edit categories
- [ ] Delete categories
- [ ] Category icons and colors

### ✅ Navigation
- [ ] Responsive sidebar menu
- [ ] Mobile menu toggle
- [ ] Quick access to all sections
- [ ] User profile section

### ✅ Authentication
- [ ] User registration
- [ ] User login
- [ ] JWT token management
- [ ] Protected routes

### ✅ API Endpoints

**Authentication**
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user

**Expenses**
- GET `/api/expenses` - List expenses
- POST `/api/expenses` - Create expense
- PUT `/api/expenses/{id}` - Update expense
- DELETE `/api/expenses/{id}` - Delete expense

**Categories**
- GET `/api/categories` - List categories
- POST `/api/categories` - Create category
- PUT `/api/categories/{id}` - Update category
- DELETE `/api/categories/{id}` - Delete category

**Dashboard**
- GET `/api/dashboard/stats` - Get statistics
- GET `/api/dashboard/expense-overview` - Daily expenses
- GET `/api/dashboard/category-expenses` - Category breakdown
- GET `/api/dashboard/recent-transactions` - Recent transactions
- GET `/api/dashboard/budget-status` - Budget status

---

## 🔧 Development Commands

### Frontend Commands
```bash
cd frontend
npm install              # Install dependencies
npm run dev             # Start dev server (http://localhost:3000)
npm run build           # Build for production
npm run preview         # Preview production build
npm run lint            # Run ESLint
```

### Backend Commands
```bash
cd backend
python -m venv venv                           # Create virtual environment
source venv/bin/activate                      # Activate (Linux/Mac)
venv\Scripts\activate                         # Activate (Windows)
pip install -r requirements.txt               # Install dependencies
uvicorn app.main:app --reload                 # Start server (http://localhost:8000)
pytest                                        # Run tests
```

### Docker Commands
```bash
docker-compose up -d                          # Start all services
docker-compose down                           # Stop all services
docker-compose logs -f                        # View logs
docker-compose ps                             # List services
docker-compose build                          # Rebuild images
docker-compose exec backend bash              # Enter backend container
docker-compose exec postgres psql -U user     # Access database
```

---

## 🔐 Authentication Flow

1. **User Registration**
   - Enter username, email, password
   - Password hashed with bcrypt
   - User created in database

2. **User Login**
   - Enter email and password
   - System validates credentials
   - JWT token generated and returned

3. **Protected Requests**
   - Client includes token in Authorization header
   - Backend validates token
   - Request processed if valid
   - Returns 401 if invalid/expired

4. **Token Storage**
   - Token stored in browser localStorage
   - Included in all API requests
   - Cleared on logout

---

## 💾 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id VARCHAR PRIMARY KEY,
  username VARCHAR UNIQUE NOT NULL,
  email VARCHAR UNIQUE NOT NULL,
  hashed_password VARCHAR NOT NULL,
  first_name VARCHAR,
  last_name VARCHAR,
  is_active INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Categories Table
```sql
CREATE TABLE categories (
  id VARCHAR PRIMARY KEY,
  user_id VARCHAR FOREIGN KEY REFERENCES users(id),
  name VARCHAR NOT NULL,
  icon VARCHAR,
  color VARCHAR,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Expenses Table
```sql
CREATE TABLE expenses (
  id VARCHAR PRIMARY KEY,
  user_id VARCHAR FOREIGN KEY REFERENCES users(id),
  category_id VARCHAR FOREIGN KEY REFERENCES categories(id),
  amount FLOAT NOT NULL,
  date TIMESTAMP NOT NULL,
  description VARCHAR,
  payment_mode VARCHAR,
  receipt_url VARCHAR,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Budgets Table
```sql
CREATE TABLE budgets (
  id VARCHAR PRIMARY KEY,
  user_id VARCHAR FOREIGN KEY REFERENCES users(id),
  category_id VARCHAR FOREIGN KEY REFERENCES categories(id),
  limit_amount FLOAT NOT NULL,
  month VARCHAR,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Income Table
```sql
CREATE TABLE income (
  id VARCHAR PRIMARY KEY,
  user_id VARCHAR FOREIGN KEY REFERENCES users(id),
  source VARCHAR NOT NULL,
  amount FLOAT NOT NULL,
  date TIMESTAMP NOT NULL,
  description VARCHAR,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Recurring Expenses Table
```sql
CREATE TABLE recurring_expenses (
  id VARCHAR PRIMARY KEY,
  user_id VARCHAR FOREIGN KEY REFERENCES users(id),
  category_id VARCHAR FOREIGN KEY REFERENCES categories(id),
  amount FLOAT NOT NULL,
  frequency VARCHAR,
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  description VARCHAR,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🌐 Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/expense_tracker
SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ENVIRONMENT=development
DEBUG=True
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000/api
```

---

## 🔄 Data Flow

### Add Expense Flow
1. User fills form in Add Expense page
2. Form validation on client
3. POST request to `/api/expenses`
4. Backend validates input with Pydantic
5. Creates database record
6. Returns created expense
7. Frontend updates state
8. User redirected to expenses list

### View Dashboard Flow
1. User navigates to Dashboard
2. React component mounts
3. Multiple API calls in parallel:
   - `/api/dashboard/stats`
   - `/api/dashboard/expense-overview`
   - `/api/dashboard/category-expenses`
   - `/api/dashboard/recent-transactions`
   - `/api/dashboard/budget-status`
4. Backend queries database
5. Returns aggregated data
6. Frontend renders charts and components
7. Data updates when month filter changes

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Linux/Mac
lsof -i :3000
lsof -i :8000
kill -9 <PID>

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Database Connection Failed
- Verify PostgreSQL is running
- Check DATABASE_URL in .env
- Verify username and password
- Check database exists

### CORS Errors
- Backend has CORS enabled for all origins
- Update in production for security

### Services Won't Start
```bash
docker-compose down
docker-compose build
docker-compose up -d
docker-compose logs
```

---

## 📚 Documentation Files

- **[README.md](./README.md)** - Project overview and features
- **[BUILD.md](./BUILD.md)** - Setup and build instructions
- **[API.md](./API.md)** - Complete API reference
- **[DEVELOPMENT.md](./DEVELOPMENT.md)** - Development guide and standards

---

## 🎓 Learning Resources

### Frontend
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com)
- [Recharts](https://recharts.org)

### Backend
- [FastAPI Documentation](https://fastapi.tiangolo.com)
- [SQLAlchemy](https://docs.sqlalchemy.org)
- [Pydantic](https://docs.pydantic.dev)
- [PostgreSQL](https://www.postgresql.org/docs/)

### DevOps
- [Docker Documentation](https://docs.docker.com)
- [Docker Compose](https://docs.docker.com/compose)
- [Nginx](https://nginx.org/en/docs/)

---

## 🚀 Deployment Checklist

- [ ] Update SECRET_KEY in .env
- [ ] Set ENVIRONMENT=production
- [ ] Set DEBUG=False
- [ ] Configure database with production credentials
- [ ] Set up SSL/TLS certificates
- [ ] Configure environment-specific API URLs
- [ ] Build optimized production images
- [ ] Set up monitoring and logging
- [ ] Configure backups
- [ ] Run security audit

---

## 📞 Support

For issues or questions:
1. Check documentation files
2. Review API documentation at http://localhost:8000/docs
3. Check application logs: `docker-compose logs`
4. Review error messages in browser console

---

## 📄 License

MIT License - See LICENSE file for details

---

**Created with ❤️ for better expense tracking**

Last Updated: May 2024
Version: 1.0.0
