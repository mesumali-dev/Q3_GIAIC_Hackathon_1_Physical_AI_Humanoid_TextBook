Project: Physical AI & Humanoid Robotics Textbook

Purpose:
Create a complete, AI-native textbook that teaches Physical AI, humanoid robotics, embodied intelligence, and simulation-based robotics using ROS 2, Gazebo, Unity, NVIDIA Isaac, and VLA. The constitution defines the rules, standards, and boundaries for producing the book through specification-driven development.

Core Principles:
- Accuracy: All robotics, simulation, and AI concepts must be verified against official documentation or primary sources.
- Clarity: Content must be understandable for intermediate university students and beginner roboticists.
- Learnability: Each chapter must have learning objectives, outcomes, checkpoints, and practical exercises.
- Consistency: Follow a single writing voice, formatting style, and structure across the entire book.
- Modularity: Chapters must be independent but connect logically across the curriculum.
- AI-Nativity: Content must be optimized for Docusaurus, Claude Code, and RAG-based future learners.

Key Standards:
- Format: Markdown (MDX allowed for Docusaurus components).
- Structure: Chapters → Sections → Subsections → Exercises → Checkpoints.
- Book Metadata: Each file must include frontmatter for future RAG indexing.
- Visuals: Diagrams allowed (ASCII, Mermaid, or references to images).
- Technical Accuracy: ROS 2, Gazebo, Unity, and Isaac examples must follow official current versions.
- Teaching Style: Practical, hands-on, challenge-driven learning.

Constraints:
- Total chapters: 15–25.
- Word count per chapter: 1,000–3,000 words.
- Only use tools and concepts from the actual course modules.
- No invented hardware specs; must match real humanoid robotics principles.
- Do not include long mathematical derivations unless essential for understanding.
- Book must be fully buildable in Docusaurus and deployable to GitHub Pages.

Not Building:
- A full ROS 2 or Isaac SDK manual.
- A generic AI or robotics encyclopedia.
- Product/vendor comparisons.
- A hardware buying guide.
- A backend system for RAG (separate project).
- A course grading system or teaching plan.

Success Criteria:
- Complete 4-module coverage + Intro + Capstone + Appendix.
- All chapters follow the same structure and metadata scheme.
- Explanations are accurate, modern, and aligned with official documentation.
- Book compiles cleanly in Docusaurus without errors.
- Each chapter includes: examples, diagrams, checkpoints, and a small assignment.
- Readers can understand and build humanoid robotics simulations by the end.

Deliverables:
- Constitution (this file)
- Specification (sp.specify)
- Book master plan (sp.plan)
- Chapter outlines
- Markdown source files for all chapters
- Simulation labs and capstone instructions
- Final Docusaurus-ready book repo