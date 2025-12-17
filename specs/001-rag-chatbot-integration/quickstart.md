# Quickstart: Frontend-Backend Integration & In-Book RAG Chatbot UI

## Prerequisites

- Node.js 18+ for Docusaurus frontend
- Python 3.11+ for FastAPI backend
- Access to Qdrant Cloud (vector database)
- API keys for OpenAI and Qdrant (stored securely on backend)

## Backend Setup (FastAPI)

1. **Install dependencies:**
   ```bash
   pip install fastapi uvicorn python-multipart openai qdrant-client python-dotenv
   ```

2. **Configure CORS in main.py:**
   ```python
   from fastapi.middleware.cors import CORSMiddleware

   app.add_middleware(
       CORSMiddleware,
       allow_origins=["https://yourusername.github.io"],  # Production
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

3. **Create the query endpoint:**
   ```python
   @app.post("/query")
   async def query_endpoint(query_data: QueryRequest):
       # Implementation based on the API contract
       pass
   ```

## Frontend Setup (Docusaurus)

1. **Create the Chatbot React component:**
   ```jsx
   // src/components/Chatbot.jsx
   import React, { useState } from 'react';

   const Chatbot = () => {
     const [question, setQuestion] = useState('');
     const [response, setResponse] = useState(null);
     const [loading, setLoading] = useState(false);

     // Implementation to handle user queries and display responses
   };
   ```

2. **Integrate with Docusaurus:**
   - Add the component to your Docusaurus layout
   - Ensure it's available on all documentation pages
   - Style to match the book theme

## API Integration

1. **Implement HTTP POST requests from frontend to backend:**
   ```javascript
   const submitQuery = async (question, contextMode, selectedText) => {
     const response = await fetch('https://your-backend-url/query', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({
         question,
         contextMode,
         selectedText
       })
     });
     return response.json();
   };
   ```

## Selected Text Mode

1. **Capture user-highlighted text:**
   ```javascript
   const getSelectedText = () => {
     const selection = window.getSelection();
     return selection.toString().trim();
   };
   ```

2. **Pass selected text as retrieval constraint to backend**

## Testing

1. **Local testing:**
   - Start backend: `uvicorn main:app --reload`
   - Start frontend: `npm run start`
   - Test both query modes (standard and selected-text-only)

2. **Verify:**
   - Normal queries work correctly
   - Selected-text queries work correctly
   - Error handling works appropriately
   - No secrets are exposed in frontend code
   - Loading states display properly
   - Source citations are returned and displayed

## Deployment

1. **Backend:** Deploy to a cloud service (e.g., Render, Railway, or AWS)
2. **Frontend:** Build and deploy to GitHub Pages
3. **CORS:** Ensure production frontend URL is allowed in backend configuration