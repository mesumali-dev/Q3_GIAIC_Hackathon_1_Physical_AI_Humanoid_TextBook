from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
import uuid
from datetime import datetime, timedelta
from typing import Dict, Any, Optional

from src.database import get_db
from src.models.user import User, UserBackgroundProfile
from src.services.user_service import UserService
from src.services.personalization_service import PersonalizationService, personalization_service
from src.middleware import auth_middleware
from src.models.personalization import PersonalizationRequest, PersonalizationResponse, UserProfile

# In-memory rate limiting storage (in production, use Redis or database)
personalization_requests: Dict[str, list] = {}
RATE_LIMIT_WINDOW = 60  # 60 seconds
MAX_REQUESTS_PER_WINDOW = 5


async def get_current_user_id_optional(request: Request) -> Optional[uuid.UUID]:
    """
    Optional dependency to get the current user ID from the authorization header.
    Returns None if not authenticated.
    """
    try:
        user_id = await auth_middleware.get_current_user_id(request)
        return user_id
    except:
        # If authentication fails, return None instead of raising an exception
        return None


router = APIRouter(prefix="/api/personalization", tags=["personalization"])


@router.get("/context")
async def get_personalization_context(
    current_user_id: Optional[uuid.UUID] = Depends(get_current_user_id_optional),
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


def check_rate_limit(user_id: uuid.UUID) -> bool:
    """
    Check if the user has exceeded the rate limit for personalization requests.
    """
    user_id_str = str(user_id)
    now = datetime.utcnow()

    # Initialize user's request list if not exists
    if user_id_str not in personalization_requests:
        personalization_requests[user_id_str] = []

    # Remove requests older than the rate limit window
    personalization_requests[user_id_str] = [
        req_time for req_time in personalization_requests[user_id_str]
        if now - req_time < timedelta(seconds=RATE_LIMIT_WINDOW)
    ]

    # Check if user has exceeded the rate limit
    if len(personalization_requests[user_id_str]) >= MAX_REQUESTS_PER_WINDOW:
        return False

    # Add current request to the list
    personalization_requests[user_id_str].append(now)
    return True

@router.post("/chapter", response_model=PersonalizationResponse)
async def personalize_chapter(
    request: PersonalizationRequest,
    current_user_id: Optional[uuid.UUID] = Depends(get_current_user_id_optional),
    db: Session = Depends(get_db)
):
    """
    Personalize chapter content based on user profile.
    """
    try:
        # Get the user ID if authenticated, otherwise use a guest ID
        user_id = current_user_id if current_user_id else uuid.uuid4()

        # Check rate limit (apply to both authenticated and unauthenticated users)
        if not check_rate_limit(user_id):
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Rate limit exceeded. Maximum {MAX_REQUESTS_PER_WINDOW} requests per {RATE_LIMIT_WINDOW} seconds."
            )

        # Check if user is authenticated
        user = None
        profile = None
        if current_user_id:
            user = UserService.get_user_by_id(db, current_user_id)
            if user:
                profile = UserService.get_user_background_profile(db, current_user_id)

        # Create a user profile for the personalization request
        # Use provided profile if user is unauthenticated or doesn't have a complete profile
        if not profile or not profile.software_level or not profile.hardware_background:
            # Use the profile from the request (which can include default values for guests)
            user_profile = UserProfile(
                id=str(user_id),
                knowledge_level=request.user_profile.knowledge_level if request.user_profile and request.user_profile.knowledge_level else "intermediate",
                software_background=request.user_profile.software_background if request.user_profile and request.user_profile.software_background else "General software development",
                hardware_background=request.user_profile.hardware_background if request.user_profile and request.user_profile.hardware_background else "General hardware knowledge",
                profile_complete=False  # Mark as incomplete for guest profiles
            )
        else:
            # Use the authenticated user's profile
            user_profile = UserProfile(
                id=str(current_user_id),
                knowledge_level=request.user_profile.knowledge_level if request.user_profile else profile.software_level.value,
                software_background=profile.software_level.value,
                hardware_background=profile.hardware_background.value,
                profile_complete=True
            )

        # Update the request with the user profile
        request.user_profile = user_profile

        # Call the personalization service
        result = await personalization_service.personalize_content(request)

        return result

    except ValueError as e:
        # Handle validation errors
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        # Handle other errors
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error during personalization: {str(e)}"
        )


@router.get("/health")
async def personalization_health():
    """
    Health check endpoint for personalization service
    """
    return {"status": "healthy", "service": "chapter-personalization"}