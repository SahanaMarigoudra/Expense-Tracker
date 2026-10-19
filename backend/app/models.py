from sqlalchemy import Column, Integer, String, Float, Date, DateTime, Text, Boolean
from datetime import datetime, timezone
from .database import Base

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    amount = Column(Float, nullable=False)
    type = Column(String(50), nullable=False)  # 'income' or 'expense'
    category = Column(String(100), nullable=False)
    account_name = Column(String(100), default="Main Account")
    payment_method = Column(String(50), default="Card")  # Cash, UPI, Debit Card, Credit Card, Bank Transfer, Other
    transaction_date = Column(Date, nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

class Account(Base):
    __tablename__ = "accounts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    type = Column(String(50), default="Savings")  # Cash Wallet, Savings, Current, UPI, Credit Card
    opening_balance = Column(Float, default=0.0)
    description = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    type = Column(String(50), nullable=False)  # 'income' or 'expense'
    icon = Column(String(50), default="Tag")
    color = Column(String(50), default="#6366F1")
    is_default = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class Transfer(Base):
    __tablename__ = "transfers"

    id = Column(Integer, primary_key=True, index=True)
    from_account = Column(String(100), nullable=False)
    to_account = Column(String(100), nullable=False)
    amount = Column(Float, nullable=False)
    transfer_date = Column(Date, nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class Budget(Base):
    __tablename__ = "budgets"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String(100), nullable=False)
    monthly_limit = Column(Float, nullable=False)
    month = Column(Integer, nullable=True)  # 1-12
    year = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class SavingsGoal(Base):
    __tablename__ = "savings_goals"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), nullable=False)
    target_amount = Column(Float, nullable=False)
    current_amount = Column(Float, default=0.0)
    target_date = Column(Date, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class Reminder(Base):
    __tablename__ = "reminders"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), nullable=False)
    amount = Column(Float, nullable=False)
    due_date = Column(Date, nullable=False)
    category = Column(String(100), nullable=False)
    frequency = Column(String(50), default="Monthly")  # One-time, Weekly, Monthly, Yearly
    status = Column(String(50), default="Upcoming")  # Upcoming, Paid, Overdue, Cancelled
    account_name = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
