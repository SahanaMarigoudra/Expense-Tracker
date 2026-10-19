from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base, init_db
from .routers import transactions, summary, dashboard, accounts, categories, budgets, goals, reminders

# Initialize and migrate SQLite database tables
init_db()

app = FastAPI(
    title="SpendWise API",
    description="Full-stack SpendWise Personal Finance & Expense Management System API",
    version="2.0.0"
)

import os
from fastapi import Request

# CORS configuration: configurable via CORS_ORIGINS or safe dev defaults
cors_env = os.getenv("CORS_ORIGINS", "").strip()
if cors_env and cors_env != "*":
    origins = [o.strip() for o in cors_env.split(",") if o.strip()]
elif cors_env == "*":
    origins = ["*"]
else:
    origins = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8002",
        "http://127.0.0.1:8002",
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True if origins != ["*"] else False,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["*"],
)

# HTTP Security Headers Middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    return response

# Register routers under /api
app.include_router(dashboard.router, prefix="/api")
app.include_router(transactions.router, prefix="/api")
app.include_router(accounts.router, prefix="/api")
app.include_router(categories.router, prefix="/api")
app.include_router(budgets.router, prefix="/api")
app.include_router(goals.router, prefix="/api")
app.include_router(reminders.router, prefix="/api")
app.include_router(summary.router, prefix="/api")

@app.get("/api/health")
def health_check():
    return {"status": "healthy"}

from pathlib import Path
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi import HTTPException

# Check for production frontend build (dist directory) for unified hosting
dist_path = Path(__file__).resolve().parent.parent.parent / "dist"
if dist_path.exists() and (dist_path / "index.html").exists():
    if (dist_path / "assets").exists():
        app.mount("/assets", StaticFiles(directory=dist_path / "assets"), name="assets")
    if (dist_path / "categories").exists():
        app.mount("/categories", StaticFiles(directory=dist_path / "categories"), name="categories")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        if full_path.startswith("api/") or full_path == "api" or full_path.startswith("docs") or full_path.startswith("openapi.json"):
            raise HTTPException(status_code=404, detail="Not Found")
        file_path = dist_path / full_path
        if full_path and file_path.is_file():
            return FileResponse(file_path)
        return FileResponse(dist_path / "index.html")
else:
    @app.get("/")
    def read_root():
        return {"status": "ok", "app": "SpendWise Personal Finance API"}

