"""
Simple test to check database connection
"""
from src.database import engine
from src.models.user import Base

def test_db_connection():
    try:
        # Try to create the tables
        print("Attempting to create tables...")
        Base.metadata.create_all(bind=engine)
        print("Tables created successfully!")
    except Exception as e:
        print(f"Error creating tables: {e}")

if __name__ == "__main__":
    test_db_connection()