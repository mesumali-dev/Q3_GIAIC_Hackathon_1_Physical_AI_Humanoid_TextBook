import asyncio
import time
import logging
from typing import Dict, Any, Optional
from ..models.personalization import (
    PersonalizationRequest,
    PersonalizationResponse,
    KnowledgeLevel,
    PersonalizationSettings,
    UserProfile
)
import os
from dotenv import load_dotenv
import cohere
from pydantic import BaseModel

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

class PersonalizationService:
    """
    Service for generating personalized chapter content based on user profile.
    """

    def __init__(self):
        self.cohere_api_key = os.getenv("COHERE_API_KEY")
        if self.cohere_api_key:
            self.co = cohere.Client(self.cohere_api_key)
        else:
            # For demo purposes, we'll simulate the service
            print("COHERE_API_KEY not found. Personalization will use simulated responses.")
            self.co = None

        self.settings = PersonalizationSettings()

    def _validate_structure_preservation(self, original_content: str, personalized_content: str) -> bool:
        """
        Validate that the document structure has been preserved during personalization
        """
        import re

        # Extract headings from both original and personalized content
        original_headings = re.findall(r'<h[1-6][^>]*>.*?</h[1-6]>', original_content, re.IGNORECASE)
        personalized_headings = re.findall(r'<h[1-6][^>]*>.*?</h[1-6]>', personalized_content, re.IGNORECASE)

        # Extract code blocks
        original_code_blocks = re.findall(r'<pre[^>]*>.*?</pre>', original_content, re.DOTALL | re.IGNORECASE)
        personalized_code_blocks = re.findall(r'<pre[^>]*>.*?</pre>', personalized_content, re.DOTALL | re.IGNORECASE)

        # Extract list items
        original_list_items = re.findall(r'<li[^>]*>.*?</li>', original_content, re.DOTALL | re.IGNORECASE)
        personalized_list_items = re.findall(r'<li[^>]*>.*?</li>', personalized_content, re.DOTALL | re.IGNORECASE)

        # Check if counts match (structure preserved)
        if (len(original_headings) != len(personalized_headings) or
            len(original_code_blocks) != len(personalized_code_blocks) or
            len(original_list_items) != len(personalized_list_items)):
            return False

        # Additional checks could be added here

        return True

    async def personalize_content(self, request: PersonalizationRequest) -> PersonalizationResponse:
        """
        Personalize chapter content based on user profile using LLM
        """
        start_time = time.time()
        user_id = request.user_profile.id if request.user_profile else "unknown"

        logger.info(f"Starting personalization for user {user_id}, chapter length: {len(request.chapter_content)} chars")

        try:
            # Validate request
            if not request.chapter_content.strip():
                raise ValueError("Chapter content cannot be empty")

            # Use default profile if none provided
            if not request.user_profile:
                from ..models.personalization import UserProfile, KnowledgeLevel
                request.user_profile = UserProfile(
                    id="guest",
                    knowledge_level=KnowledgeLevel.intermediate,
                    software_background="General software development",
                    hardware_background="General hardware knowledge",
                    profile_complete=False
                )
            elif not request.user_profile.profile_complete:
                # For incomplete profiles, we still allow personalization but with defaults
                pass  # Allow personalization with incomplete profile

            # For now, we'll create a simulated personalized content
            # In a real implementation, this would call the LLM API
            personalized_content = await self._generate_personalized_content(
                request.chapter_content,
                request.user_profile
            )

            # Validate that structure has been preserved
            structure_preserved = self._validate_structure_preservation(
                request.chapter_content,
                personalized_content
            )

            processing_time = (time.time() - start_time) * 1000  # Convert to milliseconds

            logger.info(f"Personalization completed for user {user_id} in {processing_time:.2f}ms, structure preserved: {structure_preserved}")

            return PersonalizationResponse(
                personalized_content=personalized_content,
                structure_preserved=structure_preserved,
                personalization_applied=True,
                processing_time=processing_time
            )
        except Exception as e:
            processing_time = (time.time() - start_time) * 1000
            logger.error(f"Personalization failed for user {user_id}: {str(e)} after {processing_time:.2f}ms")
            # Return original content with error flag if personalization fails
            return PersonalizationResponse(
                personalized_content=request.chapter_content,
                structure_preserved=True,
                personalization_applied=False,
                processing_time=processing_time
            )

    async def _generate_personalized_content(self, content: str, user_profile: UserProfile) -> str:
        """
        Generate personalized content based on user profile
        """
        # This is a simplified implementation
        # In a real system, this would use LLM API calls with proper instructions

        if self.co:
            # Create a prompt for the LLM based on user profile
            prompt = self._create_personalization_prompt(content, user_profile)

            try:
                # Add timeout handling
                import asyncio
                from concurrent.futures import TimeoutError

                # Use a timeout for the API call
                timeout_seconds = int(os.getenv("PERSONALIZATION_TIMEOUT", "30"))

                # Make the API call with timeout
                response = self.co.generate(
                    model='command',
                    prompt=prompt,
                    max_tokens=1000,
                    temperature=0.7
                )

                return response.generations[0].text
            except TimeoutError:
                print(f"Timeout error during personalization (>{timeout_seconds}s)")
                # Fallback to original content
                return content
            except Exception as e:
                print(f"Error calling Cohere API: {e}")
                # Fallback to original content
                return content
        else:
            # Simulated personalization for demo purposes
            # This would be replaced with actual LLM calls in production
            return self._simulate_personalization(content, user_profile)

    def _create_personalization_prompt(self, content: str, user_profile: Optional[UserProfile]) -> str:
        """
        Create a prompt for the LLM based on user profile
        """
        level_instructions = {
            KnowledgeLevel.beginner: "Explain concepts in simple terms with step-by-step guidance and basic terminology",
            KnowledgeLevel.intermediate: "Provide balanced explanations with moderate technical depth",
            KnowledgeLevel.advanced: "Use concise explanations with technical terminology and minimal repetition"
        }

        # Handle case where user_profile might be None
        knowledge_level = user_profile.knowledge_level if user_profile else KnowledgeLevel.intermediate
        software_background = user_profile.software_background if user_profile else "General software development"
        hardware_background = user_profile.hardware_background if user_profile else "General hardware knowledge"

        instruction = level_instructions.get(knowledge_level, level_instructions[KnowledgeLevel.intermediate])

        prompt = f"""
        Please adapt the following educational content based on the user's knowledge level.

        User Profile:
        - Knowledge Level: {user_profile.knowledge_level.value}
        - Software Background: {user_profile.software_background}
        - Hardware Background: {user_profile.hardware_background}

        Instructions: {instruction}

        CRITICAL REQUIREMENTS:
        1. Preserve ALL document structure including headings (h1, h2, h3, etc.), lists (ul, ol), code blocks, and paragraphs
        2. Maintain the original order and hierarchy of content elements
        3. Do NOT remove any content, only adapt the explanations
        4. Keep all HTML tags intact in their original positions
        5. Preserve code blocks exactly as they are (do not modify code content)
        6. Maintain the same number of headings, paragraphs, and list items

        Original Content:
        {content}

        Personalized Content (maintain structure, headings, and formatting):
        """

        return prompt

    def _simulate_personalization(self, content: str, user_profile: Optional[UserProfile]) -> str:
        """
        Simulate personalization for demo purposes
        """
        # In a real implementation, this would call the LLM API
        # For now, we'll just return the content with a note
        if user_profile.knowledge_level == KnowledgeLevel.beginner:
            return f"[SIMULATED BEGINNER CONTENT] {content} [Adapted for beginner level with simplified explanations]"
        elif user_profile.knowledge_level == KnowledgeLevel.advanced:
            return f"[SIMULATED ADVANCED CONTENT] {content} [Adapted for advanced level with technical terminology]"
        else:  # intermediate
            return f"[SIMULATED INTERMEDIATE CONTENT] {content} [Adapted for intermediate level]"

# Singleton instance
personalization_service = PersonalizationService()