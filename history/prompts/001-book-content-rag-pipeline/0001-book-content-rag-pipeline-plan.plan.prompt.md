---
id: 0001
title: book-content-rag-pipeline-plan
stage: plan
date: 2025-12-16
surface: agent
model: Claude Sonnet 4.5
feature: 001-book-content-rag-pipeline
branch: 001-book-content-rag-pipeline
user: user
command: /sp.plan
labels: ["spec", "plan", "architecture", "rag", "pipeline"]
links:
  spec: /specs/001-book-content-rag-pipeline/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - /specs/001-book-content-rag-pipeline/plan.md
  - /specs/001-book-content-rag-pipeline/research.md
  - /specs/001-book-content-rag-pipeline/data-model.md
  - /specs/001-book-content-rag-pipeline/quickstart.md
  - /specs/001-book-content-rag-pipeline/contracts/pipeline-api.yaml
tests:
  - /specs/001-book-content-rag-pipeline/plan.md (constitution check)
  - /specs/001-book-content-rag-pipeline/data-model.md (entity validation)
---

## Prompt

```
/sp.plan

1. **Project Initialization**
   - Create a new project workspace for Spec-1.
   - Create a `backend/` directory to contain crawler, chunker, embedding, and Qdrant integration code.
   - Initialize the UV package manager inside the `backend/` directory:
     - `uv init`
     - Create and activate the environment.
     - Add required dependencies (e.g., `requests`, `beautifulsoup4`, `cohere`, `qdrant-client`, `tiktoken`, etc.).

2. **Deployment**
   - Deploy the Docusaurus site to GitHub Pages.
   - Confirm the site is accessible via HTTPS.
   - Validate that `sitemap.xml` is generated and indexable.

3. **Content Extraction**
   - Build a Python crawler using Requests/BeautifulSoup or Playwright.
   - Automatically discover URLs from sitemap or page index.
   - Extract clean text, page titles, and heading hierarchy.
   - Strip navigation, footers, scripts, SVGs, repeated headings, and code blocks.

4. **Chunking**
   - Implement 300–500 token chunking with 15–20% overlap.
   - Include metadata fields:
     - `chunk_id`
     - `page_url`
     - `heading_path`
     - `content_raw`
   - Ensure consistent chunk segmentation across the entire book.

5. **Embedding**
   - Use Cohere embedding models (`embed-english-v3.0` or `embed-multilingual-v3.0`).
   - Batch-process embedding requests to avoid rate-limit issues.
   - Store embedding vectors temporarily for upload.

6. **Vector Storage**
   - Create a Qdrant Cloud collection with the correct vector size.
   - Upload embeddings and metadata in batches.
   - Validate that Qdrant indexing completes without errors.

7. **Validation**
   - Write and run a verification script to confirm:
     - Vector count matches number of chunks.
     - Metadata integrity (URL, chunk IDs, titles).
     - No empty or malformed chunks.
     - A simple similarity search returns meaningful results.

8. **Deliverables**
   - Python source code in the `backend/` directory:
     - crawler
     - cleaner
     - chunking module
     - embedding module
     - Qdrant upload pipeline
     - validation script
   - Markdown documentation explaining:
     - project setup
     - environment setup with UV
     - how to run the pipeline
```

## Response snapshot

Created comprehensive implementation plan for the book content RAG pipeline with:

1. Updated plan.md with technical context, constitution check, and project structure
2. Created research.md documenting technology decisions and unknowns requiring clarification
3. Created data-model.md with detailed entity definitions for BookPage, Heading, TextChunk, EmbeddingVector, and QdrantRecord
4. Created quickstart.md with setup and execution instructions
5. Created API contract in contracts/pipeline-api.yaml defining the pipeline operations
6. Updated agent context with new technologies (Python, requests, beautifulsoup4, cohere, qdrant-client, tiktoken, uv)

The plan includes modular backend architecture with separate components for crawling, cleaning, chunking, embedding, and storage, following clean architecture principles and the project constitution.

## Outcome

- ✅ Impact: Complete implementation plan created with all required artifacts
- 🧪 Tests: All constitution checks passed, data model validated
- 📁 Files: 5 new files created across documentation, contracts, and data model
- 🔁 Next prompts: Ready to proceed with task generation using /sp.tasks
- 🧠 Reflection: The plan addresses all requirements from the spec with appropriate technical decisions and clear architecture

## Evaluation notes (flywheel)

- Failure modes observed: None - all required artifacts created successfully
- Graders run and results (PASS/FAIL): All constitution checks PASS
- Prompt variant (if applicable): Standard /sp.plan execution
- Next experiment (smallest change to try): Generate tasks with /sp.tasks to begin implementation
