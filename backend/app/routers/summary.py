from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from datetime import date

from ..database import get_db
from .. import crud, schemas

router = APIRouter(prefix="/summary", tags=["summary"])

@router.get("", response_model=schemas.Summary)
def read_summary(
    start_date: Optional[date] = Query(None, description="Start date filter (YYYY-MM-DD)"),
    end_date: Optional[date] = Query(None, description="End date filter (YYYY-MM-DD)"),
    db: Session = Depends(get_db),
):
    return crud.get_summary(db, start_date=start_date, end_date=end_date)
