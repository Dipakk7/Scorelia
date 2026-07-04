# app/modules/rag/generation/prompt_builder.py

from typing import List, Dict, Any, Optional
import structlog
from app.modules.rag.config import RAGConfig
from app.modules.rag.exceptions import InvalidTemplateError, TokenLimitExceededError
from app.modules.rag.generation.templates import PROMPT_TEMPLATES

logger = structlog.get_logger()


class PromptBuilder:
    """Builds prompt payloads by merging templates, history, and contexts, enforcing size limits."""

    def __init__(self, config: RAGConfig):
        self.config = config

    def build_prompt(
        self,
        context_text: str,
        question: str,
        template_name: Optional[str] = None,
        history: Optional[List[Dict[str, str]]] = None
    ) -> Dict[str, Any]:
        """Resolves prompt templates and compiles the prompt instructions and body.

        Args:
            context_text: The compiled context block.
            question: The user query.
            template_name: Logical template name (e.g. resume_qa).
            history: List of conversation history dicts with 'role' and 'content' keys.

        Returns:
            Dict containing:
                - "prompt": Rendered user prompt body string.
                - "system_prompt": Selected system instructions.
                - "template_name": Target template key resolved.

        Raises:
            InvalidTemplateError: If resolved template does not exist.
            TokenLimitExceededError: If the compiled prompt exceeds the configured size limit.
        """
        # Resolve prompt template key
        template_key = template_name or getattr(self.config, "default_prompt_template", "general")
        
        if template_key not in PROMPT_TEMPLATES:
            logger.error("invalid_prompt_template_key", template_key=template_key)
            raise InvalidTemplateError(f"Prompt template key '{template_key}' is not registered.")

        template = PROMPT_TEMPLATES[template_key]
        system_instruction = template["system_instruction"]
        user_template = template["user_template"]

        # Compile chat history block
        history_section = ""
        if history:
            history_lines = []
            for msg in history:
                role = msg.get("role", "user").capitalize()
                content = msg.get("content", "")
                history_lines.append(f"{role}: {content}")
            history_section = "Conversation Chat History:\n" + "\n".join(history_lines) + "\n\n"

        # Interpolate variables into prompt
        try:
            rendered_prompt = user_template.format(
                context=context_text,
                question=question,
                history_section=history_section
            )
        except KeyError as e:
            logger.error("failed_to_render_prompt_template", error=str(e))
            from app.modules.rag.exceptions import PromptGenerationError
            raise PromptGenerationError(f"Failed to interpolate variables into template: {str(e)}") from e

        # Validate total prompt length (size constraints)
        max_prompt_size = getattr(self.config, "max_prompt_size", 8192)
        # Using string length as size check proxy
        if len(rendered_prompt) > max_prompt_size:
            logger.error("compiled_prompt_exceeds_max_size", length=len(rendered_prompt), limit=max_prompt_size)
            raise TokenLimitExceededError(
                f"Compiled prompt size ({len(rendered_prompt)} chars) exceeds maximum configuration limit ({max_prompt_size} chars)."
            )

        return {
            "prompt": rendered_prompt,
            "system_prompt": system_instruction,
            "template_name": template_key
        }
