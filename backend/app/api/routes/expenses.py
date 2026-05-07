import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.expense import Expense
from app.schemas import ExpenseCreate, ExpenseResponse
from app.core.security import get_current_user
from datetime import datetime

router = APIRouter(prefix="/api/expenses", tags=["expenses"])

def month_bounds(month: str) -> tuple[datetime, datetime]:
    start = datetime.strptime(month, "%Y-%m")
    next_month = datetime(start.year + int(start.month == 12), 1 if start.month == 12 else start.month + 1, 1)
    return start, next_month

@router.get("", response_model=list[ExpenseResponse])
def get_expenses(
    month: str = None,
    category_id: str = None,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Expense).filter(Expense.user_id == current_user["sub"])
    
    if month:
        start, end = month_bounds(month)
        query = query.filter(Expense.date >= start, Expense.date < end)
    
    if category_id:
        query = query.filter(Expense.category_id == category_id)
    
    return query.all()

@router.post("", response_model=ExpenseResponse)
def create_expense(
    expense: ExpenseCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_expense = Expense(
        id=str(uuid.uuid4()),
        user_id=current_user["sub"],
        **expense.dict()
    )
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense

@router.put("/{expense_id}", response_model=ExpenseResponse)
def update_expense(
    expense_id: str,
    expense: ExpenseCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_expense = db.query(Expense).filter(
        Expense.id == expense_id,
        Expense.user_id == current_user["sub"]
    ).first()
    
    if not db_expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    
    for key, value in expense.dict().items():
        setattr(db_expense, key, value)
    
    db.commit()
    db.refresh(db_expense)
    return db_expense

@router.delete("/{expense_id}")
def delete_expense(
    expense_id: str,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_expense = db.query(Expense).filter(
        Expense.id == expense_id,
        Expense.user_id == current_user["sub"]
    ).first()
    
    if not db_expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    
    db.delete(db_expense)
    db.commit()
    return {"message": "Expense deleted"}
