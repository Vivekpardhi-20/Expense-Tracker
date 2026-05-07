from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import get_settings
from sqlalchemy import inspect, text
from app.api.routes import auth, expenses, categories, dashboard, reports, income, lent_money, investments
from app.db.session import engine
from app.models.user import Base
from app.models import expense

settings = get_settings()

# Create tables
Base.metadata.create_all(bind=engine)

def ensure_optional_columns():
    inspector = inspect(engine)
    additions = {
        "expenses": {
            "title": "VARCHAR",
            "notes": "VARCHAR",
        },
        "income": {
            "title": "VARCHAR",
            "notes": "VARCHAR",
        },
        "categories": {
            "category_type": "VARCHAR DEFAULT 'EXPENSE'",
        },
    }

    with engine.begin() as connection:
        for table_name, columns in additions.items():
            if not inspector.has_table(table_name):
                continue

            existing = {column["name"] for column in inspector.get_columns(table_name)}
            for column_name, column_type in columns.items():
                if column_name not in existing:
                    connection.execute(text(f"ALTER TABLE {table_name} ADD COLUMN {column_name} {column_type}"))

ensure_optional_columns()

app = FastAPI(
    title="Expense Tracker API",
    description="Backend API for Expense Tracker Application",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(expenses.router)
app.include_router(categories.router)
app.include_router(dashboard.router)
app.include_router(reports.router)
app.include_router(income.router)
app.include_router(lent_money.router)
app.include_router(investments.router)

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "message": "API is running"}

@app.get("/")
def root():
    return {
        "message": "Welcome to Expense Tracker API",
        "version": "1.0.0",
        "docs": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
