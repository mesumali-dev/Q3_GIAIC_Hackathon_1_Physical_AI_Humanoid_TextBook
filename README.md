# Book Content RAG Pipeline

This repository contains a comprehensive RAG (Retrieval-Augmented Generation) pipeline that processes Docusaurus book content (both from URLs and local files), processes it into vector embeddings, and stores it in Qdrant for semantic search capabilities.

## Overview

The RAG pipeline consists of several key components:

1. **Crawler/Local Reader**: Discovers and extracts content from Docusaurus book pages (supports both web crawling and local file reading)
2. **Cleaner**: Extracts clean text content, removing navigation and other noise
3. **Chunker**: Segments content into configurable token chunks with overlap
4. **Embedder**: Generates vector embeddings using Cohere's embedding models
5. **Storage**: Stores vectors and metadata in Qdrant vector database
6. **Validation**: Ensures data integrity and proper functionality

## Architecture

```
[Book Pages/Local Files] → [Crawler/Local Reader] → [Cleaner] → [Chunker] → [Embedder] → [Qdrant Storage] → [Validation]
```

## Prerequisites

- Python 3.11+
- `uv` package manager
- Cohere API key for embedding generation
- Qdrant Cloud account for vector storage

## Setup

1. Clone the repository
2. Navigate to the `backend` directory
3. Install dependencies using `uv`:

```bash
cd backend
uv venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
uv pip install requests beautifulsoup4 cohere qdrant-client tiktoken python-dotenv
```

4. Create a `.env` file with your configuration:

```env
COHERE_API_KEY=your_cohere_api_key_here
QDRANT_URL=your_qdrant_cloud_url_here
QDRANT_API_KEY=your_qdrant_api_key_here
QDRANT_COLLECTION_NAME=book_content_chunks
BOOK_BASE_URL=https://your-book-url.github.io  # For web crawling
LOCAL_DOCS_DIR=../frontend/docs  # For local file processing
TOKEN_MIN=300
TOKEN_MAX=500
CHUNK_OVERLAP_PERCENT=15
COHERE_MODEL=embed-english-v3.0
BATCH_SIZE_EMBEDDING=10
BATCH_SIZE_QDRANT=100
CRAWL_DELAY=1.0
COHERE_RATE_LIMIT_DELAY=1.0
```

## Usage

### Run the Complete Pipeline

For web crawling:
```bash
cd backend
python scripts/run_pipeline.py --url https://your-book-url.github.io
```

For local Docusaurus content:
```bash
cd backend
python scripts/run_pipeline.py --docs-path ../frontend/docs
```

### Run Individual Components

#### Crawl Book Pages (Web)

```bash
python -m crawler.crawler --base-url https://your-book-url.github.io
```

#### Process Local Docusaurus Content

```bash
python -m crawler.local_content_reader
```

#### Process Text Chunks

```bash
python -m chunker.text_chunker
```

#### Generate Embeddings

```bash
python -m embedder.cohere_embedder
```

#### Validate Pipeline Completion

```bash
python -m validation.validator
```

## Configuration

The pipeline can be configured through environment variables or a configuration file. Key parameters include:

- `TOKEN_MIN` and `TOKEN_MAX`: Define the token range for text chunks (default: 300-500)
- `CHUNK_OVERLAP_PERCENT`: Percentage overlap between chunks (default: 15%)
- `LOCAL_DOCS_DIR`: Path to local Docusaurus docs directory (for local content processing)
- `COHERE_MODEL`: The Cohere embedding model to use (default: embed-english-v3.0)
- `BATCH_SIZE_EMBEDDING`: Number of texts to process in each embedding API call (default: 10)
- `BATCH_SIZE_QDRANT`: Number of vectors to upload in each batch (default: 100)

## Data Flow

1. **Crawling/Local Reading**: The crawler discovers pages from web URLs or local Docusaurus markdown files
2. **Cleaning**: HTML/markdown content is processed to extract clean text while preserving heading hierarchy
3. **Chunking**: Text is segmented into configurable token chunks with overlap to maintain context
4. **Embedding**: Each chunk is converted to a high-dimensional vector using Cohere's embedding model
5. **Storage**: Vectors and associated metadata are stored in Qdrant for efficient similarity search
6. **Validation**: The pipeline validates that all steps completed successfully and data integrity is maintained

## Data Model

The pipeline uses the following key data models:

- **BookPage**: Represents a single book page with URL, title, content, and headings
- **TextChunk**: A segment of text with metadata (chunk_id, page_url, heading_path, token_count)
- **EmbeddingVector**: Vector representation of a text chunk with model information
- **QdrantRecord**: Storage format for vectors in Qdrant with rich metadata

## Performance

The pipeline is designed to complete within 10 minutes for a typical book. Performance optimizations include:

- Batching API calls to Cohere and Qdrant
- Parallel processing where possible
- Rate limiting to respect API quotas
- Efficient memory usage during processing

## Troubleshooting

### Common Issues

1. **API Rate Limits**: If you encounter rate limit errors, increase the `COHERE_RATE_LIMIT_DELAY` or `CRAWL_DELAY` values.

2. **Memory Issues**: For very large books, process smaller sections or increase system memory.

3. **Connection Errors**: Verify your Qdrant and Cohere credentials are correct and have proper permissions.

4. **Low Chunk Count**: If you're getting fewer chunks than expected, consider adjusting token requirements:
   - Lower `TOKEN_MIN` to allow smaller chunks to be processed
   - The pipeline now accepts chunks with as few as 100 tokens if they meet the TextChunk validation requirements
   - For local content, ensure your markdown files have sufficient text content after frontmatter extraction

### Logging

The pipeline logs detailed information to `logs/pipeline.log`. Check this file for detailed error messages and processing information.

## API Endpoints

The pipeline includes a REST API for programmatic access:

- `POST /pipeline/crawl`: Crawl book pages from a base URL
- `POST /pipeline/clean`: Clean and extract text from crawled pages
- `POST /pipeline/chunk`: Chunk text content into tokens
- `POST /pipeline/embed`: Generate embeddings for text chunks
- `POST /pipeline/upload`: Upload embeddings to Qdrant
- `GET /pipeline/validate`: Validate pipeline completion
- `GET /pipeline/status`: Get pipeline execution status

## Security

- API keys are stored in environment variables or config files (not in code)
- All external requests are validated and sanitized
- Connection to Qdrant uses HTTPS/TLS encryption

## Next Steps

After running the pipeline successfully, you can build a RAG chatbot that queries the stored vectors to answer questions about the book content.