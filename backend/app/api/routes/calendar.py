from datetime import datetime, timedelta

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.db.session import get_db
from app.models.expense import Expense, Income, Investment, LentMoney

router = APIRouter(prefix="/api/calendar", tags=["calendar"])


def month_window(month: int, year: int):
    start = datetime(year, month, 1)
    end = datetime(start.year + int(start.month == 12), 1 if start.month == 12 else start.month + 1, 1)
    return start, end


@router.get("")
def month_calendar(month: int, year: int, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    start, end = month_window(month, year)
    days: dict[str, dict] = {}

    def add(date, key, amount, title):
        day = date.strftime("%Y-%m-%d")
        days.setdefault(day, {"date": day, "expenses": 0, "income": 0, "transactions": []})
        if key == "income":
            days[day]["income"] += float(amount)
        else:
            days[day]["expenses"] += float(amount)
        days[day]["transactions"].append({"type": key, "amount": float(amount), "title": title})

    for item in db.query(Expense).filter(Expense.user_id == current_user["sub"], Expense.date >= start, Expense.date < end):
        add(item.date, "expense", item.amount, item.title or item.description or "Expense")
    for item in db.query(Income).filter(Income.user_id == current_user["sub"], Income.date >= start, Income.date < end):
        add(item.date, "income", item.amount, item.title or item.source)
    for item in db.query(LentMoney).filter(LentMoney.user_id == current_user["sub"], LentMoney.given_date >= start, LentMoney.given_date < end):
        add(item.given_date, "lent", item.amount, f"Money lent to {item.person_name}")
    for item in db.query(Investment).filter(Investment.user_id == current_user["sub"], Investment.purchase_date >= start, Investment.purchase_date < end):
        add(item.purchase_date, "investment", item.amount_invested, item.investment_name)
    return list(days.values())


@router.get("/day")
def day_transactions(date: str, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    start = datetime.fromisoformat(date)
    end = start + timedelta(days=1)
    data = month_calendar(start.month, start.year, current_user, db)
    return next((item for item in data if item["date"] == start.strftime("%Y-%m-%d")), {"date": date, "expenses": 0, "income": 0, "transactions": []})
