---
description: "Task list for Frontend-Backend Integration & In-Book RAG Chatbot UI implementation"
---

# Tasks: Frontend-Backend Integration & In-Book RAG Chatbot UI

**Input**: Design documents from `/specs/001-rag-chatbot-integration/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create backend project structure with FastAPI dependencies
- [ ] T002 Create frontend project structure with Docusaurus dependencies
- [ ] T003 [P] Configure environment variables for backend API keys
- [ ] T004 [P] Set up project configuration files for both backend and frontend

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T005 Setup backend CORS middleware for Docusaurus domain access
- [ ] T006 [P] Create backend API router and base configuration
- [ ] T007 [P] Create backend models for UserQuery, RAGResponse, SourceCitation, and ChatSession
- [ ] T008 Create frontend service for API communication in frontend/src/services/ChatbotService.js
- [ ] T009 Setup backend validation for request/response schemas
- [ ] T010 Configure backend connection to Qdrant vector database

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Interactive Question & Answer (Priority: P1) 🎯 MVP

**Goal**: Enable users to submit natural-language questions and receive grounded responses with source citations

**Independent Test**: Open the chat interface, submit a question related to book content, and receive a response with source citations

### Implementation for User Story 1

- [ ] T011 [P] [US1] Create backend POST /query endpoint in backend/src/api/query.py
- [ ] T012 [US1] Implement backend query processing logic in backend/src/services/query_service.py
- [ ] T013 [US1] Create frontend Chatbot component in frontend/src/components/Chatbot.jsx
- [ ] T014 [US1] Implement frontend UI with input box and submit button in frontend/src/components/Chatbot.jsx
- [ ] T015 [US1] Connect frontend to backend API in frontend/src/components/Chatbot.jsx
- [ ] T016 [US1] Display response with source citations in frontend/src/components/Chatbot.jsx
- [ ] T017 [US1] Add loading indicators during response processing in frontend/src/components/Chatbot.jsx

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Context-Aware Responses (Priority: P1)

**Goal**: Allow users to ask questions about specific text they have selected on the current page

**Independent Test**: Select text on a page, activate "selected text only" mode, submit a question, and receive a response based only on the selected content

### Implementation for User Story 2

- [ ] T018 [P] [US2] Update backend to support contextMode parameter in backend/src/api/query.py
- [ ] T019 [US2] Modify backend query service to handle selected text constraint in backend/src/services/query_service.py
- [ ] T020 [US2] Add selected text capture functionality in frontend/src/components/Chatbot.jsx
- [ ] T021 [US2] Implement selected text mode toggle in frontend/src/components/Chatbot.jsx
- [ ] T022 [US2] Pass selected text to backend API in frontend/src/components/Chatbot.jsx
- [ ] T023 [US2] Update UI to show selected text mode status in frontend/src/components/Chatbot.jsx

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Error Handling & Graceful Degradation (Priority: P2)

**Goal**: Handle backend service unavailability and provide appropriate feedback without breaking documentation experience

**Independent Test**: Simulate backend failures and verify appropriate error messages while documentation remains functional

### Implementation for User Story 3

- [ ] T024 [P] [US3] Implement backend error handling for service failures in backend/src/api/query.py
- [ ] T025 [US3] Create error response schemas in backend/src/models/error.py
- [ ] T026 [US3] Add frontend error handling for API failures in frontend/src/components/Chatbot.jsx
- [ ] T027 [US3] Display clear error messages to users in frontend/src/components/Chatbot.jsx
- [ ] T028 [US3] Handle empty or inadequate responses gracefully in frontend/src/components/Chatbot.jsx
- [ ] T029 [US3] Ensure chatbot doesn't break documentation experience in frontend/src/components/Chatbot.jsx

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T030 [P] Add responsive design to chatbot component in frontend/src/components/Chatbot.jsx
- [ ] T031 [P] Style chatbot to match book theme in frontend/src/css/chatbot.css
- [ ] T032 Integrate chatbot component into Docusaurus layout in frontend/src/pages/
- [ ] T033 Add performance monitoring and ensure <10% page load impact
- [ ] T034 Run quickstart.md validation checklist
- [ ] T035 Update documentation with deployment instructions

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Within Each User Story

- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all components for User Story 1 together:
Task: "Create backend POST /query endpoint in backend/src/api/query.py"
Task: "Create frontend Chatbot component in frontend/src/components/Chatbot.jsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence