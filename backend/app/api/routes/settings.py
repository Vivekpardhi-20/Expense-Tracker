import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.security import get_current_user, get_password_hash, verify_password
from app.db.session import get_db
from app.models.expense import UserPreference
from app.models.user import User
from app.schemas import PasswordUpdate, PreferenceBase, PreferenceResponse, ProfileUpdate, UserResponse

router = APIRouter(prefix="/api/settings", tags=["settings"])


def preference_for(user_id: str, db: Session):
    pref = db.query(UserPreference).filter(UserPreference.user_id == user_id).first()
    if not pref:
        pref = UserPreference(id=str(uuid.uuid4()), user_id=user_id)
        db.add(pref)
        db.commit()
        db.refresh(pref)
    return pref


@router.get("/profile", response_model=UserResponse)
def get_profile(current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(User).filter(User.id == current_user["sub"]).first()


@router.put("/profile", response_model=UserResponse)
def update_profile(payload: ProfileUpdate, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == current_user["sub"]).first()
    for key, value in payload.dict().items():
        setattr(user, key, value)
    db.commit()
    db.refresh(user)
    return user


@router.put("/password")
def update_password(payload: PasswordUpdate, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == current_user["sub"]).first()
    if not verify_password(payload.current_password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    user.hashed_password = get_password_hash(payload.new_password)
    db.commit()
    return {"message": "Password updated"}


@router.get("/preferences", response_model=PreferenceResponse)
def get_preferences(current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    return preference_for(current_user["sub"], db)


@router.put("/preferences", response_model=PreferenceResponse)
def update_preferences(payload: PreferenceBase, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    pref = preference_for(current_user["sub"], db)
    for key, value in payload.dict().items():
        setattr(pref, key, value)
    db.commit()
    db.refresh(pref)
    return pref
