from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
import uuid

from src.database import get_db
from src.models.user import User, UserBackgroundProfile
from src.services.user_service import UserService
from src.services.personalization_service import PersonalizationService
from src.middleware import auth_middleware


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


router = APIRouter(prefix="/api/personalization", tags=["personalization"])


@router.get("/context")
async def get_personalization_context(
    current_user_id: uuid.UUID = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """
    Get personalization context for chatbot
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
            # Return default context if no profile exists
            return {
                "user_context": {
                    "software_level": None,
                    "hardware_background": None,
                    "personalization_notes": "User has not provided background information. Provide general explanations suitable for mixed experience levels.",
                    "response_style": "Provide explanations suitable for mixed experience levels.",
                    "example_preference": "Provide general examples suitable for various backgrounds."
                }
            }

        # Generate personalization context using the service
        personalization_context = PersonalizationService.generate_personalization_context(
            profile.software_level.value,
            profile.hardware_background.value
        )

        return {
            "user_context": personalization_context
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while fetching personalization context: {str(e)}"
        )