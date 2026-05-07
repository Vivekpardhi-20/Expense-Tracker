from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Integer
from datetime import datetime
from app.db.session import Base

class Category(Base):
    __tablename__ = "categories"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"))
    name = Column(String, index=True)
    category_type = Column(String, default="EXPENSE")
    icon = Column(String, nullable=True)
    color = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Expense(Base):
    __tablename__ = "expenses"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"))
    category_id = Column(String, ForeignKey("categories.id"))
    title = Column(String, nullable=True)
    amount = Column(Float)
    date = Column(DateTime)
    description = Column(String, nullable=True)
    notes = Column(String, nullable=True)
    payment_mode = Column(String)
    receipt_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Income(Base):
    __tablename__ = "income"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"))
    source = Column(String)
    title = Column(String, nullable=True)
    amount = Column(Float)
    date = Column(DateTime)
    description = Column(String, nullable=True)
    notes = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Budget(Base):
    __tablename__ = "budgets"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"))
    category_id = Column(String, ForeignKey("categories.id"))
    limit_amount = Column(Float)
    month = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class RecurringExpense(Base):
    __tablename__ = "recurring_expenses"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"))
    category_id = Column(String, ForeignKey("categories.id"))
    amount = Column(Float)
    frequency = Column(String)  # daily, weekly, monthly, yearly
    start_date = Column(DateTime)
    end_date = Column(DateTime, nullable=True)
    description = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class LentMoney(Base):
    __tablename__ = "lent_money"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"))
    person_name = Column(String)
    amount = Column(Float)
    payment_mode = Column(String)
    given_date = Column(DateTime)
    expected_return_date = Column(DateTime, nullable=True)
    returned_date = Column(DateTime, nullable=True)
    status = Column(String, default="PENDING")
    notes = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Investment(Base):
    __tablename__ = "investments"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"))
    investment_type = Column(String)
    investment_name = Column(String)
    amount_invested = Column(Float)
    quantity = Column(Float, nullable=True)
    broker_name = Column(String, nullable=True)
    purchase_date = Column(DateTime)
    notes = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
