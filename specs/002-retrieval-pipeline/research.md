# Research: Retrieval Pipeline Implementation

## Overview
This research document addresses the technical requirements for implementing the retrieval pipeline that queries the Qdrant vector database using semantic similarity search with Cohere embeddings.

## Decision: Cohere Embedding Model Selection
**Rationale**: The specification requires using the same Cohere model as Spec-1. Based on the CLAUDE.md file, the project is using Cohere for embeddings in the RAG pipeline.
**Implementation**: Use Cohere's embed-multilingual-v3.0 model or the latest available model that matches what was used in Spec-1.
**Alternatives considered**: OpenAI embeddings, Hugging Face models - but constraint requires same model as Spec-1.

## Decision: Qdrant Cloud Integration
**Rationale**: The specification requires connecting to Qdrant Cloud Free Tier with existing collection from Spec-1.
**Implementation**: Use qdrant-client Python library to connect to existing collection with proper API key and URL.
**Configuration**: Will need QDRANT_HOST and QDRANT_API_KEY environment variables.

## Decision: Query Processing Pipeline
**Rationale**: Need to handle natural language queries and convert to embeddings for similarity search.
**Implementation**:
1. Accept query input via CLI parameter
2. Use Cohere client to generate embedding for query
3. Execute search in Qdrant with cosine similarity
4. Return top-K results with metadata
**Alternatives considered**: Different vector databases or similarity methods - but specification mandates Qdrant and cosine similarity.

## Decision: Metadata Filtering Implementation
**Rationale**: The system needs to support filtering by page URL or section as specified.
**Implementation**: Use Qdrant's payload filtering capabilities to filter results by metadata fields.
**Fields**: Will filter by "url" and "section_hierarchy" or similar metadata fields stored in Qdrant.

## Decision: Context Reconstruction
**Rationale**: Results must include original text, source URL, section hierarchy, and chunk IDs.
**Implementation**: Extract these fields from the Qdrant payload and reconstruct them in the output.
**Structure**: Return as structured JSON with all required metadata fields.

## Decision: Performance Monitoring
**Rationale**: Need to log retrieval scores and response times as specified.
**Implementation**: Use Python's time module to measure query execution time and log similarity scores from Qdrant results.
**Tools**: Python logging module for structured logging.

## Decision: CLI Interface
**Rationale**: Need a way to run sample queries for testing as specified.
**Implementation**: Create a command-line interface using argparse to accept query text, top-K parameter, and optional filters.
**Output**: Structured JSON output as specified.

## Decision: Testing Approach
**Rationale**: Need to validate with at least 10 test queries as specified.
**Implementation**: Create test script that runs predefined queries and validates results.
**Validation**: Check for relevance, metadata completeness, and performance metrics.

## Dependencies to Add
- cohere>=5.0
- qdrant-client>=1.9
- python-dotenv (for environment management)

## Architecture Components
1. **QueryProcessor**: Handles input processing and embedding generation
2. **RetrievalService**: Manages Qdrant connection and search operations
3. **ResultFormatter**: Reconstructs context with proper metadata
4. **FilterService**: Handles metadata filtering
5. **Logger**: Tracks performance metrics