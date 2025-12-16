<!-- SYNC IMPACT REPORT:
Version change: N/A -> 1.0.0
Modified principles: None (new constitution)
Added sections: All sections added
Removed sections: None
Templates requiring updates: ✅ updated / ⚠ pending
- .specify/templates/plan-template.md: ⚠ pending
- .specify/templates/spec-template.md: ⚠ pending
- .specify/templates/tasks-template.md: ⚠ pending
Follow-up TODOs: None
-->
# AI/Spec-Driven Book with Integrated RAG Chatbot Constitution

## Core Principles

### Specification-Driven Development
All development begins with a formal specification using Spec-Kit Plus. Every feature, component, and architectural decision must be documented in spec files before implementation. No code is written without an accompanying specification that defines scope, requirements, acceptance criteria, and validation methods.

### Technical Accuracy and Validation
All technical explanations must be validated against official documentation (Docusaurus, OpenAI Agents/ChatKit SDK, FastAPI, Qdrant, Neon Postgres, GitHub Pages). Code samples must be runnable, tested, and version-compatible. All architectural explanations must include diagrams, workflows, and reasoning to ensure educational value.

### Accessibility and Clarity
All content must be written in a clear, accessible manner suitable for developers and students. Writing tone should be simple, teacher-like, and technically precise. Code examples and diagrams must be comprehensible to readers with varying skill levels.

### Maintainability and Consistency
Maintainability of code examples, architecture diagrams, and configuration files is paramount. Consistency across chapters, components, and generated assets must be preserved. All features, components, and chapters must follow the same structural patterns and quality standards.

### Reproducible Builds
All builds must be reproducible using Claude Code and Docusaurus workflows. GitHub Pages deployment instructions must be accurate and reproducible. Every configuration file, build script, and deployment instruction must be version-controlled and verified.

### RAG System Excellence
The integrated RAG chatbot must meet high standards: retrieval pipeline fully documented, chunking strategy described and configurable, Qdrant schema validated and version-controlled, FastAPI implementation following best practices, model responses citing retrieved text, and UI/UX embedded directly in the Docusaurus UI.

## Additional Requirements

### Book Structure and Content
- Written using Docusaurus with consistent chapter structure across the entire book
- Automatically buildable/deployable to GitHub Pages
- Includes step-by-step tutorials, code samples, and diagrams
- All diagrams generated using Claude Code or external plugins
- No broken links, code errors, or missing configuration files

### RAG Chatbot Capabilities
- Uses OpenAI Agents/ChatKit SDK
- Uses FastAPI backend
- Uses Qdrant (Free Tier) vector database
- Uses Neon Serverless Postgres
- Can answer questions about book content
- Can answer questions based only on selected text by the user

### Deployment and Automation
- Deployment is mandatory and must be automated
- All components (specs, skills, pages, backend, chatbot) are unified and consistent
- The project demonstrates complete Spec-Driven Development workflow
- All instructions can be followed by students with minimal friction

## Development Workflow

### Specification Process
- All features must begin with a spec.md file created via Spec-Kit Plus
- Specifications must include clear acceptance criteria and validation methods
- Architectural decisions must be documented in plan.md files
- Implementation tasks must be broken down in tasks.md files with testable steps

### Quality Assurance
- All technical content must be validated against official documentation
- Code samples must be tested and runnable
- Architecture explanations must include reasoning and alternatives considered
- Writing must follow consistent style and tone guidelines

### Review and Compliance
- All pull requests must verify compliance with constitutional principles
- Changes to architecture or core functionality require explicit approval
- Documentation updates must maintain consistency with existing materials
- Deployment configurations must be validated before merging

## Governance

This constitution supersedes all other development practices and must be followed for all project activities. Amendments to this constitution require formal documentation, team approval, and migration planning for existing code. All contributors must acknowledge and follow these principles. The constitution serves as the ultimate authority for resolving disputes about development practices, architectural decisions, and quality standards.

**Version**: 1.0.0 | **Ratified**: 2025-12-16 | **Last Amended**: 2025-12-16