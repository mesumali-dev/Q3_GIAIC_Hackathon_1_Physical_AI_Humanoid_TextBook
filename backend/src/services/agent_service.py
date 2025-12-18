"""
Agent service for the RAG Agent system.

This module provides functionality to interact with OpenAI's Agent system
to generate responses based on retrieved context.
"""

import logging
import os
import asyncio
import concurrent.futures
from typing import List
import os
from dotenv import load_dotenv, find_dotenv
from agents import Agent, Runner
load_dotenv(find_dotenv())

from src.config.settings import settings
from src.models.agent import RetrievedDocument, AgentResponse


class AgentService:
    """
    Service class for interacting with OpenAI's agent to generate responses based on context.
    """

    def __init__(self):
        """
        Initialize the agent service with OpenAI configuration.
        """
        self.logger = logging.getLogger(__name__)

        # 🔑 REQUIRED: Configure OpenAI
        if not settings.openai_api_key:
            raise RuntimeError("OPENAI_API_KEY is not set in environment or settings")

        # Agents SDK reads from env vars
        os.environ["OPENAI_API_KEY"] = settings.openai_api_key

        # 🤖 Create RAG Agent
        self.agent = Agent(
    name="RAG Agent",
    instructions=(
        "You are a friendly and polite assistant.\n\n"

        "If the user greets you (for example: hello, hi, salam), "
        "respond politely with a greeting, even if no context is provided.\n\n"

        "For informational or knowledge-based questions, "
        "you MUST answer using ONLY the provided context from the book.\n\n"

        "You may summarize or rephrase information that is clearly present in the context.\n\n"

        "If the question is NOT a greeting and the context does not contain enough information, "
        "respond exactly with:\n"
        "'The information requested is not found in the book.'\n\n"

        "Do NOT introduce information that is not supported by the book context."
    ),
    model="gpt-4o-mini"
)



    def generate_response(
        self,
        question: str,
        retrieved_docs: List[RetrievedDocument]
    ) -> AgentResponse:
        """
        Generate a response to the user's question based on the retrieved documents.
        """

        self.logger.info(
            f"Starting agent processing for question: {question[:60]}..."
        )

        # No documents → early exit
        if not retrieved_docs:
            return AgentResponse(
                answer="The information requested is not found in the book.",
                sources=[],
                retrieval_metadata={
                    "retrieved_count": 0,
                    "reason": "no_relevant_content"
                }
            )

        # Build context
        context_text = "\n\n".join(
            f"[Source {i+1}]\n{doc.content}"
            for i, doc in enumerate(retrieved_docs)
        )

        full_query = f"""
Context:
{context_text}

Question:
{question}

Answer strictly using the context above.
"""

        try:
            self.logger.debug("Sending request to OpenAI Agents API")

            # FastAPI-safe execution
            try:
                asyncio.get_running_loop()

                def run_agent():
                    return Runner.run_sync(self.agent, full_query)

                with concurrent.futures.ThreadPoolExecutor(max_workers=1) as executor:
                    future = executor.submit(run_agent)
                    result = future.result()

            except RuntimeError:
                # No event loop running
                result = Runner.run_sync(self.agent, full_query)

            # Extract result
            answer = result.final_output.strip()

            self.logger.info("Agent response generated successfully")

            return AgentResponse(
                answer=answer,
                sources=retrieved_docs,
                retrieval_metadata={
                    "retrieved_count": len(retrieved_docs),
                    "model_used": "gpt-4o-mini",
                    "reasoning_completed": True
                }
            )

        except Exception as e:
            self.logger.exception("Agent processing failed")

            return AgentResponse(
                answer="Error generating response from the agent.",
                sources=retrieved_docs,
                retrieval_metadata={
                    "retrieved_count": len(retrieved_docs),
                    "error": str(e),
                    "reasoning_completed": False
                }
            )
