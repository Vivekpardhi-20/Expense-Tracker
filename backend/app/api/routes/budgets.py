import uuid
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.db.session import get_db
from app.models.expense import Budget, Category, Expense, Investment, LentMoney
from app.schemas import BudgetCreate, BudgetDetailResponse

router = APIRouter(prefix="/api/budgets", tags=["budgets"])


def month_window(month: str, year: int | None):
    if "-" in month:
        start = datetime.strptime(month, "%Y-%m")
    else:
        start = datetime(year or datetime.now().year, int(month), 1)
    end = datetime(start.year + int(start.month == 12), 1 if start.month == 12 else start.month + 1, 1)
    return start, end, start.strftime("%Y-%m"), start.year


def budget_detail(budget: Budget, db: Session):
    start, end, month_key, selected_year = month_window(budget.month, budget.year)
    spent = db.query(func.sum(Expense.amount)).filter(
        Expense.user_id == budget.user_id,
        Expense.category_id == budget.category_id,
        Expense.date >= start,
        Expense.date < end,
    ).scalar() or 0
    category = db.query(Category).filter(Category.id == budget.category_id).first()
    limit = budget.limit_amount or budget.amount or 0
    return BudgetDetailResponse(
        id=budget.id,
        user_id=budget.user_id,
        category_id=budget.category_id,
        category_name=budget.category_name or (category.name if category else None),
        amount=budget.amount or limit,
        limit_amount=limit,
        month=month_key,
        year=budget.year or selected_year,
        spent=float(spent),
        remaining=max(0, float(limit) - float(spent)),
        percentage=(float(spent) / float(limit) * 100) if limit else 0,
    )


@router.get("", response_model=list[BudgetDetailResponse])
def list_budgets(month: str = None, year: int = None, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    query = db.query(Budget).filter(Budget.user_id == current_user["sub"])
    if month:
        _, _, month_key, selected_year = month_window(month, year)
        query = query.filter(Budget.month == month_key)
    return [budget_detail(budget, db) for budget in query.order_by(Budget.month.desc()).all()]


@router.post("", response_model=BudgetDetailResponse)
def create_budget(payload: BudgetCreate, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    category = db.query(Category).filter(Category.id == payload.category_id, Category.user_id == current_user["sub"]).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    _, _, month_key, selected_year = month_window(payload.month, payload.year)
    budget = Budget(
        id=str(uuid.uuid4()),
        user_id=current_user["sub"],
        category_id=payload.category_id,
        category_name=payload.category_name or category.name,
        amount=payload.amount or payload.limit_amount,
        limit_amount=payload.limit_amount,
        month=month_key,
        year=payload.year or selected_year,
    )
    db.add(budget)
    db.commit()
    db.refresh(budget)
    return budget_detail(budget, db)


@router.put("/{budget_id}", response_model=BudgetDetailResponse)
def update_budget(budget_id: str, payload: BudgetCreate, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    budget = db.query(Budget).filter(Budget.id == budget_id, Budget.user_id == current_user["sub"]).first()
    if not budget:
        raise HTTPException(status_code=404, detail="Budget not found")
    _, _, month_key, selected_year = month_window(payload.month, payload.year)
    budget.category_id = payload.category_id
    budget.category_name = payload.category_name
    budget.amount = payload.amount or payload.limit_amount
    budget.limit_amount = payload.limit_amount
    budget.month = month_key
    budget.year = payload.year or selected_year
    db.commit()
    db.refresh(budget)
    return budget_detail(budget, db)


@router.delete("/{budget_id}")
def delete_budget(budget_id: str, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    budget = db.query(Budget).filter(Budget.id == budget_id, Budget.user_id == current_user["sub"]).first()
    if not budget:
        raise HTTPException(status_code=404, detail="Budget not found")
    db.delete(budget)
    db.commit()
    return {"message": "Budget deleted"}
