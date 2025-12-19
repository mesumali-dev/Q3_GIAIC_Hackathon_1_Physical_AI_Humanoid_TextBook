from fastapi import APIRouter, Depends, HTTPException, status, Form
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime, timedelta
import uuid
import jwt

from src.database import get_db
from src.models.user import User, UserBackgroundProfile, SoftwareLevel, HardwareBackground
from src.schemas.user import UserCreate, UserResponse, UserProfileCreate, UserProfileUpdate, UserProfileResponse
from src.services.user_service import UserService
from src.services.auth_service import AuthService
from src.config.settings import settings

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/signup", response_model=dict)
async def signup(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    """
    Register new user with background information
    """
    try:
        # Check if user already exists
        existing_user = UserService.get_user_by_email(db, user_data.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

        # Create user with authentication
        user = AuthService.create_user_with_auth(
            db,
            user_data.email,
            user_data.password,
            user_data.software_level,
            user_data.hardware_background
        )

        # Generate session token
        token_data = {
            "user_id": str(user.id),
            "exp": datetime.utcnow() + timedelta(days=30)  # Token expires in 30 days
        }
        session_token = jwt.encode(token_data, settings.better_auth_secret, algorithm="HS256")

        return {
            "success": True,
            "user_id": str(user.id),
            "session_token": session_token
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred during signup: {str(e)}"
        )


@router.post("/signin", response_model=dict)
async def signin(
    email: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db)
):
    """
    Authenticate existing user
    """
    try:
        user = AuthService.authenticate_user(db, email, password)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )

        # Get user's background profile
        profile = UserService.get_user_background_profile(db, user.id)

        # Generate session token
        token_data = {
            "user_id": str(user.id),
            "exp": datetime.utcnow() + timedelta(days=30)  # Token expires in 30 days
        }
        session_token = jwt.encode(token_data, settings.better_auth_secret, algorithm="HS256")

        return {
            "success": True,
            "user_id": str(user.id),
            "session_token": session_token,
            "background_profile": {
                "software_level": profile.software_level.value if profile else None,
                "hardware_background": profile.hardware_background.value if profile else None
            } if profile else None
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred during signin: {str(e)}"
        )


@router.post("/signout", response_model=dict)
async def signout():
    """
    End user session
    """
    # In a real implementation, this would invalidate the session token
    # For now, we just return success
    return {"success": True}