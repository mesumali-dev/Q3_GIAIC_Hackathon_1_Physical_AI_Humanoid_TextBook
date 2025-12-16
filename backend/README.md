# Retrieval Pipeline

A semantic search system that queries the Qdrant vector database using Cohere embeddings to find relevant book content.

## Overview

The retrieval pipeline accepts natural language queries and returns semantically relevant content chunks with metadata. It uses Cohere embeddings for query vectorization and Qdrant for efficient vector similarity search.

## Features

- Semantic search using natural language queries
- Metadata filtering (by URL, section, etc.)
- Performance metrics logging
- Quality validation with test suite
- Command-line interface
- Comprehensive error handling

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   User Query    │───▶│  Cohere Client  │───▶│  Qdrant Client  │
│ (Natural Lang)  │    │  (Embeddings)    │    │  (Vector DB)    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                        │                        │
         ▼                        ▼                        ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  Query Model    │    │  Embedding       │    │  Search         │
│  Validation     │    │  Generation      │    │  Results        │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                        │                        │
         └────────────────────────┼────────────────────────┘
                                  ▼
                       ┌─────────────────────────┐
                       │   Retrieval Service     │
                       │  (Orchestration Layer)  │
                       └─────────────────────────┘
                                  │
                                  ▼
                       ┌─────────────────────────┐
                       │   Retrieval Result      │
                       │  (Content + Metadata)   │
                       └─────────────────────────┘
```

## Installation

1. **Prerequisites**
   - Python 3.11+
   - UV package manager
   - Access to Qdrant Cloud
   - Cohere API key

2. **Setup**
   ```bash
   # Navigate to backend directory
   cd backend/

   # Install dependencies
   uv venv
   source .venv/bin/activate
   uv pip install -e .
   ```

3. **Configuration**
   ```bash
   # Copy environment template
   cp .env.example .env

   # Edit .env with your credentials
   nano .env
   ```

## Usage

### Command Line Interface

```bash
# Basic query
python -m src.cli.retrieval --query "What is artificial intelligence?"

# Custom number of results
python -m src.cli.retrieval --query "Explain neural networks" --top-k 5

# Filter by URL
python -m src.cli.retrieval --query "machine learning concepts" --filter-url "https://example.com/page"

# Filter by section
python -m src.cli.retrieval --query "data preprocessing" --filter-section "Chapter 3"

# Run comprehensive test suite
python -m src.cli.retrieval --run-tests
```

### Output Format

The system returns structured JSON with the following format:

```json
{
  "query": "What is artificial intelligence?",
  "chunks": [
    {
      "id": "chunk_001",
      "text": "Original text content from the book...",
      "url": "https://example.com/source-page",
      "section_hierarchy": ["Chapter 1", "Section 1.1"],
      "chunk_id": "c1s1-001",
      "position": 1
    }
  ],
  "scores": [0.85, 0.72, 0.68],
  "retrieval_time_ms": 245.3,
  "total_results": 3
}
```

## API Contract

### Request Schema
```json
{
  "query": "Natural language query text",
  "top_k": 3,
  "filters": {
    "url": "https://example.com/page",
    "section": "Chapter 1"
  }
}
```

### Response Schema
```json
{
  "query": "Natural language query text",
  "chunks": [
    {
      "id": "string",
      "text": "Original text content",
      "url": "https://example.com/source-page",
      "section_hierarchy": ["array", "of", "sections"],
      "chunk_id": "chunk_identifier"
    }
  ],
  "scores": [0.85, 0.72, 0.68],
  "retrieval_time_ms": 245.3,
  "total_results": 3
}
```

## Performance Goals

- Response time: < 500ms for 95% of queries
- Relevance accuracy: > 90%
- Success rate: > 90%

## Testing

Run the comprehensive test suite:

```bash
# Run all tests
python -m pytest tests/

# Run integration tests specifically
python -m pytest tests/integration/

# Run with test suite validation
python -m src.cli.retrieval --run-tests
```

## Error Handling

The system handles various error conditions:

- **Connection errors**: Graceful handling of Qdrant/Cohere connection issues
- **Invalid queries**: Proper validation and error messages
- **Empty results**: Appropriate responses when no relevant content is found
- **API errors**: Specific handling for Cohere and Qdrant API issues

## Components

- `src/models/`: Data models (Query, ContentChunk, RetrievalResult)
- `src/services/`: Core services (Qdrant, Cohere, Retrieval)
- `src/lib/`: Utilities (Config, Logger, Exceptions)
- `src/cli/`: Command-line interface
- `tests/integration/`: Integration tests