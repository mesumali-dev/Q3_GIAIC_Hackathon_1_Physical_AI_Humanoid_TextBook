# Quickstart Guide: Better Auth Integration with User Background Personalization

## Overview
This guide provides quick setup instructions for the Better Auth integration with user background personalization feature.

## Prerequisites
- Node.js 18+ for frontend (Docusaurus)
- Python 3.11+ for backend (FastAPI)
- Better Auth account and credentials
- Qdrant Cloud account (for vector database)
- OpenAI API key

## Backend Setup

### 1. Environment Variables
```bash
# Better Auth configuration
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your-better-auth-secret
NEXTAUTH_URL=http://localhost:3000

# Database configuration
DATABASE_URL=postgresql://user:password@localhost:5432/mydb
QDRANT_URL=your-qdrant-cluster-url
QDRANT_API_KEY=your-qdrant-api-key

# API Keys
OPENAI_API_KEY=your-openai-api-key
```

### 2. Install Dependencies
```bash
cd backend
pip install fastapi uvicorn python-multipart better-auth-sdk
```

### 3. Initialize Better Auth
```bash
# Follow Better Auth setup instructions
# Configure custom user fields for background information
```

## Frontend Setup

### 1. Install Dependencies
```bash
cd frontend
npm install @better-auth/react
```

### 2. Configure Authentication Context
```typescript
// Create AuthContext with Better Auth integration
// Implement protected route components
// Add user background collection to signup flow
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register user with background info
- `POST /api/auth/signin` - Authenticate user
- `POST /api/auth/signout` - End session

### User Profile
- `GET /api/user/profile` - Get user background profile
- `PUT /api/user/profile` - Update user background profile

### Personalization
- `GET /api/personalization/context` - Get context for chatbot

## Running the Application

### Backend
```bash
cd backend
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm start
```

## Testing
```bash
# Run backend tests
cd backend
pytest tests/

# Run frontend tests
cd frontend
npm test
```

## Key Components
1. **Auth Components**: Signup/Signin forms with background collection
2. **User Context**: React Context for managing authentication state
3. **Protected Routes**: Components that require authentication
4. **Personalization Service**: Logic for adapting content based on user background