from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from .. import crud, schemas
from ..database import get_db

router = APIRouter(prefix="/categories", tags=["categories"])

@router.get("", response_model=List[schemas.CategoryRead])
def list_categories(type: Optional[schemas.TransactionType] = None, db: Session = Depends(get_db)):
    crud.seed_defaults_if_empty(db)
    return crud.get_categories(db, type=type)

@router.post("", response_model=schemas.CategoryRead, status_code=status.HTTP_201_CREATED)
def create_category(category: schemas.CategoryCreate, db: Session = Depends(get_db)):
    return crud.create_category(db, category)

@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(category_id: int, db: Session = Depends(get_db)):
    try:
        success = crud.delete_category(db, category_id)
        if not success:
            raise HTTPException(status_code=404, detail="Category not found")
        return None
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
