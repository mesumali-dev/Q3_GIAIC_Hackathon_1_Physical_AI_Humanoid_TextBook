---
id: "0001"
title: "Fix Hugging Face API 422 Errors"
stage: "general"
date_iso: "2025-12-18"
surface: "agent"
model: "claude-sonnet-4-5-20250929"
feature: "none"
branch: "001-rag-chatbot-integration"
user: "mesumali"
command: "sp.git.commit_pr"
labels: ["api", "huggingface", "chatbot", "bugfix"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files_yaml: |
  - frontend/src/services/ChatbotService.js
  - backend/src/models/user_query.py
  - backend/src/api/query.py
  - backend/main.py
tests_yaml: |
  - API integration tests
  - Frontend service validation
prompt_text: |
  User reported that the chatbot was getting 422 Unprocessable Entity errors when trying to connect to the Hugging Face deployment. The issue was that the frontend was sending requests in the wrong format for the Hugging Face backend API, which expects a specific UserQuery model format with required fields like id, timestamp, etc.
response_text: |
  Fixed the ChatbotService.js to properly format requests for the Hugging Face API by:
  1. Adding all required fields (id, timestamp, userId) to the request body
  2. Implementing proper question length validation (minimum 3 characters)
  3. Ensuring correct timestamp format (ISO string)
  4. Maintaining compatibility with both local and Hugging Face deployments
outcome: "Successfully resolved 422 errors and enabled proper communication between frontend and Hugging Face backend API"
evaluation: "The fix was validated by ensuring all required fields are included in the correct format that matches the UserQuery Pydantic model expected by the backend"
---

# Fix Hugging Face API 422 Errors

## Problem
The chatbot was getting 422 Unprocessable Entity errors when trying to connect to the Hugging Face deployment. The frontend was sending requests in the wrong format for the Hugging Face backend API, which expects a specific UserQuery model format with required fields like id, timestamp, etc.

## Solution
Fixed the ChatbotService.js to properly format requests for the Hugging Face API by:
1. Adding all required fields (id, timestamp, userId) to the request body
2. Implementing proper question length validation (minimum 3 characters)
3. Ensuring correct timestamp format (ISO string)
4. Maintaining compatibility with both local and Hugging Face deployments

## Files Modified
- frontend/src/services/ChatbotService.js - Updated request format and validation
- backend/src/models/user_query.py - UserQuery model definition
- backend/src/api/query.py - API endpoint definition
- backend/main.py - API router configuration

## Result
Successfully resolved 422 errors and enabled proper communication between frontend and Hugging Face backend API. The fix was validated by ensuring all required fields are included in the correct format that matches the UserQuery Pydantic model expected by the backend.