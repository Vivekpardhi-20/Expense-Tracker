import uuid
from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.db.session import get_db
from app.models.expense import RecurringTransaction
from app.schemas import RecurringCreate, RecurringResponse

router = APIRouter(prefix="/api/recurring", tags=["recurring"])


def next_due(date, frequency):
    frequency = frequency.upper()
    if frequency == "DAILY":
        return date + timedelta(days=1)
    if frequency == "WEEKLY":
        return date + timedelta(weeks=1)
    if frequency == "YEARLY":
        return date.replace(year=date.year + 1)
    month = 1 if date.month == 12 else date.month + 1
    year = date.year + int(date.month == 12)
    return date.replace(year=year, month=month)


@router.get("", response_model=list[RecurringResponse])
def list_recurring(current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(RecurringTransaction).filter(RecurringTransaction.user_id == current_user["sub"]).order_by(RecurringTransaction.next_due_date).all()


@router.post("", response_model=RecurringResponse)
def create_recurring(payload: RecurringCreate, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    item = RecurringTransaction(id=str(uuid.uuid4()), user_id=current_user["sub"], **payload.dict())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.put("/{item_id}", response_model=RecurringResponse)
def update_recurring(item_id: str, payload: RecurringCreate, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    item = db.query(RecurringTransaction).filter(RecurringTransaction.id == item_id, RecurringTransaction.user_id == current_user["sub"]).first()
    if not item:
        raise HTTPException(status_code=404, detail="Recurring transaction not found")
    for key, value in payload.dict().items():
        setattr(item, key, value)
    db.commit()
    db.refresh(item)
    return item


@router.post("/{item_id}/mark-paid", response_model=RecurringResponse)
def mark_paid(item_id: str, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    item = db.query(RecurringTransaction).filter(RecurringTransaction.id == item_id, RecurringTransaction.user_id == current_user["sub"]).first()
    if not item:
        raise HTTPException(status_code=404, detail="Recurring transaction not found")
    item.next_due_date = next_due(item.next_due_date, item.frequency)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{item_id}")
def delete_recurring(item_id: str, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    item = db.query(RecurringTransaction).filter(RecurringTransaction.id == item_id, RecurringTransaction.user_id == current_user["sub"]).first()
    if not item:
        raise HTTPException(status_code=404, detail="Recurring transaction not found")
    db.delete(item)
    db.commit()
    return {"message": "Recurring transaction deleted"}
