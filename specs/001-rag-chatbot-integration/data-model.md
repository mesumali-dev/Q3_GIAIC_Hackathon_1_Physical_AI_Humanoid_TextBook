# Data Model: Frontend-Backend Integration & In-Book RAG Chatbot UI

## Entities

### UserQuery
- **id**: string (unique identifier for the query session)
- **question**: string (the natural language question from the user)
- **contextMode**: enum (values: "full-book", "selected-text-only")
- **selectedText**: string? (optional text that the user has selected, when contextMode is "selected-text-only")
- **timestamp**: datetime (when the query was submitted)
- **userId**: string? (optional user identifier if tracking is needed)

### RAGResponse
- **id**: string (unique identifier for the response, matches the query id)
- **answer**: string (the response text from the RAG agent)
- **sourceCitations**: array of SourceCitation (references to book content used in the response)
- **queryId**: string (reference to the original UserQuery)
- **timestamp**: datetime (when the response was generated)
- **status**: enum (values: "success", "partial", "error", "empty")

### SourceCitation
- **url**: string (URL of the source content in the book)
- **section**: string (title or heading of the referenced section)
- **excerpt**: string (relevant text excerpt from the source)
- **confidence**: number (confidence score of the citation relevance, 0-1)

### ChatSession
- **id**: string (unique identifier for the chat session)
- **userQueries**: array of UserQuery (all queries in the session)
- **responses**: array of RAGResponse (all responses in the session)
- **createdAt**: datetime (when the session started)
- **lastActiveAt**: datetime (when the last interaction occurred)
- **isActive**: boolean (whether the session is currently active)

## Validation Rules

### UserQuery Validation
- question: required, minimum 3 characters, maximum 1000 characters
- contextMode: required, must be one of the allowed values
- selectedText: required only when contextMode is "selected-text-only", maximum 5000 characters

### RAGResponse Validation
- answer: required, minimum 1 character
- sourceCitations: required, minimum 1 citation for successful responses
- status: required, must be one of the allowed values

### SourceCitation Validation
- url: required, valid URL format
- section: required, minimum 1 character
- excerpt: required, minimum 1 character
- confidence: required, between 0 and 1

## State Transitions

### UserQuery States
- PENDING → PROCESSING → COMPLETED/ERROR (based on backend response)

### ChatSession States
- ACTIVE → INACTIVE (after period of inactivity or explicit end)