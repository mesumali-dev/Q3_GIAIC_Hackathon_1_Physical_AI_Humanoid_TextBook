# Quickstart: Retrieval Pipeline

## Overview
This guide explains how to set up and run the retrieval pipeline that queries the Qdrant vector database using semantic similarity search.

## Prerequisites
- Python 3.11+
- UV package manager
- Access to Qdrant Cloud with existing collection from Spec-1
- Cohere API key

## Setup

### 1. Environment Configuration
```bash
# Navigate to backend directory
cd backend/

# Install dependencies (if not already installed)
uv venv
source .venv/bin/activate
uv pip install cohere qdrant-client python-dotenv
```

### 2. Environment Variables
Create a `.env` file in the backend directory:
```env
COHERE_API_KEY=your_cohere_api_key_here
QDRANT_HOST=your_qdrant_cloud_url
QDRANT_API_KEY=your_qdrant_api_key
QDRANT_COLLECTION_NAME=your_collection_name_from_spec1
```

## Running the Retrieval Pipeline

### 1. Basic Query
```bash
# Run a basic query with default top-K (3-5)
python -m src.cli.retrieval --query "your natural language query here"
```

### 2. Custom Top-K
```bash
# Specify custom number of results
python -m src.cli.retrieval --query "your query" --top-k 5
```

### 3. Metadata Filtering
```bash
# Filter by URL
python -m src.cli.retrieval --query "your query" --filter-url "https://example.com/page"

# Filter by section
python -m src.cli.retrieval --query "your query" --filter-section "Chapter 1"
```

### 4. Batch Testing
```bash
# Run test suite with 10 predefined queries
python -m src.cli.retrieval --run-tests
```

## Expected Output
The retrieval pipeline returns structured JSON with:
- Original text content
- Source URLs
- Section hierarchy
- Chunk IDs
- Similarity scores
- Response times

Example:
```json
{
  "query": "What are the main concepts in RAG systems?",
  "chunks": [
    {
      "id": "chunk_001",
      "text": "Retrieval Augmented Generation (RAG) combines...",
      "url": "https://example.com/rag-intro",
      "section_hierarchy": ["Chapter 3", "Section 3.1"],
      "chunk_id": "c3s1-001"
    }
  ],
  "scores": [0.85],
  "retrieval_time_ms": 245.3,
  "total_results": 1
}
```

## Troubleshooting

### Common Issues
1. **Connection errors**: Verify QDRANT_HOST and QDRANT_API_KEY
2. **Embedding errors**: Verify COHERE_API_KEY is valid
3. **No results**: Check that the collection from Spec-1 exists and has data

### Performance
- Expected response time: < 500ms for 95% of queries
- If consistently slower, check network connection to Qdrant Cloud