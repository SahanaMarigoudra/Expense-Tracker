from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from .. import crud, schemas
from ..database import get_db

router = APIRouter(prefix="/reminders", tags=["reminders"])

@router.get("", response_model=List[schemas.ReminderRead])
def list_reminders(db: Session = Depends(get_db)):
    return crud.get_reminders(db)

@router.post("", response_model=schemas.ReminderRead, status_code=status.HTTP_201_CREATED)
def create_reminder(reminder: schemas.ReminderCreate, db: Session = Depends(get_db)):
    return crud.create_reminder(db, reminder)

@router.post("/{reminder_id}/pay", response_model=schemas.ReminderRead)
def mark_paid(reminder_id: int, db: Session = Depends(get_db)):
    updated = crud.mark_reminder_paid(db, reminder_id, create_expense=True)
    if not updated:
        raise HTTPException(status_code=404, detail="Reminder not found")
    return updated

@router.delete("/{reminder_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_reminder(reminder_id: int, db: Session = Depends(get_db)):
    success = crud.delete_reminder(db, reminder_id)
    if not success:
        raise HTTPException(status_code=404, detail="Reminder not found")
    return None
