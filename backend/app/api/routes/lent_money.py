import uuid
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.db.session import get_db
from app.models.expense import Income, LentMoney
from app.schemas import LentMoneyCreate, LentMoneyResponse

router = APIRouter(prefix="/api/lent-money", tags=["lent-money"])

def date_bounds(month: str = None, year: int = None, from_date: str = None, to_date: str = None):
    if from_date and to_date:
        start = datetime.fromisoformat(from_date)
        end = datetime.fromisoformat(to_date)
        if len(to_date) == 10:
            end = end + timedelta(days=1)
        return start, end
    if month and "-" in month:
        start = datetime.strptime(month, "%Y-%m")
    elif month:
        start = datetime(year or datetime.now().year, int(month), 1)
    else:
        return None, None
    end = datetime(start.year + int(start.month == 12), 1 if start.month == 12 else start.month + 1, 1)
    return start, end

@router.get("", response_model=list[LentMoneyResponse])
def list_lent_money(
    month: str = None,
    year: int = None,
    from_date: str = None,
    to_date: str = None,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(LentMoney).filter(LentMoney.user_id == current_user["sub"])
    start, end = date_bounds(month, year, from_date, to_date)
    if start and end:
        query = query.filter(LentMoney.given_date >= start, LentMoney.given_date < end)
    return query.order_by(LentMoney.given_date.desc()).all()


@router.post("", response_model=LentMoneyResponse)
def create_lent_money(
    payload: LentMoneyCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    entry = LentMoney(id=str(uuid.uuid4()), user_id=current_user["sub"], status="PENDING", **payload.dict())
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


@router.post("/{entry_id}/mark-returned", response_model=LentMoneyResponse)
def mark_returned(
    entry_id: str,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    entry = db.query(LentMoney).filter(LentMoney.id == entry_id, LentMoney.user_id == current_user["sub"]).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Lent money entry not found")
    if entry.status != "RETURNED":
        entry.status = "RETURNED"
        entry.returned_date = datetime.utcnow()
    db.commit()
    db.refresh(entry)
    return entry

@router.put("/{entry_id}", response_model=LentMoneyResponse)
def update_lent_money(
    entry_id: str,
    payload: LentMoneyCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    entry = db.query(LentMoney).filter(LentMoney.id == entry_id, LentMoney.user_id == current_user["sub"]).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Lent money entry not found")
    for key, value in payload.dict().items():
        setattr(entry, key, value)
    db.commit()
    db.refresh(entry)
    return entry


@router.delete("/{entry_id}")
def delete_lent_money(entry_id: str, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    entry = db.query(LentMoney).filter(LentMoney.id == entry_id, LentMoney.user_id == current_user["sub"]).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Lent money entry not found")
    db.delete(entry)
    db.commit()
    return {"message": "Lent money entry deleted"}
