# Data Model: Chapter-Level Content Personalization

## Entities

### PersonalizationRequest
**Description**: Request payload for the personalization API

**Fields**:
- `chapter_content` (string): The original chapter content to be personalized
- `chapter_title` (string): Title of the chapter for context
- `user_profile` (object): User's profile information
  - `knowledge_level` (enum: beginner, intermediate, advanced): User's knowledge level
  - `software_background` (string): User's software experience
  - `hardware_background` (string): User's hardware experience
- `user_id` (string): Identifier for the authenticated user

### PersonalizationResponse
**Description**: Response from the personalization API

**Fields**:
- `personalized_content` (string): The personalized chapter content
- `structure_preserved` (boolean): Indicates if document structure was preserved
- `personalization_applied` (boolean): Indicates if personalization was successfully applied
- `processing_time` (number): Time taken for personalization in milliseconds

### UserProfile
**Description**: User profile information used for personalization

**Fields**:
- `id` (string): User identifier
- `knowledge_level` (enum: beginner, intermediate, advanced): User's knowledge level
- `software_background` (string): User's software experience
- `hardware_background` (string): User's hardware experience
- `profile_complete` (boolean): Indicates if profile is complete

### ChapterContent
**Description**: Structure for representing chapter content with preserved formatting

**Fields**:
- `title` (string): Chapter title
- `headings` (array): Array of heading objects with hierarchy
- `paragraphs` (array): Array of paragraph content
- `lists` (array): Array of list items
- `code_blocks` (array): Array of code blocks (preserved unchanged)
- `other_elements` (array): Other content elements (tables, images, etc.)

### PersonalizationSettings
**Description**: Configuration for the personalization process

**Fields**:
- `timeout_configurable` (boolean): Whether timeout is configurable
- `max_content_length` (number): Maximum length of content to process
- `personalization_rules` (object): Rules for different knowledge levels
  - `beginner` (object): Rules for beginner users
    - `explanation_depth` (string): Detailed explanations
    - `terminology` (string): Basic terminology
    - `examples` (string): Simple examples
  - `intermediate` (object): Rules for intermediate users
    - `explanation_depth` (string): Balanced explanations
    - `terminology` (string): Moderate terminology
    - `examples` (string): Standard examples
  - `advanced` (object): Rules for advanced users
    - `explanation_depth` (string): Concise explanations
    - `terminology` (string): Technical terminology
    - `examples` (string): Advanced examples

## State Transitions

### Personalization State
- `ORIGINAL`: Content is in original form
- `PERSONALIZING`: Content is being processed
- `PERSONALIZED`: Content has been personalized
- `ERROR`: Personalization failed, showing fallback content

## Validation Rules

### PersonalizationRequest Validation
- `chapter_content` must not be empty
- `user_profile` must be complete (all required fields present)
- `knowledge_level` must be one of the allowed values
- Content length must not exceed maximum allowed

### UserProfile Validation
- All profile fields are required for personalization access
- `knowledge_level` must be specified
- Profile must be marked as complete before personalization

## Relationships
- `UserProfile` (1) → (Many) `PersonalizationRequest`
- `PersonalizationRequest` (1) → (1) `PersonalizationResponse`