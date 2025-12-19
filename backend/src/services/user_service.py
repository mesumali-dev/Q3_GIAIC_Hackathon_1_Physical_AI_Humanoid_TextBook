from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import Optional
import uuid
from datetime import datetime

from src.models.user import User, UserBackgroundProfile
from src.schemas.user import UserProfileCreate, UserProfileUpdate
from src.database import SessionLocal


class UserService:
    @staticmethod
    def get_user_by_email(db: Session, email: str) -> Optional[User]:
        """Get user by email."""
        return db.query(User).filter(User.email == email).first()

    @staticmethod
    def get_user_by_id(db: Session, user_id: uuid.UUID) -> Optional[User]:
        """Get user by ID."""
        return db.query(User).filter(User.id == user_id).first()

    @staticmethod
    def create_user(db: Session, email: str, hashed_password: str) -> User:
        """Create a new user."""
        user = User(
            id=uuid.uuid4(),
            email=email,
            hashed_password=hashed_password,
            is_active=True,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def get_user_background_profile(db: Session, user_id: uuid.UUID) -> Optional[UserBackgroundProfile]:
        """Get user's background profile."""
        return db.query(UserBackgroundProfile).filter(
            UserBackgroundProfile.user_id == user_id
        ).first()

    @staticmethod
    def create_user_background_profile(
        db: Session,
        user_id: uuid.UUID,
        software_level: str,
        hardware_background: str
    ) -> UserBackgroundProfile:
        """Create user's background profile."""
        profile = UserBackgroundProfile(
            user_id=user_id,
            software_level=software_level,
            hardware_background=hardware_background,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)
        return profile

    @staticmethod
    def update_user_background_profile(
        db: Session,
        user_id: uuid.UUID,
        profile_update: UserProfileUpdate
    ) -> Optional[UserBackgroundProfile]:
        """Update user's background profile."""
        profile = db.query(UserBackgroundProfile).filter(
            UserBackgroundProfile.user_id == user_id
        ).first()

        if not profile:
            return None

        if profile_update.software_level is not None:
            profile.software_level = profile_update.software_level
        if profile_update.hardware_background is not None:
            profile.hardware_background = profile_update.hardware_background

        profile.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(profile)
        return profile