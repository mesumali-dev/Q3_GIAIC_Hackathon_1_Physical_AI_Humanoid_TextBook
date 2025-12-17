---
name: "better_auth"
description: "Manages user signup, signin, and background‑profile collection using BetterAuth.com. Provides user background data for personalization, Urdu translation, and chapter-level customization workflows."
version: "1.0.0"
---
# BetterAuth Skill

## When to Use This Skill
Use this skill whenever the agent needs to:
- Register a new user through BetterAuth
- Log in an existing user
- Collect software/hardware background during signup
- Retrieve user profile for personalization
- Validate access before personalizing chapters or generating Urdu translations
- Sync user data between BetterAuth → Neon Postgres

## How This Skill Works
1. **Signup Flow (Hackathon Requirement)**
   - Ask the user onboarding questions:
     - Software background  
     - Hardware background  
     - Preferred learning style  
     - Experience level (beginner / intermediate / advanced)
   - Send collected data to BetterAuth Signup API
   - Store user profile in Neon Postgres:
     - `user_id`
     - `software_background`
     - `hardware_background`
     - `preferred_learning_style`
     - `experience_level`

2. **Signin Flow**
   - Validate user credentials via BetterAuth
   - Return user session token
   - Fetch stored profile from Neon
   - Make profile available to personalization and RAG pipelines

3. **Profile Retrieval**
   - Return structured profile object:
     ```
     {
       "user_id": "...",
       "software_background": "...",
       "hardware_background": "...",
       "learning_style": "...",
       "experience_level": "...",
       "personalization_ready": true
     }
     ```

4. **Integration With Other Skills**
   - **embedding_generator**: Re‑embed personalized chapters
   - **chapter_personalizer**: Use user background to shape examples
   - **urdu_translator**: Enable Urdu translation button only when user is authenticated
   - **rag_router**: Improve context answers using profile

---

## Output Format

Always return one of these:

### **Signup Output**

{
"action": "signup_success",
"user_id": "...",
"profile": {
"software_background": "...",
"hardware_background": "...",
"learning_style": "...",
"experience_level": "..."
}
}


### **Signin Output**
{
"action": "signin_success",
"user_id": "...",
"session_token": "...",
"profile": { ... }
}


### **Profile Output**
{
"action": "profile_loaded",
"profile": { ... }
}


---

## Example

**Input:**  
“Sign up the user and collect their hardware/software background.”

**Output:**  
- Enrollment through BetterAuth  
- Metadata saved to Neon  
- Profile returned  
- Personalization enabled  

---

## Notes
- All auth operations must use BetterAuth SDK or API as per docs.
- Store no passwords; use token/session only.
- Do not embed private data in Qdrant (privacy).
- Required for earning **50 bonus points** in the hackathon.
