import pytest

def test_create_income_transaction(client):
    payload = {
        "title": "Monthly Salary",
        "amount": 5000.0,
        "type": "income",
        "category": "Salary",
        "account_name": "BNP Bank",
        "transaction_date": "2026-10-01",
        "notes": "Direct deposit"
    }
    response = client.post("/api/transactions", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["id"] is not None
    assert data["title"] == "Monthly Salary"
    assert data["amount"] == 5000.0
    assert data["type"] == "income"

def test_create_expense_transaction(client):
    payload = {
        "title": "Grocery Shopping",
        "amount": 150.5,
        "type": "expense",
        "category": "Food & Groceries",
        "account_name": "Citi Bank",
        "transaction_date": "2026-10-02"
    }
    response = client.post("/api/transactions", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["amount"] == 150.5
    assert data["type"] == "expense"

def test_list_transactions(client):
    client.post("/api/transactions", json={
        "title": "Freelance",
        "amount": 800.0,
        "type": "income",
        "category": "Freelancing",
        "transaction_date": "2026-10-03"
    })
    client.post("/api/transactions", json={
        "title": "Internet Bill",
        "amount": 60.0,
        "type": "expense",
        "category": "Bills & Utilities",
        "transaction_date": "2026-10-04"
    })

    response = client.get("/api/transactions")
    assert response.status_code == 200
    items = response.json()
    assert len(items) == 2

def test_get_transaction(client):
    res = client.post("/api/transactions", json={
        "title": "Book",
        "amount": 25.0,
        "type": "expense",
        "category": "Education",
        "transaction_date": "2026-10-05"
    })
    t_id = res.json()["id"]

    get_res = client.get(f"/api/transactions/{t_id}")
    assert get_res.status_code == 200
    assert get_res.json()["title"] == "Book"

    not_found = client.get("/api/transactions/99999")
    assert not_found.status_code == 404

def test_delete_transaction(client):
    res = client.post("/api/transactions", json={
        "title": "Coffee",
        "amount": 4.5,
        "type": "expense",
        "category": "Restaurants & Dining",
        "transaction_date": "2026-10-06"
    })
    t_id = res.json()["id"]

    del_res = client.delete(f"/api/transactions/{t_id}")
    assert del_res.status_code == 204

    get_res = client.get(f"/api/transactions/{t_id}")
    assert get_res.status_code == 404

def test_summary_calculation(client):
    client.post("/api/transactions", json={
        "title": "Salary",
        "amount": 3000.0,
        "type": "income",
        "category": "Salary",
        "transaction_date": "2026-10-01"
    })
    client.post("/api/transactions", json={
        "title": "Rent",
        "amount": 1000.0,
        "type": "expense",
        "category": "Rent & Housing",
        "transaction_date": "2026-10-02"
    })

    res = client.get("/api/summary")
    assert res.status_code == 200
    summary = res.json()
    assert summary["total_income"] == 3000.0
    assert summary["total_expense"] == 1000.0
    assert summary["net_savings"] == 2000.0
    assert summary["transaction_count"] == 2

def test_dashboard_endpoint(client):
    res = client.get("/api/dashboard")
    assert res.status_code == 200
    data = res.json()
    assert "summary" in data
    assert "accounts" in data
    assert "category_breakdown" in data

def test_accounts_and_transfer(client):
    res = client.get("/api/accounts")
    assert res.status_code == 200
    accounts = res.json()
    assert len(accounts) >= 2

    # Perform transfer between accounts
    t_res = client.post("/api/accounts/transfers", json={
        "from_account": accounts[0]["name"],
        "to_account": accounts[1]["name"],
        "amount": 100.0,
        "transfer_date": "2026-10-17",
        "notes": "Savings allocation"
    })
    assert t_res.status_code == 201

def test_categories_and_budget(client):
    # Categories
    cats = client.get("/api/categories")
    assert cats.status_code == 200
    assert len(cats.json()) > 0

    # Budget
    b_res = client.post("/api/budgets", json={
        "category": "Food & Groceries",
        "monthly_limit": 500.0
    })
    assert b_res.status_code == 201
    budgets = client.get("/api/budgets")
    assert len(budgets.json()) >= 1

def test_goals_and_reminders(client):
    # Goal
    g_res = client.post("/api/goals", json={
        "title": "New Laptop",
        "target_amount": 1200.0,
        "current_amount": 300.0,
        "target_date": "2026-12-31"
    })
    assert g_res.status_code == 201
    gid = g_res.json()["id"]

    contrib = client.post(f"/api/goals/{gid}/contribute", json={"amount": 200.0})
    assert contrib.status_code == 200
    assert contrib.json()["current_amount"] == 500.0

    # Reminder
    r_res = client.post("/api/reminders", json={
        "title": "Pay Monthly Loan",
        "amount": 250.0,
        "due_date": "2026-10-25",
        "category": "Loan Payments"
    })
    assert r_res.status_code == 201
    rid = r_res.json()["id"]

    # Pay reminder (creates expense)
    pay_res = client.post(f"/api/reminders/{rid}/pay")
    assert pay_res.status_code == 200
    assert pay_res.json()["status"] == "Paid"
