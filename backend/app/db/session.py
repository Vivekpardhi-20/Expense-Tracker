import os

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, declarative_base, sessionmaker

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
DEBUG = os.getenv("DEBUG", "false").lower() == "true"

if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL is not set. Add your Neon PostgreSQL URL to backend/.env.")

engine = create_engine(DATABASE_URL, echo=DEBUG, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

try:
    connection = engine.connect()
    print("Database connected successfully")
    connection.close()
except Exception as e:
    print("Database connection failed")
    print(e)

def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
