---
id: 1
title: AI Spec Driven Book Constitution
stage: constitution
date: 2025-12-16
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: master
user: claude
command: /sp.constitution
labels: ["constitution", "spec", "governance"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - .specify/memory/constitution.md
tests:
 - none
---

## Prompt

```text


AI/Spec-Driven Book with Integrated RAG Chatbot

Core principles:
- Specification-driven development using Spec-Kit Plus
- Accuracy and technical correctness across all book content
- Clear, accessible writing suitable for developers and students
- Maintainability of code examples, architecture diagrams, and configuration files
- Consistency across chapters, components, and generated assets
- Reproducible builds using Claude Code and Docusaurus workflows

Key standards:
- All technical explanations must be validated against official documentation
  (Docusaurus, OpenAI Agents/ChatKit SDK, FastAPI, Qdrant, Neon Postgres, GitHub Pages)
- Code samples must be runnable, tested, and version-compatible
- Architecture explanations must include diagrams, workflows, and reasoning
- Writing tone: simple, teacher-like, technically precise
- All features, components, and chapters must be spec-driven using Spec-Kit Plus
- GitHub Pages deployment instructions must be accurate and reproducible

Book requirements:
- Written using Docusaurus
- Automatically buildable/deployable to GitHub Pages
- Includes step-by-step tutorials, code samples, and diagrams
- Includes a fully embedded RAG chatbot that:
  - Uses OpenAI Agents/ChatKit SDK
  - Uses FastAPI backend
  - Uses Qdrant (Free Tier) vector database
  - Uses Neon Serverless Postgres
  - Can answer questions about book content
  - Can answer questions based only on selected text by the user

RAG chatbot standards:
- Retrieval pipeline must be fully documented
- Chunking strategy must be described and configurable
- Qdrant schema must be validated and version-controlled
- FastAPI implementation must follow best practices
- Model responses must cite retrieved text
- UI/UX must be embedded directly in the Docusaurus UI

Constraints:
- Consistent chapter structure across the entire book
- All diagrams generated using Claude Code or external plugins
- No broken links, code errors, or missing configuration files
- All text output must follow the constitution rules
- Deployment is mandatory and must be automated

Success criteria:
- Book successfully builds and deploys on GitHub Pages
- RAG chatbot fully operational inside the published Docusaurus site
- All content generated via Spec-Kit Plus matches the constitution
- All instructions can be followed by students with minimal friction
- All components (specs, skills, pages, backend, chatbot) are unified and consistent
- The project demonstrates complete Spec-Driven Development workflow
```

## Response snapshot

Created a comprehensive constitution for the AI/Spec-Driven Book with Integrated RAG Chatbot project. The constitution includes six core principles: Specification-Driven Development, Technical Accuracy and Validation, Accessibility and Clarity, Maintainability and Consistency, Reproducible Builds, and RAG System Excellence. It also includes sections on additional requirements for the book structure and RAG chatbot capabilities, development workflow, and governance. The constitution establishes version 1.0.0 with ratification date of 2025-12-16.

## Outcome

- ✅ Impact: Created foundational governance document establishing project principles
- 🧪 Tests: none
- 📁 Files: Updated .specify/memory/constitution.md with comprehensive principles
- 🔁 Next prompts: Plan and implement initial book structure and RAG chatbot components
- 🧠 Reflection: The constitution successfully captures all specified requirements and provides clear guidance for the project

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): not applicable
- Prompt variant (if applicable): not applicable
- Next experiment (smallest change to try): Begin implementing the book structure based on the constitution