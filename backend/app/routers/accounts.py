from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from .. import crud, schemas
from ..database import get_db

router = APIRouter(prefix="/accounts", tags=["accounts"])

@router.get("", response_model=List[schemas.AccountRead])
def list_accounts(db: Session = Depends(get_db)):
    crud.seed_defaults_if_empty(db)
    return crud.get_accounts_with_balances(db)

@router.post("", response_model=schemas.AccountRead, status_code=status.HTTP_201_CREATED)
def create_account(account: schemas.AccountCreate, db: Session = Depends(get_db)):
    return crud.create_account(db, account)

@router.post("/transfers", response_model=schemas.TransferRead, status_code=status.HTTP_201_CREATED)
def transfer_money(transfer: schemas.TransferCreate, db: Session = Depends(get_db)):
    if transfer.from_account == transfer.to_account:
        raise HTTPException(status_code=400, detail="Cannot transfer to the same account")
    return crud.create_transfer(db, transfer)

@router.get("/transfers", response_model=List[schemas.TransferRead])
def list_transfers(db: Session = Depends(get_db)):
    return crud.get_transfers(db)
