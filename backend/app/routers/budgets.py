from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from .. import crud, schemas
from ..database import get_db

router = APIRouter(prefix="/budgets", tags=["budgets"])

@router.get("", response_model=List[schemas.BudgetRead])
def list_budgets(db: Session = Depends(get_db)):
    return crud.get_budgets(db)

@router.post("", response_model=schemas.BudgetRead, status_code=status.HTTP_201_CREATED)
def set_budget(budget: schemas.BudgetCreate, db: Session = Depends(get_db)):
    return crud.create_budget(db, budget)

@router.delete("/{budget_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_budget(budget_id: int, db: Session = Depends(get_db)):
    success = crud.delete_budget(db, budget_id)
    if not success:
        raise HTTPException(status_code=404, detail="Budget not found")
    return None
