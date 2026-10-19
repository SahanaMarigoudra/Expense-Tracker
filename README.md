# SpendWise - Premium Personal Finance & Expense Tracker

A full-stack, state-of-the-art Personal Finance & Expense Management web application built with **FastAPI**, **SQLite**, **SQLAlchemy**, and **React 19 + TypeScript + Tailwind CSS**.

---

## ✨ Features

- **📊 Comprehensive Financial Dashboard**: Real-time balance calculations, net cashflow, monthly trends, and dynamic Recharts visual graphs.
- **💳 Multi-Account Management**: Manage multiple bank accounts (e.g., BNP Bank, Citi Bank), digital cash wallets, and perform instant funds transfers.
- **🏷️ Realistic Visual Categories**: 26+ pre-seeded categories with custom high-fidelity visuals for groceries, shopping, dining, investments, fuel, and more.
- **🎯 Budgets & Goals**: Set category budget limits with percentage progress trackers and dedicated savings goal milestones.
- **📅 Interactive Financial Calendar**: Month-by-month financial calendar showing income/expense markers on specific days, daily transaction breakdown, and month picker.
- **⏰ Bill Reminders**: Due date notifications, recurring bill tracking, and one-click "Mark as Paid" action.
- **🔒 Production-Grade Security**:
  - Parameterized ORM queries (zero SQL injection).
  - Environment-driven CORS policies.
  - HTTP Security Headers (`X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `X-XSS-Protection`, `Referrer-Policy`).
  - Sensitive environment variable exclusions in `.gitignore`.
- **📥 CSV Data Export**: One-click transaction export for spreadsheet analysis.

---

## 🛠️ Tech Stack

- **Backend**: Python 3.10+, FastAPI, Uvicorn, SQLAlchemy ORM, Pydantic v2
- **Database**: SQLite (local zero-configuration storage)
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons, Recharts
- **Containerization**: Docker & Docker Compose

---

## 🏛️ System Architecture

- **Client Application**: Single-page application built with React 19, TypeScript, Vite, and Tailwind CSS. Provides an intuitive dark-themed financial dashboard with real-time analytics, dynamic charting via Recharts, and instant responsiveness.
- **RESTful API Service**: High-performance backend engineered with FastAPI and Pydantic v2 schemas for strict request/response data validation and auto-generated OpenAPI documentation.
- **Data Persistence Layer**: Robust database storage powered by SQLAlchemy ORM with SQLite, ensuring zero external database dependencies and acid transactions.


---

## 📡 Key API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | System health check |
| `GET` | `/api/dashboard` | Aggregated dashboard state with accounts, categories, charts |
| `GET` | `/api/summary` | Net savings, total income, total expense |
| `GET` / `POST` | `/api/transactions` | List & filter transactions / Create new record |
| `DELETE` | `/api/transactions/{id}` | Remove a transaction |
| `GET` / `POST` | `/api/accounts` | Fetch all accounts / Create new account |
| `POST` | `/api/accounts/transfers` | Transfer balance between accounts |
| `GET` / `POST` | `/api/categories` | Manage custom income and expense categories |
| `GET` / `POST` | `/api/budgets` | Track category budget limits |
| `GET` / `POST` | `/api/goals` | Savings goals tracking and contributions |
| `GET` / `POST` | `/api/reminders` | Manage upcoming payment reminders |
| `GET` | `/api/transactions/export/csv` | Export all transactions to CSV file |

