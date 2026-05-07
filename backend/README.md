# Expense Tracker Backend

A FastAPI-based backend for the Expense Tracker application with PostgreSQL database.

## Features

- JWT Authentication
- RESTful API endpoints
- Role-based access control
- Database migrations
- Comprehensive logging

## Setup

### Prerequisites

- Python 3.9+
- PostgreSQL 12+
- pip

### Installation

1. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create .env file:
```bash
cp .env.example .env
```

4. Update .env with your database credentials

5. Run migrations:
```bash
alembic upgrade head
```

6. Start the server:
```bash
uvicorn app.main:app --reload
```

Server will run on `http://localhost:8000`

## API Documentation

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Project Structure

```
backend/
├── app/
│   ├── api/
│   │   ├── routes/
│   │   │   ├── auth.py
│   │   │   ├── expenses.py
│   │   │   ├── categories.py
│   │   │   ├── budgets.py
│   │   │   ├── dashboard.py
│   │   │   └── reports.py
│   │   └── deps.py
│   ├── core/
│   │   ├── config.py
│   │   ├── security.py
│   │   └── constants.py
│   ├── models/
│   │   ├── user.py
│   │   ├── expense.py
│   │   ├── category.py
│   │   └── budget.py
│   ├── schemas/
│   │   └── (pydantic schemas)
│   ├── db/
│   │   └── session.py
│   └── main.py
├── alembic/
├── requirements.txt
└── .env.example
```
