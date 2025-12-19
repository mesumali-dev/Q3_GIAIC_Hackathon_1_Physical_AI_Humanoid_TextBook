from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from typing import Optional
import uuid

from src.database import get_db
from src.models.user import User, UserBackgroundProfile
from src.schemas.user import UserProfileUpdate, UserProfileResponse
from src.services.user_service import UserService
from src.services.auth_service import AuthService
from src.middleware import auth_middleware

router = APIRouter(prefix="/api/user", tags=["user"])


async def get_current_user_id(request: Request) -> uuid.UUID:
    """
    Dependency to get the current user ID from the authorization header.
    """
    user_id = await auth_middleware.get_current_user_id(request)
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing authentication token"
        )
    return user_id


@router.get("/profile", response_model=UserProfileResponse)
async def get_user_profile(
    current_user_id: uuid.UUID = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """
    Get current user's background profile
    """
    try:
        # Verify user exists
        user = UserService.get_user_by_id(db, current_user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        # Get user's background profile
        profile = UserService.get_user_background_profile(db, current_user_id)
        if not profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User profile not found"
            )

        # Convert the profile to match the response schema (UUID to string)
        return UserProfileResponse(
            user_id=str(profile.user_id),
            software_level=profile.software_level,
            hardware_background=profile.hardware_background,
            created_at=profile.created_at,
            updated_at=profile.updated_at
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while fetching profile: {str(e)}"
        )


@router.put("/profile", response_model=UserProfileResponse)
async def update_user_profile(
    profile_update: UserProfileUpdate,
    current_user_id: uuid.UUID = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """
    Update user's background profile
    """
    try:
        # Verify user exists
        user = UserService.get_user_by_id(db, current_user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        # Update user's background profile
        updated_profile = UserService.update_user_background_profile(
            db, current_user_id, profile_update
        )
        if not updated_profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User profile not found"
            )

        # Convert the profile to match the response schema (UUID to string)
        return UserProfileResponse(
            user_id=str(updated_profile.user_id),
            software_level=updated_profile.software_level,
            hardware_background=updated_profile.hardware_background,
            created_at=updated_profile.created_at,
            updated_at=updated_profile.updated_at
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while updating profile: {str(e)}"
        )