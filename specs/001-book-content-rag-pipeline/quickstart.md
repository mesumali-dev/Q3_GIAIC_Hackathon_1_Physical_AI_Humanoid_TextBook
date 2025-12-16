# Quickstart Guide: Book Content RAG Pipeline

## Prerequisites

- Python 3.11 or higher
- `uv` package manager installed
- Access to Cohere API (API key)
- Access to Qdrant Cloud (endpoint URL and API key)

## Setup

### 1. Environment Setup

```bash
# Navigate to the backend directory
cd backend/

# Initialize the project with uv
uv init

# Create and activate virtual environment
uv venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

### 2. Install Dependencies

```bash
# Install dependencies with uv
uv pip install requests beautifulsoup4 cohere qdrant-client tiktoken python-dotenv
```

### 3. Environment Configuration

Create a `.env` file in the backend directory with your API keys:

```env
COHERE_API_KEY=your_cohere_api_key_here
QDRANT_URL=your_qdrant_cloud_url_here
QDRANT_API_KEY=your_qdrant_api_key_here
BOOK_BASE_URL=https://your-book-url.github.io  # The deployed Docusaurus book URL
QDRANT_COLLECTION_NAME=book_content_chunks
```

## Running the Pipeline

### 1. Execute the Full Pipeline

```bash
cd backend/
python scripts/run_pipeline.py
```

### 2. Run Individual Components (Optional)

If you want to run components separately:

```bash
# Crawl the book
python -m crawler.crawler --base-url $BOOK_BASE_URL

# Clean and extract content
python -m cleaner.content_cleaner

# Chunk the content
python -m chunker.text_chunker

# Generate embeddings
python -m embedder.cohere_embedder

# Upload to Qdrant
python -m storage.qdrant_uploader
```

## Configuration Options

The pipeline can be configured through environment variables:

- `BOOK_BASE_URL`: Base URL of the deployed Docusaurus book
- `TOKEN_MIN`: Minimum tokens per chunk (default: 300)
- `TOKEN_MAX`: Maximum tokens per chunk (default: 500)
- `CHUNK_OVERLAP_PERCENT`: Overlap percentage between chunks (default: 15)
- `COHERE_MODEL`: Cohere model to use (default: embed-english-v3.0)
- `BATCH_SIZE`: Batch size for API calls (default: 10 for embeddings, 100 for Qdrant uploads)

## Expected Output

After running the pipeline successfully, you should see:

1. All book pages crawled and saved to `data/pages/`
2. Cleaned content saved to `data/cleaned/`
3. Text chunks saved to `data/chunks/`
4. Embeddings generated and stored in Qdrant
5. Validation report confirming successful processing

## Validation

Run the validation script to confirm the pipeline completed successfully:

```bash
python -m validation.validator
```

This will check:
- Number of pages crawled matches expected count
- All chunks have proper metadata
- Vector count matches chunk count
- All vectors stored in Qdrant with correct metadata

## Troubleshooting

### Common Issues

1. **Rate Limit Errors**: If you encounter Cohere or Qdrant rate limits, reduce the `BATCH_SIZE` in your configuration.

2. **Memory Issues**: For large books, process pages in smaller batches or increase system memory.

3. **Crawling Errors**: If some pages fail to crawl, check the robots.txt of the target site and adjust crawl delays.

4. **API Key Issues**: Ensure your Cohere and Qdrant API keys are valid and have the necessary permissions.

### Logging

The pipeline logs detailed information to `logs/pipeline.log`. Check this file for detailed error messages and processing information.