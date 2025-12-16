# Troubleshooting Guide

This guide helps you diagnose and resolve common issues with the Book Content RAG Pipeline.

## Table of Contents
- [Common Issues](#common-issues)
- [Crawling Issues](#crawling-issues)
- [Embedding Issues](#embedding-issues)
- [Storage Issues](#storage-issues)
- [Configuration Issues](#configuration-issues)
- [Performance Issues](#performance-issues)
- [Debugging Tips](#debugging-tips)

## Common Issues

### 1. Pipeline Fails to Start

**Symptoms**:
- ImportError when running the pipeline
- Missing module errors

**Solutions**:
1. Verify all dependencies are installed:
   ```bash
   cd backend
   uv pip install requests beautifulsoup4 cohere qdrant-client tiktoken python-dotenv
   ```

2. Check Python version is 3.11+:
   ```bash
   python --version
   ```

3. Ensure virtual environment is activated:
   ```bash
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

### 2. Environment Variables Not Loading

**Symptoms**:
- Configuration values are None or empty
- API key errors despite having .env file

**Solutions**:
1. Verify .env file exists in backend directory:
   ```bash
   ls -la .env
   ```

2. Check file permissions:
   ```bash
   chmod 600 .env  # Restrict access to owner only
   ```

3. Ensure .env file has correct format (no spaces around =):
   ```env
   COHERE_API_KEY=your_key_here
   QDRANT_URL=https://your-instance.qdrant.tech
   ```

## Crawling Issues

### 1. Sitemap Not Found

**Symptoms**:
- "No URLs found in sitemap" message
- Pipeline discovers only the base URL

**Solutions**:
1. Verify sitemap.xml exists at `https://your-book.com/sitemap.xml`
2. Check if the sitemap is properly formatted XML
3. If no sitemap exists, ensure the crawler can discover URLs from the index page

### 2. Rate Limiting or Blocking

**Symptoms**:
- 429 (Too Many Requests) errors
- IP address blocked by target server
- Intermittent connection failures

**Solutions**:
1. Increase crawl delay in configuration:
   ```env
   CRAWL_DELAY=2.0
   ```

2. Add random delays to be more respectful:
   ```python
   import time
   import random
   time.sleep(base_delay + random.uniform(0.5, 1.5))
   ```

3. Check if the site has robots.txt restrictions:
   ```bash
   curl https://your-book.com/robots.txt
   ```

### 3. Content Extraction Problems

**Symptoms**:
- Empty or incomplete text extraction
- Missing headings or structure
- Too much navigation content included

**Solutions**:
1. Inspect the actual HTML structure of the pages
2. Update the content extraction selectors in the crawler
3. Ensure proper HTML parsing libraries are used

## Embedding Issues

### 1. API Key Authentication Errors

**Symptoms**:
- 401 or 403 HTTP errors
- "Invalid API key" messages
- Authentication failures

**Solutions**:
1. Verify your Cohere API key is correct and active
2. Check that your Cohere account has sufficient quota
3. Ensure no extra spaces or characters in the API key

### 2. Rate Limit Exceeded

**Symptoms**:
- 429 HTTP errors
- "Rate limit exceeded" messages
- Embedding process stops intermittently

**Solutions**:
1. Increase the rate limit delay:
   ```env
   COHERE_RATE_LIMIT_DELAY=2.0
   ```

2. Reduce batch size to stay within limits:
   ```env
   BATCH_SIZE_EMBEDDING=5
   ```

3. Check your Cohere account's rate limits in the dashboard

### 3. Embedding Dimension Mismatches

**Symptoms**:
- Errors during vector storage
- Dimension mismatch errors
- Inconsistent vector sizes

**Solutions**:
1. Verify all embeddings use the same model
2. Check that the Qdrant collection is created with correct vector size
3. For Cohere's embed-english-v3.0, the dimension should be 1024

## Storage Issues

### 1. Qdrant Connection Failures

**Symptoms**:
- Connection timeout errors
- "Failed to connect" messages
- Network-related errors

**Solutions**:
1. Verify Qdrant URL is correct and accessible
2. Check Qdrant API key permissions
3. Ensure firewall allows outbound connections
4. Test Qdrant connection separately:
   ```python
   from qdrant_client import QdrantClient
   client = QdrantClient(url="your_url", api_key="your_key")
   client.get_collections()  # Should return without error
   ```

### 2. Collection Not Found

**Symptoms**:
- "Collection doesn't exist" errors
- 404 errors when accessing Qdrant

**Solutions**:
1. Ensure collection initialization runs before storage operations
2. Verify collection name matches in configuration
3. Check Qdrant instance has sufficient permissions to create collections

### 3. Storage Quota Exceeded

**Symptoms**:
- 413 (Payload Too Large) errors
- Storage limit exceeded messages
- Qdrant rejecting new vectors

**Solutions**:
1. Check your Qdrant Cloud plan limits
2. Reduce batch size for uploads:
   ```env
   BATCH_SIZE_QDRANT=50
   ```
3. Consider upgrading your Qdrant Cloud plan if needed

## Configuration Issues

### 1. Incorrect Token Counts

**Symptoms**:
- Text chunks not meeting 300-500 token requirement
- Validation errors for token counts
- Unexpected chunk sizes

**Solutions**:
1. Verify token counting uses the same method as validation:
   ```python
   import tiktoken
   enc = tiktoken.encoding_for_model("gpt-3.5-turbo")  # or appropriate model
   token_count = len(enc.encode(text))
   ```

2. Check that minimum token requirements are met in TextChunk model

### 2. Invalid URL Formats

**Symptoms**:
- URL validation errors
- "URL must start with http://" or "https://" errors

**Solutions**:
1. Ensure all URLs use proper protocol:
   ```python
   # Correct
   url = "https://example.com/page"

   # Incorrect
   url = "example.com/page"
   ```

## Performance Issues

### 1. Slow Processing

**Symptoms**:
- Pipeline taking longer than 10 minutes
- High memory usage
- API calls taking too long

**Solutions**:
1. Optimize batch sizes:
   ```env
   BATCH_SIZE_EMBEDDING=20  # Within API limits
   BATCH_SIZE_QDRANT=200    # Within Qdrant limits
   ```

2. Use gRPC for Qdrant (enabled by default in our implementation)

3. Implement proper caching to avoid redundant API calls

### 2. Memory Exhaustion

**Symptoms**:
- Process killed due to memory limits
- "Out of memory" errors
- System slowdown during execution

**Solutions**:
1. Process data in smaller chunks
2. Clear unnecessary variables after use
3. Use generators instead of loading all data into memory
4. Reduce batch sizes:
   ```env
   BATCH_SIZE_EMBEDDING=5
   BATCH_SIZE_QDRANT=50
   ```

## Debugging Tips

### 1. Enable Debug Logging

Add this to your configuration for detailed logs:
```env
LOG_LEVEL=DEBUG
```

### 2. Test Components Individually

Test each pipeline component separately:
```bash
# Test crawler
python -m crawler.crawler --base-url https://test.com --debug

# Test chunker
python -m chunker.text_chunker --test

# Test embedder (with mock data if no API key)
python -c "from embedder.cohere_embedder import test_embedding; test_embedding()"
```

### 3. Check Log Files

Review the log files in the `logs/` directory:
```bash
# View recent pipeline logs
tail -f logs/pipeline.log

# Search for errors
grep -i error logs/pipeline.log

# Monitor during execution
tail -f logs/pipeline.log | grep -i -E "(error|warning|failed)"
```

### 4. Validate Configuration

Create a simple test script to validate your configuration:
```python
from config.config import config

print("Configuration Validation:")
print(f"Cohere API Key Set: {bool(config.cohere_api_key)}")
print(f"Qdrant URL: {config.qdrant_url}")
print(f"Qdrant API Key Set: {bool(config.qdrant_api_key)}")
print(f"Chunk Min Tokens: {config.chunk_min_tokens}")
print(f"Chunk Max Tokens: {config.chunk_max_tokens}")
```

### 5. API Testing

Test API connectivity separately:
```python
# Test Cohere API
import cohere
client = cohere.Client(config.cohere_api_key)
try:
    response = client.embed(texts=["test"], model=config.cohere_model)
    print("Cohere API: OK")
except Exception as e:
    print(f"Cohere API: Error - {e}")

# Test Qdrant connection
from qdrant_client import QdrantClient
try:
    client = QdrantClient(url=config.qdrant_url, api_key=config.qdrant_api_key)
    collections = client.get_collections()
    print("Qdrant Connection: OK")
except Exception as e:
    print(f"Qdrant Connection: Error - {e}")
```

## Getting Help

If you encounter issues not covered in this guide:

1. Check the complete error messages in the log files
2. Verify all configuration values are correct
3. Test API connectivity independently
4. Consider running the pipeline with a smaller test dataset first
5. Consult the official documentation for the libraries used:
   - Cohere Python SDK
   - Qdrant Python client
   - Beautiful Soup for HTML parsing