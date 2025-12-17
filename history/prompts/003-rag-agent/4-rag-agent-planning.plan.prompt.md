---
id: 4
title: rag-agent-planning
stage: plan
date: 2025-12-17
surface: agent
model: claude-sonnet-4-5-20250929
feature: rag-agent
branch: 003-rag-agent
user: mesumali
command: /sp.plan
labels: [plan,rag,agent,openai,fastapi,architecture]
links:
  spec: /mnt/e/GIAIC/Hackhathons/New folder/Try_004/specs/003-rag-agent/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - /mnt/e/GIAIC/Hackhathons/New folder/Try_004/specs/003-rag-agent/plan.md
 - /mnt/e/GIAIC/Hackhathons/New folder/Try_004/specs/003-rag-agent/research.md
 - /mnt/e/GIAIC/Hackhathons/New folder/Try_004/specs/003-rag-agent/data-model.md
 - /mnt/e/GIAIC/Hackhathons/New folder/Try_004/specs/003-rag-agent/quickstart.md
 - /mnt/e/GIAIC/Hackhathons/New folder/Try_004/specs/003-rag-agent/contracts/query-api.yaml
 - /mnt/e/GIAIC/Hackhathons/New folder/Try_004/CLAUDE.md
tests:

---

## Prompt


1. **Project Setup**
   - Extend the existing `backend/` directory.
   - Initialize FastAPI application structure.
   - Add required dependencies via UV:
     - fastapi
     - uvicorn
     - openai-agents
     - qdrant-client
     - cohere

2. **Agent Configuration**
   - Configure OpenAI Agentsc Python SDK with environment-based API keys.
   - Define agent system instructions to:
     - answer only using retrieved context
     - cite sources in responses
     - avoid speculation

3. **Retrieval Integration**
   - Reuse Spec-2 retrieval pipeline.
   - Inject top-K retrieved chunks into the agent context.
   - Attach metadata (URLs, section titles) for source citation.

4. **FastAPI Endpoints**
   - Create `/query` endpoint:
     - accepts user question
     - calls retrieval pipeline
     - invokes agent
     - returns JSON response
   - Validate request and response schemas.

5. **Grounding & Safety**
   - Enforce hard constraints:
     - refuse to answer if no relevant context is retrieved
     - respond with "not found in the book" when applicable

6. **Testing & Validation**
   - Write integration tests for agent + retrieval.
   - Run at least 10 validated queries.
   - Verify correctness, grounding, and latency.

7. **Deliverables**
   - FastAPI backend with agent integration.
   - Agent configuration and prompt templates.
   - Test scripts and sample requests.
   - Markdown documentation for setup and usage.

## Response snapshot

# Implementation Plan: RAG Agent Development with OpenAI Agents Python SDK + FastAPI

**Branch**: `003-rag-agent` | **Date**: 2025-12-17 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-rag-agent/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build a Retrieval-Augmented Generation (RAG) agent using the OpenAI Agents Python SDK and FastAPI that can answer questions about the book by retrieving relevant context from Qdrant and generating grounded responses. The system will accept user queries via a FastAPI endpoint, embed queries using Cohere, retrieve relevant documents from Qdrant Cloud, pass context to an OpenAI Agent for response generation, and return JSON responses with answers and source references.

## Technical Context

**Language/Version**: Python 3.11
**Primary Dependencies**: FastAPI, OpenAI Agents Python SDK, Qdrant-client, Cohere, Uvicorn
**Storage**: Qdrant Cloud (vector database), environment variables for API keys
**Testing**: pytest for unit and integration tests
**Target Platform**: Linux server (backend service)
**Project Type**: Web application (backend service)
**Performance Goals**: <2000ms response time for query processing, support 10 concurrent users
**Constraints**: Must use Cohere embeddings matching Specs 1 & 2, responses must be grounded in retrieved content only, configurable top-K retrieval
**Scale/Scope**: Support book content queries with source citations, handle 1000+ validated end-to-end test queries

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Specification-Driven Development Compliance
- ✅ Feature begins with formal specification (spec.md exists)
- ✅ Scope, requirements, and acceptance criteria clearly defined
- ✅ Validation methods documented in spec

### Technical Accuracy and Validation Compliance
- ✅ Technical approach validated against official documentation (FastAPI, OpenAI Agents SDK, Qdrant)
- ✅ Dependencies will be validated for version compatibility
- ✅ Architecture will include reasoning and alternatives considered

### Accessibility and Clarity Compliance
- ✅ Implementation plan written in clear, accessible manner
- ✅ Technical decisions will be explained with reasoning
- ✅ Code structure will follow consistent patterns

### Maintainability and Consistency Compliance
- ✅ Code will follow consistent structural patterns with existing codebase
- ✅ Dependencies managed via UV package manager as required
- ✅ Configuration files will be version-controlled

### Reproducible Builds Compliance
- ✅ FastAPI backend will be buildable and deployable
- ✅ Dependencies will be properly specified for reproducible builds
- ✅ Configuration will be environment-based for deployment flexibility

### RAG System Excellence Compliance
- ✅ Retrieval pipeline will be fully documented (reusing Spec-2)
- ✅ Qdrant schema and integration will be validated
- ✅ FastAPI implementation will follow best practices
- ✅ Model responses will cite retrieved text as required
- ✅ Response grounding in content will be enforced

## Project Structure

### Documentation (this feature)

```text
specs/003-rag-agent/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── main.py              # FastAPI application entry point
│   ├── models/
│   │   ├── request.py       # Request/response models
│   │   └── agent.py         # Agent configuration models
│   ├── services/
│   │   ├── retrieval.py     # Retrieval pipeline integration
│   │   ├── agent_service.py # OpenAI Agent service
│   │   └── embedding.py     # Cohere embedding service
│   ├── api/
│   │   └── v1/
│   │       └── query.py     # Query endpoint
│   └── config/
│       └── settings.py      # Configuration and settings
├── tests/
│   ├── unit/
│   │   ├── test_models.py
│   │   └── test_services.py
│   ├── integration/
│   │   └── test_query_endpoint.py
│   └── contract/
│       └── test_api_contract.py
├── requirements.txt         # Dependencies managed via UV
└── run.py                 # Application runner
```

**Structure Decision**: Backend-only service structure selected as the feature requires a FastAPI backend with OpenAI Agents integration. The structure follows the web application pattern with dedicated models, services, and API layers to handle RAG functionality.

## Generated Artifacts

### Phase 0: Research
- `research.md` - Technical research and decision rationale

### Phase 1: Design & Contracts
- `data-model.md` - Entity definitions and relationships
- `contracts/query-api.yaml` - OpenAPI specification for the query endpoint
- `quickstart.md` - Setup and usage instructions
- Agent context updated in `CLAUDE.md`

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |

## Outcome

- ✅ Impact: Created comprehensive implementation plan for RAG agent with OpenAI Agents Python SDK and FastAPI
- 🧪 Tests: No tests added yet, will be added during implementation
- 📁 Files: Created plan.md, research.md, data-model.md, quickstart.md, contracts/query-api.yaml, and updated CLAUDE.md
- 🔁 Next prompts: Ready for /sp.tasks to generate implementation tasks
- 🧠 Reflection: Planning phase complete with all required artifacts generated and architecture validated against constitution

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS - All constitution checks passed
- Prompt variant (if applicable):
- Next experiment (smallest change to try): Generate tasks with /sp.tasks