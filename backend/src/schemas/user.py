from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from enum import Enum


class SoftwareLevel(str, Enum):
    """Enum for user's software experience level."""
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"


class HardwareBackground(str, Enum):
    """Enum for user's hardware experience."""
    ROBOTICS = "robotics"
    EMBEDDED_SYSTEMS = "embedded systems"
    NONE = "none"
    OTHER = "other"


class UserCreate(BaseModel):
    email: str
    password: str
    software_level: SoftwareLevel
    hardware_background: HardwareBackground


class UserResponse(BaseModel):
    id: str
    email: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class UserProfileCreate(BaseModel):
    software_level: SoftwareLevel
    hardware_background: HardwareBackground


class UserProfileUpdate(BaseModel):
    software_level: Optional[SoftwareLevel] = None
    hardware_background: Optional[HardwareBackground] = None


class UserProfileResponse(BaseModel):
    user_id: str
    software_level: SoftwareLevel
    hardware_background: HardwareBackground
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True