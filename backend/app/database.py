import os
from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import declarative_base, sessionmaker

# Configurable database URL: defaults to local SQLite file
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./expense_tracker.db")

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def init_db():
    Base.metadata.create_all(bind=engine)
    # Check if existing transactions table needs new columns
    if DATABASE_URL.startswith("sqlite"):
        with engine.connect() as conn:
            inspector = inspect(engine)
            if "transactions" in inspector.get_table_names():
                columns = [col["name"] for col in inspector.get_columns("transactions")]
                if "account_name" not in columns:
                    conn.execute(text("ALTER TABLE transactions ADD COLUMN account_name VARCHAR(100) DEFAULT 'BNP Bank'"))
                    conn.commit()
                if "payment_method" not in columns:
                    conn.execute(text("ALTER TABLE transactions ADD COLUMN payment_method VARCHAR(50) DEFAULT 'Card'"))
                    conn.commit()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
