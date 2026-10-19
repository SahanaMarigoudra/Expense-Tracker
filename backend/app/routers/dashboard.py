from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional

from .. import crud, schemas
from ..database import get_db

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("", response_model=schemas.DashboardData)
def get_dashboard(
    account: Optional[str] = Query(None, description="Account name filter"),
    db: Session = Depends(get_db)
):
    return crud.get_dashboard_data(db, account_name=account)
