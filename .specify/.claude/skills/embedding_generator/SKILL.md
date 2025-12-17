---
name: "embedding_generator"
description: "Generate clean, high‑quality text embeddings for the Frontend book’s RAG system, including chapter content, user-selected text, personalized variants, and Urdu translations. Used when preparing text chunks for Qdrant."
version: "1.0.0"
---
# Embedding Generator Skill

## When to Use This Skill
Use this skill whenever the agent needs to:
- Chunk and embed book text for RAG
- Embed user-selected text only (per hackathon requirement)
- Re‑embed chapters after personalization
- Re‑embed chapters after Urdu translation
- Prepare clean input for Qdrant vectors
- Maintain consistent embedding metadata for Neon Postgres

## How This Skill Works
1. **Preprocessing**
   - Remove formatting noise (HTML/MDX artifacts)
   - Normalize whitespace and punctuation  
   - Preserve semantic meaning (no rewriting)

2. **Chunking**
   - Use 300–800 token chunks  
   - Overlap 10–15% for context continuity  
   - Attach metadata to each chunk:
     - `book_name: "frontend"`
     - `chapter`
     - `section`
     - `chunk_index`
     - `language` (en or ur)
     - `personalization_profile` (when used)

3. **Embedding**
   - Use OpenAI Embeddings API (OpenAI embeddings model specified by the Agent)
   - Return vector arrays ready to store in Qdrant

4. **Output Packaging**
   - Produce JSON‑ready objects that the Agent can insert into:
     - Neon Postgres (metadata + text)
     - Qdrant (vector + metadata ID)

## Output Format
Always return a structured object:

{
"text_chunks": [
{
"id": "frontend_ch3_001",
"clean_text": "...",
"metadata": {
"book": "frontend",
"chapter": "3",
"section": "Intro",
"lang": "en",
"personalized": false
}
}
],
"embeddings": [
{
"id": "frontend_ch3_001",
"vector": [0.012, 0.445, ...]
}
]
}


## Example
**Input:**  
“Generate embeddings for Chapter 2 introduction text for the Frontend book.”

**Output:**  
- `text_chunks`: 4–8 chunks of normalized text  
- `embeddings`: vector arrays for each chunk  
- Metadata prepared for Neon + Qdrant  

## Notes
- Never rewrite content; preserve author voice for factual accuracy  
- Maintain stable chunk IDs to avoid Qdrant duplication  
- Designed for integration with Agent workflows and Claude code execution  
