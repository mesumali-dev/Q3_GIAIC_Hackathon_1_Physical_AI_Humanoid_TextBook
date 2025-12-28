from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum

class KnowledgeLevel(str, Enum):
    beginner = "beginner"
    intermediate = "intermediate"
    advanced = "advanced"

class UserProfile(BaseModel):
    id: str
    knowledge_level: KnowledgeLevel
    software_background: str
    hardware_background: str
    profile_complete: bool = True

class PersonalizationRequest(BaseModel):
    chapter_content: str = Field(..., description="The original chapter content to be personalized")
    chapter_title: str = Field(..., description="Title of the chapter for context")
    user_profile: Optional[UserProfile] = None
    user_id: Optional[str] = None

class PersonalizationResponse(BaseModel):
    personalized_content: str = Field(..., description="The personalized chapter content")
    structure_preserved: bool = Field(default=True, description="Indicates if document structure was preserved")
    personalization_applied: bool = Field(default=True, description="Indicates if personalization was successfully applied")
    processing_time: Optional[float] = Field(default=None, description="Time taken for personalization in milliseconds")

class ErrorResponse(BaseModel):
    error: str
    message: str
    details: Optional[Dict[str, Any]] = None

class PersonalizationSettings(BaseModel):
    timeout_configurable: bool = True
    max_content_length: int = 10000  # Maximum length of content to process
    personalization_rules: Dict[str, Dict[str, str]] = {
        "beginner": {
            "explanation_depth": "detailed",
            "terminology": "basic",
            "examples": "simple"
        },
        "intermediate": {
            "explanation_depth": "balanced",
            "terminology": "moderate",
            "examples": "standard"
        },
        "advanced": {
            "explanation_depth": "concise",
            "terminology": "technical",
            "examples": "advanced"
        }
    }