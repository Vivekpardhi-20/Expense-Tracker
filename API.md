# API Reference

## Authentication Endpoints

### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "username": "rahul_verma",
  "email": "rahul@example.com",
  "password": "secure_password",
  "first_name": "Rahul",
  "last_name": "Verma"
}

Response 200:
{
  "id": "uuid",
  "username": "rahul_verma",
  "email": "rahul@example.com",
  "first_name": "Rahul",
  "last_name": "Verma",
  "created_at": "2024-05-01T00:00:00"
}
```

### Login User
```
POST /api/auth/login
Content-Type: application/x-www-form-urlencoded

email=rahul@example.com&password=secure_password

Response 200:
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

### Get Current User
```
GET /api/auth/me
Authorization: Bearer <access_token>

Response 200:
{
  "id": "uuid",
  "username": "rahul_verma",
  "email": "rahul@example.com",
  "first_name": "Rahul",
  "last_name": "Verma",
  "created_at": "2024-05-01T00:00:00"
}
```

---

## Expense Endpoints

### List Expenses
```
GET /api/expenses?month=2024-05&category_id=uuid
Authorization: Bearer <access_token>

Response 200:
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "category_id": "uuid",
    "amount": 650.00,
    "date": "2024-05-30T10:30:00",
    "description": "Lunch at Zomato",
    "payment_mode": "credit_card"
  }
]
```

### Create Expense
```
POST /api/expenses
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "category_id": "uuid",
  "amount": 650.00,
  "date": "2024-05-30T10:30:00",
  "description": "Lunch at Zomato",
  "payment_mode": "credit_card"
}

Response 201:
{
  "id": "uuid",
  "user_id": "uuid",
  "category_id": "uuid",
  "amount": 650.00,
  "date": "2024-05-30T10:30:00",
  "description": "Lunch at Zomato",
  "payment_mode": "credit_card"
}
```

### Update Expense
```
PUT /api/expenses/{expense_id}
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "category_id": "uuid",
  "amount": 700.00,
  "date": "2024-05-30T10:30:00",
  "description": "Dinner at Zomato",
  "payment_mode": "credit_card"
}

Response 200:
{ ...expense object }
```

### Delete Expense
```
DELETE /api/expenses/{expense_id}
Authorization: Bearer <access_token>

Response 200:
{
  "message": "Expense deleted"
}
```

---

## Category Endpoints

### List Categories
```
GET /api/categories
Authorization: Bearer <access_token>

Response 200:
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "name": "Food & Dining",
    "icon": "🍽️",
    "color": "#3B82F6"
  }
]
```

### Create Category
```
POST /api/categories
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Entertainment",
  "icon": "🎬",
  "color": "#EC4899"
}

Response 201:
{
  "id": "uuid",
  "user_id": "uuid",
  "name": "Entertainment",
  "icon": "🎬",
  "color": "#EC4899"
}
```

### Update Category
```
PUT /api/categories/{category_id}
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Entertainment & Events",
  "icon": "🎪",
  "color": "#EC4899"
}

Response 200:
{ ...category object }
```

### Delete Category
```
DELETE /api/categories/{category_id}
Authorization: Bearer <access_token>

Response 200:
{
  "message": "Category deleted"
}
```

---

## Dashboard Endpoints

### Get Dashboard Statistics
```
GET /api/dashboard/stats?month=2024-05
Authorization: Bearer <access_token>

Response 200:
{
  "total_expenses": 24650.00,
  "total_income": 55000.00,
  "savings": 30350.00,
  "total_transactions": 48,
  "expenses_change_percent": -12.55,
  "income_change_percent": 8.2,
  "savings_change_percent": 15.3,
  "transactions_change_percent": -5.0
}
```

### Get Expense Overview
```
GET /api/dashboard/expense-overview?month=2024-05
Authorization: Bearer <access_token>

Response 200:
[
  {
    "date": "2024-05-01",
    "amount": 850.00
  },
  {
    "date": "2024-05-02",
    "amount": 1200.00
  }
]
```

### Get Category-wise Expenses
```
GET /api/dashboard/category-expenses?month=2024-05
Authorization: Bearer <access_token>

Response 200:
[
  {
    "name": "Food & Dining",
    "value": 7850.00,
    "percentage": 31.8
  },
  {
    "name": "Transport",
    "value": 5420.00,
    "percentage": 22.0
  }
]
```

### Get Recent Transactions
```
GET /api/dashboard/recent-transactions?limit=10
Authorization: Bearer <access_token>

Response 200:
[
  {
    "id": "uuid",
    "type": "expense",
    "category": "Food & Dining",
    "amount": 650.00,
    "date": "2024-05-30",
    "description": "Lunch at Zomato"
  },
  {
    "id": "uuid",
    "type": "expense",
    "category": "Transport",
    "amount": 320.00,
    "date": "2024-05-30",
    "description": "Uber ride"
  }
]
```

### Get Budget Status
```
GET /api/dashboard/budget-status?month=2024-05
Authorization: Bearer <access_token>

Response 200:
[
  {
    "category": "Food & Dining",
    "spent": 7850.00,
    "limit": 10000.00,
    "percentage": 78.5
  },
  {
    "category": "Transport",
    "spent": 5420.00,
    "limit": 7000.00,
    "percentage": 77.4
  }
]
```

---

## Error Responses

### 400 Bad Request
```json
{
  "detail": "Invalid input data"
}
```

### 401 Unauthorized
```json
{
  "detail": "Invalid authentication credentials"
}
```

### 404 Not Found
```json
{
  "detail": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal server error"
}
```

---

## Rate Limiting (Future)

Rate limits will be implemented per user:
- 100 requests per minute for authenticated users
- 10 requests per minute for unauthenticated users

---

## Pagination (Future)

List endpoints will support pagination:
```
GET /api/expenses?page=1&limit=20
```

Response:
```json
{
  "items": [...],
  "total": 100,
  "page": 1,
  "limit": 20,
  "pages": 5
}
```
