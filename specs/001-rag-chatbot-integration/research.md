# Research: Frontend-Backend Integration & In-Book RAG Chatbot UI

## Decision: CORS Configuration for FastAPI-Docusaurus Integration
**Rationale**: To enable communication between the Docusaurus frontend (GitHub Pages) and FastAPI backend, CORS must be properly configured to allow requests from the frontend domain.
**Alternatives considered**:
- Proxy requests through frontend (would expose backend details)
- Server-side rendering (not compatible with GitHub Pages)
- CORS configuration (selected for direct communication while maintaining security)

## Decision: React Chatbot Component Architecture
**Rationale**: Creating a reusable React component ensures the chatbot can be embedded consistently across all Docusaurus documentation pages while maintaining a lightweight footprint.
**Alternatives considered**:
- Full page application (too heavy for embedded use)
- Iframe integration (creates complexity and styling issues)
- Reusable component (selected for consistency and maintainability)

## Decision: API Request Options for Query Modes
**Rationale**: The backend `/query` endpoint needs to support both standard mode (query entire book) and selected-text-only mode to fulfill the feature requirements.
**Alternatives considered**:
- Separate endpoints (unnecessary complexity)
- Single endpoint with mode parameter (selected for simplicity)

## Decision: Selected Text Capture Implementation
**Rationale**: Using JavaScript's Selection API allows capturing user-highlighted text from the page without requiring additional UI elements.
**Alternatives considered**:
- Context menu integration (more complex)
- Dedicated selection button (more UI elements needed)
- Selection API (selected for native browser support)

## Decision: Loading and Error State Management
**Rationale**: Proper UX requires clear loading indicators and error messages to maintain user confidence during API communication.
**Alternatives considered**:
- Silent processing (poor UX)
- Basic indicators (selected approach for good UX balance)
- Complex animations (unnecessary for documentation context)

## Decision: Styling and Embedding Location
**Rationale**: Embedding the chatbot in the sidebar or as a floating element ensures accessibility without disrupting the reading experience.
**Alternatives considered**:
- Sidebar integration (selected for consistent access)
- Footer placement (less accessible)
- Floating widget (potential distraction)