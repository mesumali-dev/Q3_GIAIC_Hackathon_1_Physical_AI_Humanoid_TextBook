# RAG Pipeline Usage Guide

This guide provides detailed instructions on how to set up, configure, and run the Book Content RAG Pipeline.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Configuration](#configuration)
- [Running the Pipeline](#running-the-pipeline)
- [Monitoring and Logging](#monitoring-and-logging)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before running the RAG pipeline, ensure you have:

1. **Python 3.11+** installed on your system
2. **uv** package manager installed (`pip install uv`)
3. **Cohere API key** with sufficient quota for embedding generation
4. **Qdrant Cloud account** with API access
5. **Book URL** that is publicly accessible over HTTPS

## Environment Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <repository-name>
```

### 2. Navigate to Backend Directory

```bash
cd backend
```

### 3. Create Virtual Environment and Install Dependencies

```bash
uv venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
uv pip install requests beautifulsoup4 cohere qdrant-client tiktoken python-dotenv
```

### 4. Create Environment File

Create a `.env` file in the backend directory with your credentials:

```bash
touch .env
```

## Configuration

The pipeline uses environment variables for configuration. Add the following to your `.env` file:

```env
# Cohere Configuration
COHERE_API_KEY=your_cohere_api_key_here
COHERE_MODEL=embed-english-v3.0

# Qdrant Configuration
QDRANT_URL=your_qdrant_cloud_url_here
QDRANT_API_KEY=your_qdrant_api_key_here
QDRANT_COLLECTION_NAME=book_content_chunks

# Book Configuration
BOOK_BASE_URL=https://your-book-url.github.io

# Chunking Configuration
CHUNK_MIN_TOKENS=300
CHUNK_MAX_TOKENS=500
CHUNK_OVERLAP_PERCENT=15

# Performance Configuration
BATCH_SIZE_EMBEDDING=10
BATCH_SIZE_QDRANT=100
CRAWL_DELAY=1.0
COHERE_RATE_LIMIT_DELAY=1.0
```

### Configuration Options Explained

- `COHERE_API_KEY`: Your Cohere API key for embedding generation
- `QDRANT_URL`: URL of your Qdrant Cloud instance
- `QDRANT_API_KEY`: API key for your Qdrant instance
- `BOOK_BASE_URL`: Base URL of the book you want to process
- `CHUNK_MIN_TOKENS`/`CHUNK_MAX_TOKENS`: Token range for text chunks (300-500 recommended)
- `CHUNK_OVERLAP_PERCENT`: Percentage overlap between chunks (15-20% recommended)
- `BATCH_SIZE_*`: Number of items to process in each API call
- `*_DELAY`: Rate limiting delays in seconds

## Running the Pipeline

### 1. Run the Complete Pipeline

To run the entire pipeline from crawling to validation:

```bash
cd backend
python scripts/run_pipeline.py --url https://your-book-url.github.io
```

### 2. Run Individual Components

You can also run individual components if needed:

#### Crawl Only
```bash
python -m crawler.crawler --base-url https://your-book-url.github.io
```

#### Process Chunks Only
```bash
python -m chunker.text_chunker
```

#### Generate Embeddings Only
```bash
python -m embedder.cohere_embedder
```

#### Validate Results Only
```bash
python -m validation.validator
```

### 3. Monitor Pipeline Progress

During execution, the pipeline will output progress information:

```
Starting RAG pipeline for: https://example.com/book
============================================================
Running crawling phase...
Crawling phase completed successfully. 25 pages crawled in 15.23s
Running chunking phase...
Chunking phase completed successfully. 120 chunks created in 2.45s
...
Pipeline completed successfully!
Pipeline Status: completed
Total Time: 85.67s
Progress: 100.0%
```

## Monitoring and Logging

### Log Files

The pipeline creates log files in the `logs/` directory:

- `pipeline.log`: Main pipeline execution log
- `crawler.log`: Crawler-specific logs
- `embedder.log`: Embedding generation logs
- `storage.log`: Qdrant storage logs

### Log Levels

- `INFO`: General progress and completion messages
- `WARNING`: Non-critical issues that don't stop execution
- `ERROR`: Issues that cause component failures
- `DEBUG`: Detailed information for troubleshooting

## Troubleshooting

### Common Issues and Solutions

#### 1. API Rate Limits

**Symptom**: Embedding or crawling stops with rate limit errors.

**Solution**: Increase the delay values in your `.env` file:
```env
CRAWL_DELAY=2.0
COHERE_RATE_LIMIT_DELAY=2.0
```

#### 2. Connection Errors

**Symptom**: Cannot connect to Qdrant or Cohere.

**Solution**:
- Verify your API keys are correct
- Check your internet connection
- Ensure the Qdrant URL is accessible
- Confirm your Cohere account has sufficient quota

#### 3. Memory Issues

**Symptom**: Process crashes with memory errors on large books.

**Solution**:
- Reduce batch sizes:
```env
BATCH_SIZE_EMBEDDING=5
BATCH_SIZE_QDRANT=50
```
- Process the book in smaller sections

#### 4. Empty Results

**Symptom**: Pipeline runs but no content is processed.

**Solution**:
- Verify the book URL is accessible
- Check if the book has a valid sitemap.xml
- Ensure the URL structure matches the expected pattern

### Getting Help

If you encounter issues not covered here:

1. Check the log files in the `logs/` directory
2. Verify all configuration values in your `.env` file
3. Test individual components separately
4. Ensure all dependencies are properly installed

## Performance Optimization

### Batch Sizes

Adjust batch sizes based on your API quotas and system capabilities:
- Higher batch sizes: Better performance, higher memory usage
- Lower batch sizes: Slower performance, lower memory usage

### Rate Limiting

Configure delays based on your API limits:
- Cohere: Usually 5-10 requests per second
- Qdrant: Usually 100+ requests per second
- Crawling: Be respectful to the target server

## Next Steps

After successfully running the pipeline:

1. **Validate Results**: Check the validation report in `logs/validation_report.txt`
2. **Test Retrieval**: Use the stored vectors for semantic search
3. **Build RAG Application**: Create a chatbot or search interface
4. **Monitor Usage**: Track API usage and costs