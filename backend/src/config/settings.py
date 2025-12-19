from pydantic_settings import BaseSettings
from typing import Optional, List


class Settings(BaseSettings):
    # API Configuration
    api_title: str = "RAG Agent API"
    api_description: str = "API for the Retrieval-Augmented Generation agent that answers questions about book content"
    api_version: str = "1.0.0"

    # OpenAI Configuration
    openai_api_key: str

    # Cohere Configuration
    cohere_api_key: str

    # Qdrant Configuration
    qdrant_url: str
    qdrant_api_key: str

    # Additional Qdrant Configuration (from existing .env)
    qdrant_host: Optional[str] = None
    qdrant_collection: Optional[str] = "book_content_chunks"
    qdrant_collection_name: Optional[str] = "book_content_chunks"

    # Agent Configuration
    agent_timeout: int = 30  # seconds
    top_k_default: int = 5
    top_k_min: int = 1
    top_k_max: int = 20

    # Application Configuration
    app_host: str = "0.0.0.0"
    app_port: int = 8000
    backend_cors_origins: List[str] = ["http://localhost:3000", "http://localhost:8080", "https://yourusername.github.io"]

    # Additional Configuration (from existing .env)
    book_base_url: Optional[str] = "https://physical-ai-humans-text-five.vercel.app/"
    token_min: Optional[int] = 300
    token_max: Optional[int] = 500
    chunk_overlap_percent: Optional[int] = 15
    cohere_model: Optional[str] = "embed-english-v3.0"
    batch_size_embedding: Optional[int] = 10
    batch_size_qdrant: Optional[int] = 100
    crawl_delay: Optional[int] = 1
    api_key: Optional[str] = None  # For API authentication

    # Better Auth Configuration
    better_auth_url: Optional[str] = "http://localhost:8000"
    better_auth_secret: Optional[str] = "your-better-auth-secret-key-here"
    better_auth_trust_host: Optional[bool] = True

    # Database Configuration
    database_url: str

    model_config = {
        "env_file": ".env",
        "env_nested_delimiter": "__"
    }


# Create a single instance of settings
settings = Settings()