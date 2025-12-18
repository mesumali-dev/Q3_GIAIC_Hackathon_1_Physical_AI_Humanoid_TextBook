from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.config.settings import settings
import json

# Parse CORS origins from settings
try:
    cors_origins = json.loads(settings.backend_cors_origins)
except:
    # If JSON parsing fails, use a default list
    cors_origins = ["http://localhost:3000", "https://yourusername.github.io"]

# Create FastAPI app instance
app = FastAPI(
    title="RAG Chatbot API",
    description="API for the Retrieval-Augmented Generation chatbot that answers questions about book content",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "RAG Chatbot API is running!"}

# Include API routes
from src.api.v1.query import router as query_router
app.include_router(query_router, prefix="/api/v1", tags=["query"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=7860)
