import uuid
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.db.session import get_db
from app.models.expense import Investment
from app.schemas import InvestmentCreate, InvestmentResponse

router = APIRouter(prefix="/api/investments", tags=["investments"])

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

@router.get("", response_model=list[InvestmentResponse])
def list_investments(
    month: str = None,
    year: int = None,
    from_date: str = None,
    to_date: str = None,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Investment).filter(Investment.user_id == current_user["sub"])
    start, end = date_bounds(month, year, from_date, to_date)
    if start and end:
        query = query.filter(Investment.purchase_date >= start, Investment.purchase_date < end)
    return query.order_by(Investment.purchase_date.desc()).all()


@router.post("", response_model=InvestmentResponse)
def create_investment(
    payload: InvestmentCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    investment = Investment(id=str(uuid.uuid4()), user_id=current_user["sub"], **payload.dict())
    db.add(investment)
    db.commit()
    db.refresh(investment)
    return investment


@router.delete("/{investment_id}")
def delete_investment(investment_id: str, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    investment = db.query(Investment).filter(Investment.id == investment_id, Investment.user_id == current_user["sub"]).first()
    if not investment:
        raise HTTPException(status_code=404, detail="Investment not found")
    db.delete(investment)
    db.commit()
    return {"message": "Investment deleted"}
