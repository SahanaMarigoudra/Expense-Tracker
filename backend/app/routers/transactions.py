from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date
import io
import csv

from .. import crud, schemas
from ..database import get_db

router = APIRouter(prefix="/transactions", tags=["transactions"])

@router.post("", response_model=schemas.TransactionRead, status_code=status.HTTP_201_CREATED)
def create_transaction(transaction: schemas.TransactionCreate, db: Session = Depends(get_db)):
    try:
        return crud.create_transaction(db, transaction)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.get("", response_model=List[schemas.TransactionRead])
def list_transactions(
    type: Optional[schemas.TransactionType] = None,
    category: Optional[str] = None,
    account_name: Optional[str] = None,
    search: Optional[str] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    sort_by: str = "transaction_date",
    order: str = "desc",
    page: int = 1,
    limit: int = 200,
    db: Session = Depends(get_db)
):
    result = crud.get_transactions(
        db,
        type=type,
        category=category,
        account_name=account_name,
        search=search,
        start_date=start_date,
        end_date=end_date,
        sort_by=sort_by,
        order=order,
        page=page,
        limit=limit,
    )
    return result["items"]

@router.get("/export/csv")
def export_transactions_csv(
    type: Optional[schemas.TransactionType] = None,
    category: Optional[str] = None,
    account_name: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    result = crud.get_transactions(
        db,
        type=type,
        category=category,
        account_name=account_name,
        search=search,
        limit=5000
    )
    items = result["items"]

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID", "Title", "Amount", "Type", "Category", "Account", "Payment Method", "Date", "Notes"])

    for t in items:
        writer.writerow([
            t.id,
            t.title,
            t.amount,
            t.type,
            t.category,
            t.account_name,
            t.payment_method,
            t.transaction_date,
            t.notes or ""
        ])

    response = Response(content=output.getvalue(), media_type="text/csv")
    response.headers["Content-Disposition"] = "attachment; filename=spendwise_transactions.csv"
    return response

@router.get("/{transaction_id}", response_model=schemas.TransactionRead)
def get_transaction(transaction_id: int, db: Session = Depends(get_db)):
    db_obj = crud.get_transaction(db, transaction_id)
    if not db_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found")
    return db_obj

@router.put("/{transaction_id}", response_model=schemas.TransactionRead)
def update_transaction(transaction_id: int, update_data: schemas.TransactionUpdate, db: Session = Depends(get_db)):
    db_obj = crud.update_transaction(db, transaction_id, update_data)
    if not db_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found")
    return db_obj

@router.delete("/{transaction_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_transaction(transaction_id: int, db: Session = Depends(get_db)):
    success = crud.delete_transaction(db, transaction_id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found")
    return None
