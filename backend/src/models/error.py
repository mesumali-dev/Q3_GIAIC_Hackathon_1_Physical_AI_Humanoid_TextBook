from pydantic import BaseModel
from typing import Optional


class ErrorResponse(BaseModel):
    """
    Model for error responses from the API.
    """
    error: str
    message: str
    code: Optional[str] = None