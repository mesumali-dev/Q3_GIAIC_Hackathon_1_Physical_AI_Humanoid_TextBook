from sqlalchemy.orm import Session
from passlib.context import CryptContext
from datetime import datetime, timedelta
import uuid
import jwt
from typing import Optional

from src.config.settings import settings
from src.models.user import User
from src.services.user_service import UserService
from src.schemas.user import SoftwareLevel, HardwareBackground


# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class AuthService:
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """Verify a plain password against a hashed password."""
        return pwd_context.verify(plain_password, hashed_password)

    @staticmethod
    def get_password_hash(password: str) -> str:
        """Hash a password."""
        # Truncate password to bcrypt limit of 72 bytes
        if len(password.encode('utf-8')) > 72:
            password = password.encode('utf-8')[:72].decode('utf-8', errors='ignore')
        return pwd_context.hash(password)

    @staticmethod
    def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
        """Authenticate user by email and password."""
        user = UserService.get_user_by_email(db, email)
        if not user or not AuthService.verify_password(password, user.hashed_password):
            return None
        return user

    @staticmethod
    def create_user_with_auth(
        db: Session,
        email: str,
        password: str,
        software_level: SoftwareLevel,
        hardware_background: HardwareBackground
    ) -> User:
        """Create a new user with authentication and background profile."""
        # Hash the password
        hashed_password = AuthService.get_password_hash(password)

        # Create the user
        user = UserService.create_user(db, email, hashed_password)

        # Create the background profile
        UserService.create_user_background_profile(
            db,
            user.id,
            software_level,
            hardware_background
        )

        return user

    @staticmethod
    def generate_session_token(user_id: uuid.UUID) -> str:
        """Generate a session token for the user."""
        # In a real implementation, you would use JWT tokens or similar
        # For now, we'll create a simple token using the user ID and timestamp
        payload = {
            "user_id": str(user_id),
            "exp": datetime.utcnow() + timedelta(days=30)  # Token expires in 30 days
        }
        token = jwt.encode(payload, settings.better_auth_secret, algorithm="HS256")
        return token