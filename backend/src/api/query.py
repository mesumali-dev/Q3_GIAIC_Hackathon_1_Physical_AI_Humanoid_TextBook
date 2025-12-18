from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
import logging
from datetime import datetime

from backend.src.models.user_query import UserQuery, RAGResponse, SourceCitation, ChatSession
from backend.src.models.error import ErrorResponse
from backend.src.services.query_service import process_query

router = APIRouter()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@router.post("/query", response_model=RAGResponse)
async def query_endpoint(query_data: UserQuery):
    """
    Submit a natural language question to the RAG agent for processing.

    This endpoint handles both standard queries (full book context) and
    selected-text-only queries based on the contextMode parameter.
    """
    try:
        logger.info(f"Processing query: {query_data.question[:50]}...")

        # Validate input
        if not query_data.question or len(query_data.question.strip()) < 3:
            raise HTTPException(status_code=400, detail=ErrorResponse(
                error="Validation failed",
                message="Question is required and must be at least 3 characters",
                code="VALIDATION_ERROR"
            ).dict())

        # Process the query using the service layer
        response = await process_query(query_data)

        logger.info(f"Query processed successfully, response ID: {response.id}")

        return response

    except HTTPException as he:
        # Re-raise HTTP exceptions, but log them
        logger.warning(f"HTTP exception in query endpoint: {he.detail}")
        raise
    except Exception as e:
        logger.error(f"Unexpected error processing query: {str(e)}")
        # Return a structured error response
        raise HTTPException(status_code=500, detail=ErrorResponse(
            error="Internal server error",
            message="The query could not be processed at this time",
            code="INTERNAL_ERROR"
        ).dict())

# Include the router in the main app
# This will be done in main.py with: app.include_router(router, prefix="/api/v1")