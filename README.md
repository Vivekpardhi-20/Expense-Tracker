# Expense Tracker - Full Stack Application

A modern, responsive Expense Tracker web application for managing personal finances with daily and monthly analytics.

## 🎯 Project Overview

This is a comprehensive expense tracking system built with modern web technologies:

- **Frontend**: React + TypeScript + Tailwind CSS + Recharts
- **Backend**: Python FastAPI + PostgreSQL
- **Authentication**: JWT-based
- **Charts**: Recharts for data visualization
- **Containerization**: Docker & Docker Compose
- **Reverse Proxy**: Nginx

## 📋 Features

### Dashboard
- Total Expenses, Income, Savings, and Transactions cards
- Monthly date filter
- Visual statistics with percentage changes
- Responsive design for all devices

### Analytics
- Line chart for daily expense tracking
- Donut chart for category-wise expense breakdown
- Budget overview with progress bars
- Recent transaction history

### Expense Management
- Add new expenses with category, payment mode, date, and notes
- Receipt upload functionality
- Edit and delete expenses
- Expense list with filtering and sorting

### Budget Management
- Category-wise budget limits
- Track spending vs. budget
- Visual progress indicators
- Alerts for over-budget categories

### Categories
- Create custom expense categories
- Edit and delete categories
- Color and icon customization
- Default categories included

### Reports
- Monthly expense summaries
- Category-wise reports
- Export to PDF/Excel (extensible)

### Additional Features
- Calendar view
- Recurring expense management
- Financial goals tracking
- User settings and preferences
- Secure authentication with JWT tokens

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- OR Node.js 18+, Python 3.9+, PostgreSQL 12+

### Using Docker (Recommended)

1. **Clone the repository**
```bash
git clone <repository-url>
cd expense-tracker
```

2. **Create .env files**
```bash
# Backend .env
cp backend/.env.example backend/.env
```

Update `backend/.env` with your PostgreSQL credentials:
```
DATABASE_URL=postgresql://expense_user:expense_password@postgres:5432/expense_tracker
SECRET_KEY=your-secure-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

3. **Start the application**
```bash
docker-compose up -d
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs
- Nginx: http://localhost

### Manual Setup

#### Backend Setup

1. **Create virtual environment**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

2. **Install dependencies**
```bash
pip install -r requirements.txt
```

3. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your settings
```

4. **Start the server**
```bash
uvicorn app.main:app --reload
```

Server runs on http://localhost:8000

#### Frontend Setup

1. **Install dependencies**
```bash
cd frontend
npm install
```

2. **Start development server**
```bash
npm run dev
```

Frontend runs on http://localhost:3000

## 📁 Project Structure

```
expense-tracker/
├── frontend/                    # React + TypeScript frontend
│   ├── src/
│   │   ├── components/         # Reusable React components
│   │   ├── pages/              # Page components
│   │   ├── services/           # API service layer
│   │   ├── context/            # React context for state management
│   │   ├── types/              # TypeScript type definitions
│   │   ├── hooks/              # Custom React hooks
│   │   └── App.tsx             # Root component
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── package.json
│
├── backend/                     # FastAPI backend
│   ├── app/
│   │   ├── api/
│   │   │   ├── routes/         # API route handlers
│   │   │   │   ├── auth.py
│   │   │   │   ├── expenses.py
│   │   │   │   ├── categories.py
│   │   │   │   ├── dashboard.py
│   │   │   │   └── reports.py
│   │   ├── core/
│   │   │   ├── config.py       # Configuration
│   │   │   └── security.py     # JWT & password handling
│   │   ├── models/             # SQLAlchemy models
│   │   ├── schemas/            # Pydantic schemas
│   │   ├── db/
│   │   │   └── session.py      # Database session
│   │   └── main.py             # FastAPI app entry point
│   ├── requirements.txt
│   └── Dockerfile
│
├── docker-compose.yml          # Docker compose configuration
├── nginx.conf                  # Nginx configuration
└── README.md
```

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication:

1. **Register**: Create a new account with email and password
2. **Login**: Get access token
3. **Protected Routes**: All API endpoints require valid JWT token
4. **Token Storage**: Token stored in localStorage on client

### API Authentication

Include the token in the Authorization header:
```
Authorization: Bearer <your_access_token>
```

## 📊 Database Schema

### Users Table
```sql
- id (Primary Key)
- username (Unique)
- email (Unique)
- hashed_password
- first_name
- last_name
- created_at
- updated_at
```

### Categories Table
```sql
- id (Primary Key)
- user_id (Foreign Key)
- name
- icon
- color
- created_at
- updated_at
```

### Expenses Table
```sql
- id (Primary Key)
- user_id (Foreign Key)
- category_id (Foreign Key)
- amount
- date
- description
- payment_mode
- receipt_url
- created_at
- updated_at
```

### Income Table
```sql
- id (Primary Key)
- user_id (Foreign Key)
- source
- amount
- date
- description
- created_at
- updated_at
```

### Budgets Table
```sql
- id (Primary Key)
- user_id (Foreign Key)
- category_id (Foreign Key)
- limit_amount
- month
- created_at
- updated_at
```

### Recurring Expenses Table
```sql
- id (Primary Key)
- user_id (Foreign Key)
- category_id (Foreign Key)
- amount
- frequency (daily, weekly, monthly, yearly)
- start_date
- end_date
- description
- created_at
- updated_at
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Expenses
- `GET /api/expenses` - List expenses
- `POST /api/expenses` - Create expense
- `PUT /api/expenses/{id}` - Update expense
- `DELETE /api/expenses/{id}` - Delete expense

### Categories
- `GET /api/categories` - List categories
- `POST /api/categories` - Create category
- `PUT /api/categories/{id}` - Update category
- `DELETE /api/categories/{id}` - Delete category

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/expense-overview` - Get daily expenses
- `GET /api/dashboard/category-expenses` - Get category-wise expenses
- `GET /api/dashboard/recent-transactions` - Get recent transactions
- `GET /api/dashboard/budget-status` - Get budget status

### Reports
- `GET /api/reports/monthly-summary` - Monthly report
- `GET /api/reports/category-report` - Category report
- `POST /api/reports/export` - Export report

## 📚 API Documentation

Swagger UI documentation available at:
- **Local**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🎨 UI Features

### Responsive Design
- Mobile-first approach
- Tailwind CSS for styling
- Responsive grid layouts
- Mobile navigation with sidebar toggle

### Charts & Visualizations
- Line charts for expense trends
- Donut charts for category breakdown
- Progress bars for budget tracking
- Responsive chart containers

### User Experience
- Clean, modern interface inspired by the provided design
- Loading states and error handling
- Form validation
- Confirmation dialogs for destructive actions
- Toast notifications for user feedback

## 🛠 Development

### Frontend Development

```bash
cd frontend
npm run dev        # Start dev server
npm run build      # Build for production
npm run lint       # Run ESLint
npm run preview    # Preview production build
```

### Backend Development

```bash
cd backend
uvicorn app.main:app --reload          # Start with auto-reload
pytest                                  # Run tests
python -m pytest -v                    # Run with verbose output
```

## 📦 Deployment

### Docker Compose Deployment

```bash
docker-compose up -d
```

Services will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs
- Combined: http://localhost (through Nginx)

### Environment Variables

Create `.env` file in the backend directory with:
```
DATABASE_URL=postgresql://user:password@host:5432/expense_tracker
SECRET_KEY=your-very-secure-random-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ENVIRONMENT=production
DEBUG=false
```

## 🔍 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Database Connection Error
- Ensure PostgreSQL is running
- Verify DATABASE_URL in .env
- Check PostgreSQL credentials

### API CORS Issues
- CORS is enabled for all origins in development
- Update in production for security

### Frontend Build Issues
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 🚀 Future Enhancements

- [ ] Multi-currency support
- [ ] Expense sharing between users
- [ ] Mobile app (React Native)
- [ ] AI-powered expense categorization
- [ ] Advanced filtering and search
- [ ] Email notifications
- [ ] Expense predictions
- [ ] Tax report generation
- [ ] Integration with bank APIs
- [ ] Expense OCR from receipts

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Support

For support, email support@expensetracker.com or open an issue in the repository.

---

**Happy Expense Tracking! 💰**
