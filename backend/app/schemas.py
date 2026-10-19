from enum import Enum
from datetime import date, datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, ConfigDict, Field

class TransactionType(str, Enum):
    income = "income"
    expense = "expense"

# ==================== TRANSACTION SCHEMAS ====================
class TransactionBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    amount: float = Field(..., gt=0)
    type: TransactionType
    category: str = Field(..., min_length=1, max_length=100)
    account_name: Optional[str] = "Main Account"
    payment_method: Optional[str] = "Card"
    transaction_date: date
    notes: Optional[str] = None

class TransactionCreate(TransactionBase):
    pass

class TransactionUpdate(BaseModel):
    title: Optional[str] = None
    amount: Optional[float] = Field(None, gt=0)
    type: Optional[TransactionType] = None
    category: Optional[str] = None
    account_name: Optional[str] = None
    payment_method: Optional[str] = None
    transaction_date: Optional[date] = None
    notes: Optional[str] = None

class TransactionRead(TransactionBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True)

class TransactionListResponse(BaseModel):
    items: List[TransactionRead]
    total: int
    page: int
    limit: int
    model_config = ConfigDict(from_attributes=True)

# ==================== ACCOUNT SCHEMAS ====================
class AccountBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    type: str = "Savings"
    opening_balance: float = 0.0
    description: Optional[str] = None
    is_active: bool = True

class AccountCreate(AccountBase):
    pass

class AccountUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
    opening_balance: Optional[float] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None

class AccountRead(AccountBase):
    id: int
    current_balance: float = 0.0
    created_at: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True)

# ==================== CATEGORY SCHEMAS ====================
class CategoryBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    type: TransactionType
    icon: Optional[str] = "Tag"
    color: Optional[str] = "#6366F1"
    is_default: bool = False

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[TransactionType] = None
    icon: Optional[str] = None
    color: Optional[str] = None

class CategoryRead(CategoryBase):
    id: int
    created_at: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True)

# ==================== TRANSFER SCHEMAS ====================
class TransferCreate(BaseModel):
    from_account: str
    to_account: str
    amount: float = Field(..., gt=0)
    transfer_date: date
    notes: Optional[str] = None

class TransferRead(TransferCreate):
    id: int
    created_at: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True)

# ==================== BUDGET SCHEMAS ====================
class BudgetBase(BaseModel):
    category: str
    monthly_limit: float = Field(..., gt=0)
    month: Optional[int] = None
    year: Optional[int] = None

class BudgetCreate(BudgetBase):
    pass

class BudgetRead(BudgetBase):
    id: int
    spent: float = 0.0
    remaining: float = 0.0
    percentage: float = 0.0
    created_at: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True)

# ==================== SAVINGS GOAL SCHEMAS ====================
class SavingsGoalBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=100)
    target_amount: float = Field(..., gt=0)
    current_amount: float = 0.0
    target_date: Optional[date] = None
    notes: Optional[str] = None

class SavingsGoalCreate(SavingsGoalBase):
    pass

class GoalContribution(BaseModel):
    amount: float = Field(..., gt=0)

class SavingsGoalRead(SavingsGoalBase):
    id: int
    progress_percentage: float = 0.0
    remaining_amount: float = 0.0
    created_at: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True)

# ==================== REMINDER SCHEMAS ====================
class ReminderBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=100)
    amount: float = Field(..., gt=0)
    due_date: date
    category: str
    frequency: str = "Monthly"
    status: str = "Upcoming"
    account_name: Optional[str] = None

class ReminderCreate(ReminderBase):
    pass

class ReminderRead(ReminderBase):
    id: int
    created_at: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True)

# ==================== DASHBOARD & REPORT SCHEMAS ====================
class Summary(BaseModel):
    total_balance: float = 0.0
    total_income: float = 0.0
    total_expense: float = 0.0
    net_savings: float = 0.0
    transaction_count: int = 0
    income_count: int = 0
    expense_count: int = 0
    balance_pct: float = 72.0
    expense_pct: float = 28.0
    income_pct: float = 100.0

class CategoryBreakdownItem(BaseModel):
    category: str
    amount: float
    percentage: float
    color: str
    icon: Optional[str] = None

class MonthlyBarItem(BaseModel):
    period: str
    income: float
    expense: float

class DashboardData(BaseModel):
    summary: Summary
    recent_transactions: List[TransactionRead]
    category_breakdown: List[CategoryBreakdownItem]
    monthly_trend: List[MonthlyBarItem]
    reminders: List[ReminderRead]
    upcoming: List[ReminderRead]
    accounts: List[AccountRead]
