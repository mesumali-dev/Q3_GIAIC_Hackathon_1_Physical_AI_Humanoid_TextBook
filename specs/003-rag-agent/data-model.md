# Data Model: RAG Agent Development

## Overview
This document defines the data models for the RAG agent system, including request/response structures, entity relationships, and validation rules.

## Core Entities

### UserQuery
**Description**: Represents a question submitted by a user about book content

**Fields**:
- `question: str` - The text of the user's question (required)
- `top_k: int` - Number of documents to retrieve (optional, default: 5, range: 1-20)
- `include_sources: bool` - Whether to include source citations in response (optional, default: true)

**Validation**:
- Question must be 1-1000 characters
- top_k must be between 1 and 20
- Question cannot be empty or whitespace only

### EmbeddedQuery
**Description**: Vector representation of a user query for similarity search

**Fields**:
- `vector: List[float]` - The embedding vector (required)
- `original_query: str` - The original query text (required)

**Validation**:
- Vector must have consistent dimensions (matching Cohere model)
- Original query must match the input query

### RetrievedDocument
**Description**: Book content chunk retrieved from Qdrant that is relevant to the query

**Fields**:
- `id: str` - Unique identifier for the document chunk (required)
- `content: str` - The text content of the chunk (required)
- `metadata: Dict[str, Any]` - Additional metadata (optional)
  - `url: str` - Source URL
  - `section_title: str` - Title of the section
  - `page_number: int` - Page number if applicable
- `score: float` - Similarity score to the query (required)

**Validation**:
- Content must not be empty
- Score must be between 0 and 1
- ID must be unique within the retrieval set

### AgentResponse
**Description**: The generated answer based on retrieved context with source references

**Fields**:
- `answer: str` - The agent's response to the user's question (required)
- `sources: List[RetrievedDocument]` - Documents used to generate the response (required)
- `retrieval_metadata: Dict[str, Any]` - Information about the retrieval process (optional)
  - `query_time: float` - Time taken for retrieval
  - `agent_time: float` - Time taken for agent processing
  - `total_time: float` - Total processing time

**Validation**:
- Answer must be provided
- Sources list must match the retrieved documents used
- Answer should reference information from the sources

### SystemConfiguration
**Description**: Parameters like top-K retrieval count and other operational settings

**Fields**:
- `top_k_default: int` - Default number of documents to retrieve (required, default: 5)
- `top_k_min: int` - Minimum allowed top-K value (required, default: 1)
- `top_k_max: int` - Maximum allowed top-K value (required, default: 20)
- `agent_timeout: int` - Maximum time to wait for agent response in seconds (required, default: 30)

**Validation**:
- top_k_default must be between top_k_min and top_k_max
- All values must be positive integers

## API Request/Response Models

### QueryRequest
**Purpose**: Request model for the `/query` endpoint

**Fields**:
- `question: str` - The user's question (required)
- `top_k: Optional[int]` - Number of documents to retrieve (default: 5)

### QueryResponse
**Purpose**: Response model for the `/query` endpoint

**Fields**:
- `answer: str` - The agent's answer to the question (required)
- `sources: List[SourceReference]` - List of source references used (required)
- `query_id: str` - Unique identifier for the query (required)

### SourceReference
**Purpose**: Model for source references in the response

**Fields**:
- `content: str` - Excerpt from the source (required)
- `metadata: Dict[str, Any]` - Source metadata (required)
- `relevance_score: float` - Relevance score (required)

## State Transitions

### Query Processing Flow
1. **UserQueryReceived**: User submits a question
2. **QueryEmbedded**: Question is converted to embedding vector
3. **DocumentsRetrieved**: Relevant documents are retrieved from Qdrant
4. **AgentProcessed**: Agent generates response using retrieved context
5. **ResponseGenerated**: Final response with sources is returned to user

## Relationships

```
UserQuery --(1 to many)--> EmbeddedQuery
EmbeddedQuery --(1 to many)--> RetrievedDocument
RetrievedDocument --(many to 1)--> AgentResponse
SystemConfiguration --(1 to many)--> Query Processing
```

## Validation Rules

### Cross-Entity Validation
- AgentResponse sources must match the RetrievedDocuments used in processing
- QueryResponse sources must be a subset of RetrievedDocuments for the query
- Agent responses must cite information from the provided sources

### Business Logic Validation
- If no relevant documents are retrieved, the agent must respond with "not found in the book"
- Response grounding: Agent answers must be based only on retrieved content
- Source attribution: All claims in the response must be traceable to sources