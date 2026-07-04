# app/modules/rag/generation/generator.py

import time
from typing import Optional, Dict, Any
import structlog
from app.modules.rag.config import RAGConfig
from app.ai.services.ai_service import AIService
from app.ai.schemas.ai import AIRequest, AIResponse
from app.ai.exceptions import (
    AIProviderUnavailable,
    AIRequestTimeout,
    ModelNotFound,
    AIError
)
from app.modules.rag.exceptions import OllamaUnavailableError

logger = structlog.get_logger()


class RAGGenerator:
    """Invokes Ollama model execution through existing AI Service abstractions, capturing timing and token metrics."""

    def __init__(self, ai_service: AIService, config: RAGConfig):
        self.ai_service = ai_service
        self.config = config

    async def generate_response(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        temperature: Optional[float] = None,
        top_p: Optional[float] = None,
        max_output_tokens: Optional[int] = None
    ) -> AIResponse:
        """Submits the built prompt and system instructions to the configured Ollama LLM provider.

        Args:
            prompt: Rendered prompt body.
            system_prompt: Optional system prompt instructions.
            temperature: Sampling temperature override.
            top_p: Nucleus sampling override.
            max_output_tokens: Max output token limit override.

        Returns:
            AIResponse: Containing response text, usage data, and details.

        Raises:
            OllamaUnavailableError: If Ollama client cannot reach the local server or times out.
        """
        temp = temperature if temperature is not None else getattr(self.config, "temperature", 0.3)
        tp = top_p if top_p is not None else getattr(self.config, "top_p", 0.9)
        max_tokens = max_output_tokens if max_output_tokens is not None else getattr(self.config, "max_output_tokens", 1024)

        request_payload = AIRequest(
            prompt=prompt,
            system_prompt=system_prompt,
            temperature=temp,
            top_p=tp,
            max_tokens=max_tokens
        )

        logger.info(
            "submitting_rag_generation_query",
            model=getattr(self.ai_service.provider.client, "model", "unknown"),
            temperature=temp,
            top_p=tp,
            max_tokens=max_tokens
        )

        try:
            # Execute generation using active provider
            response = await self.ai_service.provider.generate(request_payload)
            return response
        except (AIProviderUnavailable, AIRequestTimeout, ModelNotFound, AIError) as err:
            logger.error("ollama_provider_execution_failed", error=str(err))
            raise OllamaUnavailableError(f"Ollama server error or unavailable: {str(err)}") from err
        except Exception as e:
            logger.error("unexpected_ollama_generation_error", error=str(e))
            raise OllamaUnavailableError(f"Unexpected error calling Ollama server: {str(e)}") from e
