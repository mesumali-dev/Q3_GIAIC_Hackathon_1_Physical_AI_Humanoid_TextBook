#!/usr/bin/env python3
"""
Script to initialize the database tables
"""
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from src.models.user import Base

def create_tables():
    """Create all database tables."""
    # Get database URL from environment
    database_url = os.getenv("DATABASE_URL", "sqlite:///./users.db")

    # Configure engine based on database type
    if database_url.startswith("sqlite"):
        engine = create_engine(
            database_url,
            connect_args={"check_same_thread": False}  # Required for SQLite
        )
    else:
        # For PostgreSQL, use connection pooling and proper SSL settings
        engine = create_engine(
            database_url,
            pool_pre_ping=True,  # Verify connections before use
            pool_recycle=300,    # Recycle connections every 5 minutes
            echo=False           # Set to True for SQL query logging
        )

    print(f"Creating database tables using URL: {database_url}...")
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")

if __name__ == "__main__":
    create_tables()