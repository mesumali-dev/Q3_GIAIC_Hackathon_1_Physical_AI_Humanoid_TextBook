# Quickstart: RAG Agent Development

## Overview
This guide provides instructions to quickly set up and run the RAG agent service that answers questions about book content using OpenAI Agents and FastAPI.

## Prerequisites
- Python 3.11+
- UV package manager
- OpenAI API key
- Cohere API key
- Qdrant Cloud credentials

## Setup

### 1. Clone and Navigate to Project
```bash
cd /path/to/your/project
```

### 2. Install Dependencies
```bash
# Using UV package manager as specified in requirements
uv venv  # Create virtual environment (optional but recommended)
source .venv/bin/activate  # Activate virtual environment (if created)
uv pip install -r backend/requirements.txt
```

### 3. Environment Configuration
Create a `.env` file in the project root with the following variables:

```env
OPENAI_API_KEY=your_openai_api_key_here
COHERE_API_KEY=your_cohere_api_key_here
QDRANT_URL=your_qdrant_cloud_url
QDRANT_API_KEY=your_qdrant_api_key
TOP_K_DEFAULT=5
AGENT_TIMEOUT=30
```

### 4. Start the Service
```bash
cd backend
python run.py
# or
uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload
```

The service will be available at `http://localhost:8000`

## API Usage

### Query Endpoint
Send a POST request to `/query` with a JSON body:

```json
{
  "question": "What are the key principles of machine learning?",
  "top_k": 5,
  "include_sources": true
}
```

### Example Request
```bash
curl -X POST http://localhost:8000/query \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-api-key" \
  -d '{
    "question": "What are the key principles of machine learning?",
    "top_k": 5
  }'
```

### Example Response
```json
{
  "answer": "The key principles of machine learning include supervised learning, unsupervised learning, and reinforcement learning...",
  "sources": [
    {
      "content": "Machine learning is a subset of artificial intelligence that enables systems to learn and improve from experience...",
      "metadata": {
        "url": "https://example.com/book/chapter1",
        "section_title": "Introduction to Machine Learning",
        "page_number": 42
      },
      "relevance_score": 0.85
    }
  ],
  "query_id": "query-12345-abcde"
}
```

## Configuration Options

### Top-K Retrieval
- Adjust the number of documents retrieved with the `top_k` parameter (1-20)
- Default value is 5, configurable via `TOP_K_DEFAULT` environment variable

### Agent Behavior
- The agent is configured to only respond based on retrieved content
- If no relevant content is found, the agent responds with "not found in the book"

## Testing
Run the test suite to verify the service:

```bash
cd backend
pytest tests/
```

## Troubleshooting

### Common Issues
1. **API Keys**: Ensure all required API keys are properly set in environment variables
2. **Qdrant Connection**: Verify Qdrant Cloud credentials and network connectivity
3. **Embedding Mismatch**: Ensure Cohere embeddings match those used in Specs 1 & 2

### Logging
Check the service logs for detailed error information:
- By default, the service logs retrieval sources and agent reasoning metadata
- Enable debug logging by setting `LOG_LEVEL=debug` in environment