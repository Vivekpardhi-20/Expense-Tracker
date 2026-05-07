# Expense Tracker - Getting Started

Welcome to the **Expense Tracker** application! This guide will help you get started quickly.

## 🚀 First Time Setup (Choose One Method)

### Method 1: Docker (Recommended - 5 minutes)

**Requirements**: Docker Desktop installed

```bash
# 1. Navigate to project
cd expense-tracker

# 2. Run startup script
# On Linux/Mac:
chmod +x start.sh
./start.sh

# On Windows:
start.bat
```

That's it! Access the app at http://localhost:3000

### Method 2: Manual Setup (15-20 minutes)

#### Backend Setup
```bash
# 1. Navigate to backend
cd backend

# 2. Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or
venv\Scripts\activate     # Windows

# 3. Install dependencies
pip install -r requirements.txt

# 4. Create .env file
cp .env.example .env
# Edit .env with your database credentials

# 5. Start the server
uvicorn app.main:app --reload
```

Backend runs at: http://localhost:8000

#### Frontend Setup (New terminal)
```bash
# 1. Navigate to frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Frontend runs at: http://localhost:3000

---

## 📱 Using the Application

### Create Your First Account

1. Go to http://localhost:3000
2. Look for registration/login page
3. Create new account with:
   - Username
   - Email
   - Password
   - First & Last name

### Add Your First Expense

1. Click "Add Expense" in sidebar
2. Fill in details:
   - **Amount**: Enter the expense amount
   - **Category**: Select or create category
   - **Payment Mode**: Cash, Card, UPI, etc.
   - **Date**: When the expense occurred
   - **Notes**: Optional description
   - **Receipt**: Optional file upload

3. Click "Add Expense"

### View Dashboard

1. Go to Dashboard (home page)
2. See your:
   - Total expenses
   - Total income
   - Savings
   - Transaction count
   - Monthly charts and graphs
   - Budget status
   - Recent transactions

### Manage Categories

1. Go to "Categories"
2. Create custom categories for your expenses
3. Organize expenses by type

### Set Budgets

1. Go to "Budgets"
2. Set spending limits for each category
3. Track progress with visual indicators

---

## 🔧 Common Tasks

### View API Documentation

Open browser and go to: http://localhost:8000/docs

You'll see interactive documentation for all API endpoints.

### Check Service Status

```bash
# Using Docker
docker-compose ps

# Or run verification script
./verify.sh    # Linux/Mac
verify.bat     # Windows
```

### View Logs

```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres
```

### Access Database

```bash
# Using Docker
docker-compose exec postgres psql -U expense_user -d expense_tracker

# Or use any SQL client:
Host: localhost
Port: 5432
Username: expense_user
Database: expense_tracker
```

### Stop Services

```bash
docker-compose down
```

### Restart Services

```bash
docker-compose restart
```

---

## 📚 Documentation

- **[README.md](./README.md)** - Complete project overview
- **[API.md](./API.md)** - All API endpoints with examples
- **[BUILD.md](./BUILD.md)** - Detailed setup instructions
- **[DEVELOPMENT.md](./DEVELOPMENT.md)** - Development guide
- **[QUICKREF.md](./QUICKREF.md)** - Quick reference guide
- **[FILE_STRUCTURE.md](./FILE_STRUCTURE.md)** - Complete file listing

---

## 🆘 Troubleshooting

### Services not starting?
```bash
# Check Docker is running
docker ps

# Rebuild and restart
docker-compose build
docker-compose up -d
```

### Port already in use?
```bash
# Linux/Mac
lsof -i :3000
lsof -i :8000

# Windows
netstat -ano | findstr :3000
```

### Database connection failed?
1. Verify PostgreSQL is running: `docker-compose ps`
2. Check DATABASE_URL in backend/.env
3. Verify credentials are correct

### Frontend not loading?
1. Check frontend is running: `docker-compose logs frontend`
2. Verify http://localhost:3000 is accessible
3. Check browser console for errors (F12)

### API not responding?
1. Check backend is running: `docker-compose logs backend`
2. Verify http://localhost:8000/api/health returns response
3. Check for errors in terminal

---

## 🔐 Default Credentials

After setup, create your own user account. There are no default credentials for security.

---

## 🎯 What's Next?

1. ✅ Set up and run the application
2. ✅ Create your account
3. ✅ Add expense categories
4. ✅ Add your first expenses
5. ✅ Explore the dashboard
6. ✅ Set budgets for categories
7. ✅ View reports and analytics

---

## 📞 Need Help?

1. Check the relevant documentation file
2. Review API docs at http://localhost:8000/docs
3. Check logs for error messages
4. Review error messages in browser console (F12)

---

## 🚀 Production Deployment

When ready for production:

1. Update `.env` with production settings
2. Set `DEBUG=False` and `ENVIRONMENT=production`
3. Configure proper SECRET_KEY
4. Set up SSL/TLS certificates
5. Configure production database
6. Review deployment guide in [BUILD.md](./BUILD.md)

---

**Happy Tracking! 💰**

For detailed information, see the [README.md](./README.md)
