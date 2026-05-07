import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.db.session import get_db
from app.models.expense import Goal, GoalContribution
from app.schemas import GoalContributionCreate, GoalCreate, GoalResponse

router = APIRouter(prefix="/api/goals", tags=["goals"])


def serialize(goal: Goal):
    return GoalResponse(
        id=goal.id,
        user_id=goal.user_id,
        name=goal.name,
        target_amount=goal.target_amount,
        current_amount=goal.current_amount or 0,
        target_date=goal.target_date,
        status=goal.status,
        notes=goal.notes,
        progress_percentage=((goal.current_amount or 0) / goal.target_amount * 100) if goal.target_amount else 0,
    )


@router.get("", response_model=list[GoalResponse])
def list_goals(current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    return [serialize(goal) for goal in db.query(Goal).filter(Goal.user_id == current_user["sub"]).order_by(Goal.target_date).all()]


@router.post("", response_model=GoalResponse)
def create_goal(payload: GoalCreate, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    goal = Goal(id=str(uuid.uuid4()), user_id=current_user["sub"], **payload.dict())
    db.add(goal)
    db.commit()
    db.refresh(goal)
    return serialize(goal)


@router.put("/{goal_id}", response_model=GoalResponse)
def update_goal(goal_id: str, payload: GoalCreate, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    goal = db.query(Goal).filter(Goal.id == goal_id, Goal.user_id == current_user["sub"]).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    for key, value in payload.dict().items():
        setattr(goal, key, value)
    db.commit()
    db.refresh(goal)
    return serialize(goal)


@router.post("/{goal_id}/contribute", response_model=GoalResponse)
def contribute(goal_id: str, payload: GoalContributionCreate, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    goal = db.query(Goal).filter(Goal.id == goal_id, Goal.user_id == current_user["sub"]).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    db.add(GoalContribution(id=str(uuid.uuid4()), goal_id=goal.id, user_id=current_user["sub"], **payload.dict()))
    goal.current_amount = (goal.current_amount or 0) + payload.amount
    if goal.current_amount >= goal.target_amount:
        goal.status = "COMPLETED"
    db.commit()
    db.refresh(goal)
    return serialize(goal)


@router.delete("/{goal_id}")
def delete_goal(goal_id: str, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    goal = db.query(Goal).filter(Goal.id == goal_id, Goal.user_id == current_user["sub"]).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    db.delete(goal)
    db.commit()
    return {"message": "Goal deleted"}
