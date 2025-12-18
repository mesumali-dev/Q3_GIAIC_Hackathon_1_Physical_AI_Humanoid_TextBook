# Deployment Guide: RAG Chatbot Integration

This guide provides instructions for deploying the RAG chatbot integration with your Docusaurus documentation site.

## Backend Deployment

### Prerequisites
- Python 3.11+ environment
- Access to Qdrant Cloud (or self-hosted Qdrant instance)
- API keys for OpenAI and Qdrant
- A cloud platform account (Render, Railway, AWS, etc.)

### Steps

1. **Prepare your environment**
   ```bash
   # Clone your repository
   git clone <your-repo-url>
   cd <repo-name>/backend
   ```

2. **Set up environment variables**
   Create a `.env` file in the backend directory with the following:
   ```env
   QDRANT_URL=your_qdrant_url_here
   QDRANT_API_KEY=your_qdrant_api_key_here
   OPENAI_API_KEY=your_openai_api_key_here
   BACKEND_CORS_ORIGINS=["https://your-github-username.github.io"]
   ```

3. **Install dependencies**
   ```bash
   pip install fastapi uvicorn python-multipart openai qdrant-client python-dotenv
   ```

4. **Deploy to your chosen platform**

   **For Render:**
   - Connect your GitHub repository to Render
   - Create a new Web Service
   - Set the build command to: `pip install -r requirements.txt`
   - Set the start command to: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - Add your environment variables in the Render dashboard

   **For Railway:**
   - Connect your GitHub repository to Railway
   - Add your environment variables in the Railway dashboard
   - Deploy the service with the command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

   **For AWS (using Elastic Beanstalk):**
   ```bash
   # Install EB CLI
   pip install awsebcli

   # Initialize and deploy
   eb init
   eb create production-env
   eb deploy
   ```

5. **Verify the backend is running**
   - Access your backend URL (e.g., `https://your-app.onrender.com`)
   - Verify the `/docs` endpoint shows the API documentation
   - Test the `/api/v1/query` endpoint

## Frontend Deployment (Docusaurus)

### Prerequisites
- Node.js 18+
- GitHub account for GitHub Pages

### Steps

1. **Update configuration**
   In `frontend/docusaurus.config.ts`, update the following:
   ```typescript
   const config: Config = {
     // Update these with your actual values
     url: 'https://your-github-username.github.io',
     baseUrl: '/your-repo-name/',
     organizationName: 'your-github-username',
     projectName: 'your-repo-name',

     // Update API URL in environment variables
     // This is typically done via environment variables or build-time configuration
   };
   ```

2. **Set up environment variables for the frontend**
   Create or update `.env.production` in the frontend directory:
   ```env
   REACT_APP_API_BASE_URL=https://your-backend-url.com/api/v1
   ```

3. **Build and deploy**
   ```bash
   cd frontend
   npm install
   npm run build

   # For GitHub Pages deployment
   npm run deploy
   ```

4. **Alternative: Manual GitHub Pages deployment**
   ```bash
   # Build the site
   npm run build

   # The build output will be in the build/ directory
   # Deploy this directory to your GitHub Pages branch
   ```

## Configuration

### CORS Configuration
Make sure your backend allows requests from your frontend domain:

In your backend `.env` file:
```env
BACKEND_CORS_ORIGINS=["https://your-github-username.github.io", "http://localhost:3000"]
```

### Environment Variables

**Backend (.env):**
- `QDRANT_URL` - Your Qdrant Cloud URL
- `QDRANT_API_KEY` - Your Qdrant API key
- `OPENAI_API_KEY` - Your OpenAI API key
- `BACKEND_CORS_ORIGINS` - List of allowed origins

**Frontend (build-time or runtime):**
- `REACT_APP_API_BASE_URL` - The base URL for your backend API

## Testing the Deployment

1. **Verify backend API**
   - Access `https://your-backend-url/docs` to see the API documentation
   - Test the query endpoint manually or with a tool like curl

2. **Verify frontend**
   - Access your GitHub Pages URL
   - Check that the chatbot component loads without errors
   - Test both "Full Book" and "Selected Text Only" modes

3. **Integration test**
   - Submit a question through the chatbot
   - Verify that responses come back with citations
   - Test error handling by submitting malformed requests

## Troubleshooting

### Common Issues

**CORS Errors:**
- Ensure your backend CORS configuration includes your frontend domain
- Check browser console for specific CORS error messages

**API Connection Issues:**
- Verify the backend URL in frontend configuration
- Check that your backend service is running and accessible

**Authentication Issues:**
- Verify that API keys are correctly set in the backend environment
- Ensure API keys are not exposed in frontend code

### Debugging Tips

1. **Check browser console** for JavaScript errors
2. **Check network tab** to see API requests and responses
3. **Check backend logs** for any server-side errors
4. **Verify environment variables** are correctly set on both ends

## Scaling Considerations

- **Backend**: Consider using a load balancer for high-traffic applications
- **Qdrant**: Monitor your Qdrant Cloud usage and scale as needed
- **API Keys**: Implement rate limiting to prevent abuse of your API keys
- **Caching**: Consider implementing response caching for frequently asked questions

## Security Best Practices

- Never expose API keys in frontend code
- Use HTTPS for all API communications
- Implement proper input validation and sanitization
- Regularly rotate API keys
- Monitor API usage for unusual patterns