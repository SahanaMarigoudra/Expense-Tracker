from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from .. import crud, schemas
from ..database import get_db

router = APIRouter(prefix="/goals", tags=["goals"])

@router.get("", response_model=List[schemas.SavingsGoalRead])
def list_goals(db: Session = Depends(get_db)):
    return crud.get_savings_goals(db)

@router.post("", response_model=schemas.SavingsGoalRead, status_code=status.HTTP_201_CREATED)
def create_goal(goal: schemas.SavingsGoalCreate, db: Session = Depends(get_db)):
    return crud.create_savings_goal(db, goal)

@router.post("/{goal_id}/contribute", response_model=schemas.SavingsGoalRead)
def contribute_to_goal(goal_id: int, contribution: schemas.GoalContribution, db: Session = Depends(get_db)):
    updated = crud.contribute_to_goal(db, goal_id, contribution.amount)
    if not updated:
        raise HTTPException(status_code=404, detail="Goal not found")
    all_goals = crud.get_savings_goals(db)
    target = [g for g in all_goals if g.id == goal_id]
    return target[0] if target else updated

@router.delete("/{goal_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_goal(goal_id: int, db: Session = Depends(get_db)):
    success = crud.delete_savings_goal(db, goal_id)
    if not success:
        raise HTTPException(status_code=404, detail="Goal not found")
    return None
