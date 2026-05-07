import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.expense import Category
from app.schemas import CategoryCreate, CategoryResponse
from app.core.security import get_current_user
from app.core.defaults import seed_default_categories

router = APIRouter(prefix="/api/categories", tags=["categories"])

@router.get("", response_model=list[CategoryResponse])
def get_categories(
    category_type: str = None,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    seed_default_categories(db, current_user["sub"], Category, uuid.uuid4)
    db.commit()
    query = db.query(Category).filter(Category.user_id == current_user["sub"])
    if category_type:
        query = query.filter(Category.category_type == category_type.upper())
    return query.order_by(Category.category_type, Category.name).all()

@router.post("", response_model=CategoryResponse)
def create_category(
    category: CategoryCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_category = Category(
        id=str(uuid.uuid4()),
        user_id=current_user["sub"],
        **category.dict()
    )
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

@router.put("/{category_id}", response_model=CategoryResponse)
def update_category(
    category_id: str,
    category: CategoryCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_category = db.query(Category).filter(
        Category.id == category_id,
        Category.user_id == current_user["sub"]
    ).first()
    
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    for key, value in category.dict().items():
        setattr(db_category, key, value)
    
    db.commit()
    db.refresh(db_category)
    return db_category

@router.delete("/{category_id}")
def delete_category(
    category_id: str,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_category = db.query(Category).filter(
        Category.id == category_id,
        Category.user_id == current_user["sub"]
    ).first()
    
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    db.delete(db_category)
    db.commit()
    return {"message": "Category deleted"}
