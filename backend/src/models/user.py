from sqlalchemy import Column, String, DateTime, Enum as SQLEnum, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import enum

Base = declarative_base()


class SoftwareLevel(str, enum.Enum):
    """Enum for user's software experience level."""
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"


class HardwareBackground(str, enum.Enum):
    """Enum for user's hardware experience."""
    ROBOTICS = "robotics"
    EMBEDDED_SYSTEMS = "embedded systems"
    NONE = "none"
    OTHER = "other"


class User(Base):
    """User account model."""
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class UserBackgroundProfile(Base):
    """User background profile model for personalization."""
    __tablename__ = "user_background_profiles"

    user_id = Column(UUID(as_uuid=True), primary_key=True, index=True, unique=True)
    software_level = Column(SQLEnum(SoftwareLevel), nullable=False)
    hardware_background = Column(SQLEnum(HardwareBackground), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)