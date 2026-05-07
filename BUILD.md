# Build Instructions

## Using Docker Compose (Recommended)

### Prerequisites
- Docker Desktop installed and running

### Step 1: Clone and Navigate
```bash
cd expense-tracker
```

### Step 2: Configure Environment
```bash
# Copy example env file
cp backend/.env.example backend/.env

# Edit backend/.env with your settings (optional for development)
```

### Step 3: Start All Services
```bash
docker-compose up -d
```

### Step 4: Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Full Stack (via Nginx)**: http://localhost

### Step 5: Stop Services
```bash
docker-compose down
```

---

## Manual Setup (Without Docker)

### Backend Setup

#### Prerequisites
- Python 3.9 or higher
- PostgreSQL 12 or higher

#### Installation

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Create and activate virtual environment**
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

3. **Install Python dependencies**
```bash
pip install -r requirements.txt
```

4. **Configure database**
```bash
# Copy environment file
cp .env.example .env

# Edit .env with your PostgreSQL credentials:
# DATABASE_URL=postgresql://username:password@localhost:5432/expense_tracker
```

5. **Create database**
```bash
# Using PostgreSQL client
createdb -U username expense_tracker
```

6. **Start the backend server**
```bash
uvicorn app.main:app --reload --port 8000
```

Backend will be available at: http://localhost:8000

---

### Frontend Setup

#### Prerequisites
- Node.js 18 or higher
- npm or yarn

#### Installation

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create environment file (optional)**
```bash
cp .env.example .env

# .env content:
# VITE_API_URL=http://localhost:8000/api
```

4. **Start development server**
```bash
npm run dev
```

Frontend will be available at: http://localhost:3000

---

## Development Workflow

### Running Both Services Manually

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
uvicorn app.main:app --reload
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Building for Production

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

**Backend:**
```bash
cd backend
# Ensure all dependencies are installed
pip install -r requirements.txt
# Run with gunicorn (production ASGI server)
gunicorn app.main:app
```

---

## Database Setup

### Option 1: Using Docker Compose (Automatic)
Database is automatically created and configured when using `docker-compose up`

### Option 2: Manual PostgreSQL Setup

1. **Create database**
```sql
CREATE DATABASE expense_tracker;
CREATE USER expense_user WITH PASSWORD 'expense_password';
ALTER ROLE expense_user SET client_encoding TO 'utf8';
ALTER ROLE expense_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE expense_user SET default_transaction_deferrable TO on;
ALTER ROLE expense_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE expense_tracker TO expense_user;
```

2. **Connect to database**
```bash
psql -U expense_user -d expense_tracker -c "\dt"
```

---

## Common Issues & Solutions

### Issue: Port 8000 already in use
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :8000
kill -9 <PID>
```

### Issue: Port 3000 already in use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :3000
kill -9 <PID>
```

### Issue: PostgreSQL connection refused
1. Ensure PostgreSQL service is running
2. Check DATABASE_URL in .env
3. Verify credentials are correct
4. Check if database exists

### Issue: Python dependencies installation fails
```bash
# Upgrade pip
python -m pip install --upgrade pip

# Try again
pip install -r requirements.txt
```

### Issue: npm modules installation fails
```bash
# Clear cache
npm cache clean --force

# Remove node_modules
rm -rf node_modules package-lock.json

# Install again
npm install
```

---

## Verification

### Backend Health Check
```bash
curl http://localhost:8000/api/health
```

Expected response:
```json
{"status": "healthy", "message": "API is running"}
```

### API Documentation Access
Open browser and navigate to:
- http://localhost:8000/docs (Swagger UI)
- http://localhost:8000/redoc (ReDoc)

### Frontend Verification
Open browser and navigate to:
- http://localhost:3000

---

## Production Deployment

### Using Docker Compose
```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Scale services
docker-compose up -d --scale backend=2
```

### Environment Variables for Production
```env
# Backend .env
ENVIRONMENT=production
DEBUG=False
SECRET_KEY=your-very-secure-random-key-here
DATABASE_URL=postgresql://user:password@db-host:5432/expense_tracker
```

### Database Backup
```bash
# Backup
docker-compose exec postgres pg_dump -U expense_user expense_tracker > backup.sql

# Restore
cat backup.sql | docker-compose exec -T postgres psql -U expense_user -d expense_tracker
```

---

## Next Steps

1. Create a user account by registering at http://localhost:3000/register
2. Log in with your credentials
3. Add expense categories
4. Start tracking your expenses
5. View analytics and reports

---

For more information, see [README.md](./README.md)
