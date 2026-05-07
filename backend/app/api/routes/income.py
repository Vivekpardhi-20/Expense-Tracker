import uuid
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.db.session import get_db
from app.models.expense import Income
from app.schemas import IncomeCreate, IncomeResponse

router = APIRouter(prefix="/api/income", tags=["income"])


def month_bounds(month: str) -> tuple[datetime, datetime]:
    start = datetime.strptime(month, "%Y-%m")
    next_month = datetime(start.year + int(start.month == 12), 1 if start.month == 12 else start.month + 1, 1)
    return start, next_month


@router.get("", response_model=list[IncomeResponse])
def get_income(
    month: str = None,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = db.query(Income).filter(Income.user_id == current_user["sub"])

    if month:
        start, end = month_bounds(month)
        query = query.filter(Income.date >= start, Income.date < end)

    return query.order_by(Income.date.desc()).all()


@router.post("", response_model=IncomeResponse)
def create_income(
    income: IncomeCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    db_income = Income(
        id=str(uuid.uuid4()),
        user_id=current_user["sub"],
        **income.dict(),
    )
    db.add(db_income)
    db.commit()
    db.refresh(db_income)
    return db_income


@router.delete("/{income_id}")
def delete_income(
    income_id: str,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    db_income = db.query(Income).filter(Income.id == income_id, Income.user_id == current_user["sub"]).first()

    if not db_income:
        raise HTTPException(status_code=404, detail="Income not found")

    db.delete(db_income)
    db.commit()
    return {"message": "Income deleted"}
