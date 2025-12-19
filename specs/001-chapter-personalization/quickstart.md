# Quickstart: Chapter-Level Content Personalization

## Overview
This guide provides instructions for implementing and using the chapter-level content personalization feature. The feature allows logged-in users to adapt chapter content based on their knowledge level using an LLM-powered personalization engine.

## Prerequisites
- Python 3.11+ with FastAPI
- Node.js with Docusaurus
- BetterAuth authentication system configured
- LLM API key (Cohere/OpenAI) for personalization engine
- Qdrant vector database (if integrated with existing RAG system)

## Backend Setup

### 1. Install Dependencies
```bash
# In the backend directory
pip install fastapi uvicorn python-multipart
```

### 2. Add Personalization API Endpoint
Create `backend/src/api/personalization.py` with the personalization endpoint that accepts chapter content and user profile, then processes it through the LLM service.

### 3. Configure Personalization Service
Implement the personalization service in `backend/src/services/personalization_service.py` with LLM integration and content transformation logic.

### 4. Add Request/Response Models
Define the data models in `backend/src/models/personalization.py` based on the data model specification.

## Frontend Integration

### 1. Add Personalization Button Component
Create `frontend/src/components/PersonalizationButton.jsx` that:
- Shows only to authenticated users
- Extracts chapter content in structured format
- Calls the personalization API
- Manages state for toggling between original and personalized content

### 2. Implement Personalization Service
Create `frontend/src/services/personalization.js` with functions to:
- Extract content from the current chapter
- Send personalization requests to the backend
- Handle success and error responses

### 3. Integrate with Existing Auth
Ensure the personalization feature integrates with the existing BetterAuth authentication system.

## Configuration

### 1. Environment Variables
```env
LLM_API_KEY=your_llm_api_key
PERSONALIZATION_TIMEOUT=10  # seconds (configurable)
```

### 2. Personalization Rules
Configure personalization rules for different knowledge levels in the service:
- Beginner: Detailed explanations, basic terminology, step-by-step guidance
- Intermediate: Balanced explanations, moderate technical depth
- Advanced: Concise explanations, technical terminology, minimal repetition

## Usage

### 1. For Developers
1. Ensure backend API is running
2. Add the personalization button to chapter pages
3. Test personalization with different user profiles
4. Verify content structure preservation

### 2. For Users
1. Log in to the application
2. Navigate to any chapter
3. Click "Personalize This Chapter" button
4. Content will adapt to match your knowledge level
5. Use the toggle button to switch between original and personalized content

## Testing

### 1. Backend Tests
```bash
# Run personalization API tests
pytest tests/test_personalization.py
```

### 2. Frontend Tests
```bash
# Run personalization component tests
npm test personalization.test.js
```

### 3. Integration Tests
- Test personalization with different user profiles
- Verify content structure preservation
- Validate error handling and fallback behavior
- Check performance with large chapters

## Error Handling

### Fallback Behavior
- If personalization fails, show original content with subtle notification
- Implement configurable timeout for LLM requests
- Provide clear error messages to users

### Content Validation
- Validate chapter content before sending to LLM
- Ensure user profile is complete before personalization
- Preserve all document structure elements during transformation

## Performance Considerations

### Caching
- Cache personalized content in browser session storage
- Avoid repeated API calls for the same content
- Clear cache when navigating to different chapters

### LLM Requests
- Implement reasonable timeout values
- Provide loading states during personalization
- Consider rate limiting to prevent abuse

## Security

### API Key Protection
- Never expose LLM API keys to frontend
- Use backend-only API calls for personalization
- Implement proper authentication checks

### Content Integrity
- Ensure original content files remain unchanged
- Validate that personalization doesn't alter meaning
- Implement content safety checks if needed