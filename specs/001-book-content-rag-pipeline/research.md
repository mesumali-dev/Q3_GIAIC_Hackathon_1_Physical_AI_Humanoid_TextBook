# Research Findings: Book Content RAG Pipeline

## Decisions Made

### 1. Technology Stack Selection
**Decision**: Use Python 3.11+ with the following libraries:
- `requests` and `beautifulsoup4` for web crawling
- `cohere` for embedding generation
- `qdrant-client` for vector storage
- `tiktoken` for token counting
- `uv` as the package manager

**Rationale**: These libraries are industry-standard for web scraping, NLP, and vector databases. They have good documentation and community support.

**Alternatives considered**:
- `scrapy` instead of `requests`/`beautifulsoup4` - more complex but better for large-scale crawling
- `sentence-transformers` instead of Cohere - open source but potentially less accurate
- `chromadb` or `pinecone` instead of Qdrant - Qdrant was specifically requested in the spec

### 2. Project Structure
**Decision**: Create a modular backend structure with separate components for each pipeline stage.

**Rationale**: This follows clean architecture principles and makes the code easier to test and maintain.

### 3. Chunking Strategy
**Decision**: Implement 300-500 token chunks with 15-20% overlap using tiktoken for accurate token counting.

**Rationale**: This range balances context preservation with retrieval efficiency, and the overlap helps maintain context across chunk boundaries.

## Unknowns Requiring Clarification

### 1. Deployment Details
**Unknown**: Specific URL of the deployed Docusaurus book
**Impact**: Required for the crawler to know where to start
**Action needed**: Need to confirm if the book is already deployed or needs to be deployed first

### 2. Qdrant Cloud Configuration
**Unknown**: Qdrant Cloud endpoint URL, API key, and collection name
**Impact**: Required for vector storage
**Action needed**: Need credentials and configuration details

### 3. Cohere API Configuration
**Unknown**: Cohere API key and specific model selection (embed-english-v3.0 vs embed-multilingual-v3.0)
**Impact**: Required for embedding generation
**Action needed**: Need API key and final model decision

### 4. Content Structure
**Unknown**: Specific structure and organization of the book content
**Impact**: Affects how headings and hierarchy are extracted
**Action needed**: Need to examine the actual book structure to understand how to properly extract heading paths

### 5. Rate Limits
**Unknown**: Specific rate limits for Cohere API and Qdrant Cloud
**Impact**: Affects batch processing strategy
**Action needed**: Need to understand rate limits to design appropriate batching and retry logic

## Best Practices Researched

### 1. Web Crawling
- Respect robots.txt and implement appropriate delays
- Handle redirects and error responses gracefully
- Use session management for efficiency
- Implement retry logic for transient failures

### 2. Text Cleaning
- Remove HTML tags while preserving text content
- Handle different heading levels appropriately
- Normalize whitespace and special characters
- Preserve semantic structure (headings, paragraphs)

### 3. Embedding Generation
- Batch requests to optimize API usage
- Implement proper error handling and retry logic
- Cache embeddings to avoid regeneration
- Handle rate limits gracefully

### 4. Vector Storage
- Use batch uploads for efficiency
- Include comprehensive metadata for retrieval
- Implement proper error handling
- Validate uploads to ensure data integrity