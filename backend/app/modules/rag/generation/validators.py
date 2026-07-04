# app/modules/rag/generation/validators.py

import re
from typing import List
from app.modules.rag.exceptions import HallucinationGuardError, ResponseValidationError


class RAGResponseValidator:
    """Validator for verifying generated RAG responses and preventing hallucinations."""

    def __init__(self, hallucination_guard: bool = True):
        self.hallucination_guard = hallucination_guard
        # Substrings indicating lack of answer/context
        self.not_found_phrases: List[str] = [
            "information not found",
            "not found in the context",
            "not found in the knowledge base",
            "no information",
            "not mentioned",
            "not available",
            "does not contain",
            "cannot answer",
            "unable to answer",
            "don't know",
            "dont know",
            "insufficient information",
            "not clear from the context",
            "no context provided"
        ]

    def validate(self, response_text: str, context_text: str, strict: bool = True) -> str:
        """Validates the generated response.

        Args:
            response_text: The output from the LLM.
            context_text: The context fed to the prompt.
            strict: If True, empty response or context mismatch raises an error or maps to standard fallback.

        Returns:
            The validated response text (potentially normalized).

        Raises:
            ResponseValidationError: For empty or invalid structures.
            HallucinationGuardError: For context-response discrepancies.
        """
        if not response_text or not response_text.strip():
            raise ResponseValidationError("LLM generated an empty response.")

        cleaned_res = response_text.strip()
        lower_res = cleaned_res.lower()

        # Check if the LLM output matches any of our negative/not-found phrases
        for phrase in self.not_found_phrases:
            if phrase in lower_res:
                return "Information not found in the knowledge base."

        # If hallucination guard is active, run checks that the LLM response is supported
        if self.hallucination_guard:
            # If the context is completely empty and strict is True, the answer must be "Information not found in the knowledge base."
            if not context_text or not context_text.strip():
                if strict:
                    if cleaned_res != "Information not found in the knowledge base.":
                        raise HallucinationGuardError("Response generated despite empty context in strict mode.")
                return cleaned_res

            # Verify that numeric details in response are present in context to prevent fake metrics/years
            numbers_in_res = re.findall(r'\b\d+\b', cleaned_res)
            # Filter out small integers like 0, 1, 2, 3, 4, 5 (common list counters)
            significant_numbers = [n for n in numbers_in_res if len(n) > 1 or int(n) > 5]
            if significant_numbers:
                context_lower = context_text.lower()
                for num in significant_numbers:
                    if num not in context_lower:
                        raise HallucinationGuardError(
                            f"Hallucination detected: Number '{num}' in response is not present in retrieved context."
                        )

        return cleaned_res
