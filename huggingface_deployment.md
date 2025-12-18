# Hugging Face Deployment Guide for RAG Chatbot Backend

This guide provides instructions for deploying the RAG chatbot backend on Hugging Face Spaces or similar platforms.

## Backend Files Required for Deployment

### 1. Application Code
- `backend/main.py` - Main FastAPI application entry point
- `backend/src/api/v1/query.py` - API routes for query endpoint
- `backend/src/config/settings.py` - Configuration and settings
- `backend/src/services/agent_service.py` - OpenAI Agent service
- `backend/src/services/` - All service files (retrieval, embedding, etc.)
- `backend/src/models/` - Pydantic models for request/response validation
- `backend/src/middleware.py` - Application middleware

### 2. Dependencies
- `backend/requirements.txt` - Python dependencies for deployment
- `backend/pyproject.toml` - Project metadata and dependencies (alternative)

### 3. Configuration
- `.env` - Environment variables file (with API keys and settings)
- `.env.example` - Example environment variables file

### 4. Deployment Scripts
- `backend/run.py` - Alternative run script
- `backend/performance_test.py` - Performance testing (optional for deployment)

### 5. Documentation
- `backend/README.md` - Project documentation

## Required Dependencies

The application requires the following Python packages:
- FastAPI
- Uvicorn (ASGI server)
- OpenAI Agents Python SDK
- Qdrant-client
- Cohere
- Pydantic and Pydantic-settings
- python-dotenv

## Environment Variables Required

Your `.env` file should contain:
- `OPENAI_API_KEY` - OpenAI API key
- `QDRANT_URL` - Qdrant Cloud URL
- `QDRANT_API_KEY` - Qdrant API key
- `COHERE_API_KEY` - Cohere API key (if using Cohere embeddings)
- `BACKEND_CORS_ORIGINS` - List of allowed origins

## Hugging Face Deployment Steps

### 1. Prepare Your Repository
1. Create a new repository on Hugging Face Hub
2. Add all the required backend files to your repository
3. Make sure your `requirements.txt` includes all necessary dependencies

### 2. Create App Configuration
Create a `Dockerfile` in your repository root:
```Dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

WORKDIR /app/backend

EXPOSE 7860

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
```

### 3. Alternative: Gradio Integration
If using Gradio for Hugging Face Spaces:
```python
# app.py
from gradio import FastAPI
import uvicorn
from backend.main import app

# Create a Gradio interface that wraps your FastAPI app
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=7860)
```

### 4. Space Configuration
Create a `README.md` in your Hugging Face repository with:
```yaml
---
title: RAG Chatbot API
emoji: 🤖
colorFrom: blue
colorTo: red
sdk: docker
python_version: 3.11
pinned: false
license: apache-2.0
---

# RAG Chatbot Backend

This Space runs a Retrieval-Augmented Generation (RAG) chatbot backend that answers questions about book content using vector search and OpenAI agents.
```

### 5. Environment Setup
Add your environment variables in the Hugging Face Space secrets:
- `OPENAI_API_KEY`
- `QDRANT_URL`
- `QDRANT_API_KEY`
- `COHERE_API_KEY`

## Deployment Command
The application can be deployed using:
```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

## Testing Your Deployment
1. Verify the backend is running by accessing the `/docs` endpoint
2. Test the `/api/v1/query` endpoint with a sample query
3. Check that the application can connect to Qdrant and OpenAI APIs

## Security Considerations
- Never expose API keys in frontend code
- Use HTTPS for all API communications
- Implement proper input validation and sanitization
- Regularly rotate API keys
- Monitor API usage for unusual patterns

## Scaling Considerations
- Monitor your Qdrant Cloud usage and scale as needed
- Consider implementing response caching for frequently asked questions
- Implement rate limiting to prevent abuse of your API keys