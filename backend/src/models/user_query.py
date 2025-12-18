from pydantic import BaseModel, validator
from typing import List, Optional, Literal
from datetime import datetime
from enum import Enum


class ContextMode(str, Enum):
    full_book = "full-book"
    selected_text_only = "selected-text-only"


class SourceCitation(BaseModel):
    """
    Represents a citation to a source used in the RAG response.
    """
    url: str
    section: str
    excerpt: str
    confidence: float

    @validator('confidence')
    def confidence_must_be_between_0_and_1(cls, v):
        if not 0 <= v <= 1:
            raise ValueError('Confidence must be between 0 and 1')
        return v

    @validator('url')
    def url_must_be_valid(cls, v):
        # Basic URL validation - in a real app you might want more robust validation
        if not v.startswith(('http://', 'https://', '/')):
            raise ValueError('URL must be a valid URL or relative path')
        return v


class UserQuery(BaseModel):
    """
    Represents a user's query to the RAG system.
    """
    id: Optional[str] = None
    question: str
    contextMode: ContextMode = ContextMode.full_book
    selectedText: Optional[str] = None
    timestamp: datetime = datetime.now()
    userId: Optional[str] = None

    @validator('question')
    def question_must_be_valid(cls, v):
        if len(v) < 3:
            raise ValueError('Question must be at least 3 characters long')
        if len(v) > 1000:
            raise ValueError('Question must be no more than 1000 characters long')
        return v

    @validator('selectedText')
    def selected_text_required_for_mode(cls, v, values):
        if values.get('contextMode') == ContextMode.selected_text_only and not v:
            raise ValueError('selectedText is required when contextMode is selected-text-only')
        if v and len(v) > 5000:
            raise ValueError('selectedText must be no more than 5000 characters long')
        return v


class RAGResponseStatus(str, Enum):
    success = "success"
    partial = "partial"
    error = "error"
    empty = "empty"


class RAGResponse(BaseModel):
    """
    Represents a response from the RAG system.
    """
    id: str
    answer: str
    sourceCitations: List[SourceCitation]
    queryId: str
    timestamp: datetime = datetime.now()
    status: RAGResponseStatus = RAGResponseStatus.success

    @validator('answer')
    def answer_must_not_be_empty(cls, v):
        if not v or len(v.strip()) == 0:
            raise ValueError('Answer must not be empty')
        return v

    @validator('sourceCitations')
    def citations_must_exist_for_success(cls, v, values):
        status = values.get('status')
        if status == RAGResponseStatus.success and len(v) == 0:
            raise ValueError('At least one citation is required for successful responses')
        return v


class ChatSession(BaseModel):
    """
    Represents a chat session with multiple queries and responses.
    """
    id: str
    userQueries: List[UserQuery] = []
    responses: List[RAGResponse] = []
    createdAt: datetime = datetime.now()
    lastActiveAt: datetime = datetime.now()
    isActive: bool = True