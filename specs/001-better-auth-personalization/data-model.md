# Data Model: Better Auth Integration with User Background Personalization

## Overview
This document defines the data models for the Better Auth integration with user background personalization feature.

## Entity: User Account
**Source**: Better Auth managed
**Description**: Core user account managed by Better Auth

**Fields**:
- `id` (string): Unique user identifier from Better Auth
- `email` (string): User's email address (unique, required)
- `created_at` (datetime): Account creation timestamp
- `updated_at` (datetime): Last update timestamp

## Entity: User Background Profile
**Source**: Custom application table
**Description**: User's software and hardware background information for personalization

**Fields**:
- `user_id` (string): Foreign key to Better Auth user ID (unique, required)
- `software_level` (enum): User's software experience level (beginner, intermediate, advanced) - required
- `hardware_background` (enum): User's hardware experience (robotics, embedded systems, none, other) - required
- `created_at` (datetime): Profile creation timestamp
- `updated_at` (datetime): Last profile update timestamp

**Validation Rules**:
- `software_level` must be one of the defined enum values
- `hardware_background` must be one of the defined enum values
- Both fields are required during account creation
- `user_id` must reference an existing Better Auth user

## Entity: Authentication Session
**Source**: Better Auth managed
**Description**: User's authentication state across sessions

**Fields**:
- `session_id` (string): Unique session identifier
- `user_id` (string): Reference to Better Auth user ID
- `expires_at` (datetime): Session expiration timestamp
- `created_at` (datetime): Session creation timestamp

## Entity: Personalized Content Interaction
**Source**: Application logging
**Description**: Track personalized content interactions for analytics

**Fields**:
- `id` (string): Unique interaction identifier
- `user_id` (string): Reference to Better Auth user ID
- `content_type` (string): Type of content (chat, translation, etc.)
- `background_used` (object): User background data used for personalization
- `timestamp` (datetime): Interaction timestamp
- `personalization_effectiveness` (number): Rating of personalization quality (0-5)

## Relationships
- User Account (1) → (0 or 1) User Background Profile: One-to-zero-or-one relationship
- User Account (1) → (Many) Authentication Session: One-to-many relationship
- User Account (1) → (Many) Personalized Content Interaction: One-to-many relationship

## State Transitions

### User Background Profile
- `created`: Profile is created during account signup
- `updated`: Profile is modified by user in settings
- `archived`: Profile is deactivated (retention policy)

## API Contracts

### Authentication Endpoints

#### POST /api/auth/signup
**Description**: Register new user with background information
**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "secure_password",
  "software_level": "beginner",
  "hardware_background": "robotics"
}
```
**Response**:
```json
{
  "success": true,
  "user_id": "user_123",
  "session_token": "token_456"
}
```

#### POST /api/auth/signin
**Description**: Authenticate existing user
**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "secure_password"
}
```
**Response**:
```json
{
  "success": true,
  "user_id": "user_123",
  "session_token": "token_456",
  "background_profile": {
    "software_level": "beginner",
    "hardware_background": "robotics"
  }
}
```

### User Profile Endpoints

#### GET /api/user/profile
**Description**: Get current user's background profile
**Headers**: Authorization: Bearer {token}
**Response**:
```json
{
  "user_id": "user_123",
  "software_level": "beginner",
  "hardware_background": "robotics",
  "created_at": "2023-01-01T00:00:00Z",
  "updated_at": "2023-01-01T00:00:00Z"
}
```

#### PUT /api/user/profile
**Description**: Update user's background profile
**Headers**: Authorization: Bearer {token}
**Request Body**:
```json
{
  "software_level": "intermediate",
  "hardware_background": "embedded systems"
}
```
**Response**:
```json
{
  "success": true,
  "user_id": "user_123",
  "software_level": "intermediate",
  "hardware_background": "embedded systems"
}
```

### Personalization Endpoints

#### GET /api/personalization/context
**Description**: Get personalization context for chatbot
**Headers**: Authorization: Bearer {token}
**Response**:
```json
{
  "user_context": {
    "software_level": "beginner",
    "hardware_background": "robotics",
    "personalization_notes": "User is a beginner in software development with robotics experience. Provide simplified explanations with robotics examples where applicable."
  }
}
```