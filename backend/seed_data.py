"""
Seed script to populate initial sample transactions, budgets, goals, and reminders
into the SpendWise SQLite / PostgreSQL database.
"""
import sys
import os
from datetime import date, timedelta

# Add backend directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal, init_db
from app import models, crud

def seed():
    init_db()
    db = SessionLocal()
    try:
        # 1. Seed default accounts & categories
        crud.seed_defaults_if_empty(db)
        print("[OK] Categories and accounts verified.")

        # 2. Seed Transactions if empty
        existing_tx_count = db.query(models.Transaction).count()
        if existing_tx_count == 0:
            today = date.today()
            sample_transactions = [
                # Incomes
                {"title": "Monthly Salary", "amount": 3500.0, "type": "income", "category": "Salary", "account_name": "BNP Bank", "payment_method": "Bank Transfer", "date": today - timedelta(days=16), "notes": "Primary monthly salary deposit"},
                {"title": "Freelance Project Design", "amount": 750.0, "type": "income", "category": "Freelance", "account_name": "Citi Bank", "payment_method": "UPI", "date": today - timedelta(days=9), "notes": "Mobile app UI project payout"},
                {"title": "Stock Dividend Return", "amount": 280.0, "type": "income", "category": "Investments", "account_name": "BNP Bank", "payment_method": "Bank Transfer", "date": today - timedelta(days=3), "notes": "Quarterly dividend income"},
                {"title": "Consulting Fee", "amount": 450.0, "type": "income", "category": "Freelance", "account_name": "UPI / Digital Wallet", "payment_method": "UPI", "date": today - timedelta(days=1), "notes": "Technical review session"},

                # Expenses
                {"title": "Apartment Rent", "amount": 950.0, "type": "expense", "category": "Rent & Housing", "account_name": "BNP Bank", "payment_method": "Bank Transfer", "date": today - timedelta(days=15), "notes": "Monthly rent payment"},
                {"title": "Whole Foods Grocery", "amount": 164.50, "type": "expense", "category": "Food & Groceries", "account_name": "BNP Bank", "payment_method": "Debit Card", "date": today - timedelta(days=12), "notes": "Weekly household groceries"},
                {"title": "Electricity & Gas Bill", "amount": 88.0, "type": "expense", "category": "Bills & Utilities", "account_name": "Citi Bank", "payment_method": "UPI", "date": today - timedelta(days=10), "notes": "Power utility bill"},
                {"title": "Weekend Dinner Out", "amount": 62.40, "type": "expense", "category": "Food & Groceries", "account_name": "BNP Bank", "payment_method": "Credit Card", "date": today - timedelta(days=8), "notes": "Dinner with friends"},
                {"title": "Metro Pass & Fuel", "amount": 45.0, "type": "expense", "category": "Travel & Transport", "account_name": "Cash Wallet", "payment_method": "Cash", "date": today - timedelta(days=6), "notes": "Transit recharge"},
                {"title": "Cloud Server & Software", "amount": 29.99, "type": "expense", "category": "Bills & Utilities", "account_name": "Citi Bank", "payment_method": "Card", "date": today - timedelta(days=5), "notes": "Hosting & development tools"},
                {"title": "Amazon Home Supplies", "amount": 78.50, "type": "expense", "category": "Shopping", "account_name": "BNP Bank", "payment_method": "Credit Card", "date": today - timedelta(days=4), "notes": "Home essentials"},
                {"title": "Gym & Fitness Membership", "amount": 55.0, "type": "expense", "category": "Healthcare", "account_name": "BNP Bank", "payment_method": "Debit Card", "date": today - timedelta(days=2), "notes": "Monthly gym membership"},
                {"title": "Café Coffee & Pastries", "amount": 14.80, "type": "expense", "category": "Food & Groceries", "account_name": "UPI / Digital Wallet", "payment_method": "UPI", "date": today, "notes": "Morning coffee"},
            ]

            for tx in sample_transactions:
                db.add(models.Transaction(
                    title=tx["title"],
                    amount=tx["amount"],
                    type=tx["type"],
                    category=tx["category"],
                    account_name=tx["account_name"],
                    payment_method=tx["payment_method"],
                    transaction_date=tx["date"],
                    notes=tx["notes"]
                ))
            db.commit()
            print(f"[OK] Seeded {len(sample_transactions)} starter transactions.")
        else:
            print(f"[*] Transactions already present ({existing_tx_count} records).")

        # 3. Seed Budgets if empty
        if db.query(models.Budget).count() == 0:
            sample_budgets = [
                {"category": "Food & Groceries", "monthly_limit": 500.0},
                {"category": "Rent & Housing", "monthly_limit": 1000.0},
                {"category": "Bills & Utilities", "monthly_limit": 200.0},
                {"category": "Shopping", "monthly_limit": 250.0},
                {"category": "Travel & Transport", "monthly_limit": 150.0},
            ]
            for b in sample_budgets:
                db.add(models.Budget(
                    category=b["category"],
                    monthly_limit=b["monthly_limit"],
                    month=date.today().month,
                    year=date.today().year
                ))
            db.commit()
            print(f"[OK] Seeded {len(sample_budgets)} starter budgets.")

        # 4. Seed Savings Goals if empty
        if db.query(models.SavingsGoal).count() == 0:
            sample_goals = [
                {"title": "Emergency Fund", "target_amount": 10000.0, "current_amount": 4200.0, "target_date": date.today() + timedelta(days=180)},
                {"title": "Holiday Vacation", "target_amount": 2500.0, "current_amount": 1150.0, "target_date": date.today() + timedelta(days=90)},
                {"title": "New Tech Setup", "target_amount": 1800.0, "current_amount": 950.0, "target_date": date.today() + timedelta(days=45)},
            ]
            for g in sample_goals:
                db.add(models.SavingsGoal(
                    title=g["title"],
                    target_amount=g["target_amount"],
                    current_amount=g["current_amount"],
                    target_date=g["target_date"],
                    notes="Automated goal tracking"
                ))
            db.commit()
            print(f"[OK] Seeded {len(sample_goals)} savings goals.")

        # 5. Seed Reminders if empty
        if db.query(models.Reminder).count() == 0:
            sample_reminders = [
                {"title": "Electricity Bill Due", "amount": 85.0, "due_date": date.today() + timedelta(days=5), "category": "Bills & Utilities", "frequency": "Monthly", "account_name": "Citi Bank"},
                {"title": "Internet Subscription", "amount": 60.0, "due_date": date.today() + timedelta(days=12), "category": "Bills & Utilities", "frequency": "Monthly", "account_name": "BNP Bank"},
                {"title": "Car Insurance Renewal", "amount": 240.0, "due_date": date.today() + timedelta(days=22), "category": "Travel & Transport", "frequency": "Yearly", "account_name": "BNP Bank"},
            ]
            for r in sample_reminders:
                db.add(models.Reminder(
                    title=r["title"],
                    amount=r["amount"],
                    due_date=r["due_date"],
                    category=r["category"],
                    frequency=r["frequency"],
                    status="Upcoming",
                    account_name=r["account_name"]
                ))
            db.commit()
            print(f"[OK] Seeded {len(sample_reminders)} upcoming reminders.")

        print("=== Database Setup & Seed Completed Successfully ===")

    finally:
        db.close()

if __name__ == "__main__":
    seed()
