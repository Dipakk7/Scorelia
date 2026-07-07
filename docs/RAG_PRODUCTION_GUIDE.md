# Scorelia — RAG Production Guide

This guide is designed for developers and system operators to configure, tune, troubleshoot, and monitor the Retrieval-Augmented Generation (RAG) system in production environments.

---

## 1. Deployment Checklist

Before deploying the RAG system to production, ensure that:
1. **Ollama Instance**: The local Ollama server is running and accessible (default `http://localhost:11434`).
2. **Model Availability**: The embedding model `nomic-embed-text` and the LLM generation model (e.g., `qwen2.5:3b`) are fully pulled and loaded in Ollama.
3. **Persistent ChromaDB Directory**: Storage directory `storage/chromadb` has proper write permissions.
4. **Environment Variables**: Production environment settings are defined inside `.env` or injected in the container environment.
5. **Strict Production Mode**: Set `RAG_STRICT_PRODUCTION_MODE=true` to enforce failfast exception behavior for configuration errors.

---

## 2. Production Configuration Settings

Adjust the following values in your production `.env` files:

```ini
# Environment type
ENVIRONMENT=production

# Caching & Optimization Settings
RAG_CACHE_TTL=300
RAG_CACHE_SIZE=1000

# Pipeline Limits & Timeouts
RAG_MAX_RETRIEVAL_TIME=10.0
RAG_MAX_GENERATION_TIME=30.0

# Citation Format
# Choices: standard | apa | ieee | inline | none
RAG_CITATION_MODE=standard

# Monitoring Flags
RAG_METRICS_ENABLED=true
RAG_OBSERVABILITY_ENABLED=true
RAG_HEALTH_MONITORING=true
RAG_STRICT_PRODUCTION_MODE=true
```

---

## 3. Performance Tuning

### 3.1. Adaptive Context Budgets
If you hit hardware memory bottlenecks during generation:
- Reduce `RAG_MAX_CONTEXT_TOKENS` from `4096` to `2048`.
- Limit the retrieved chunks via `RAG_TOP_K` to reduce context noise.

### 3.2. Caching Tuning
For high-traffic systems, increase cache longevity to reduce database CPU loads:
- Elevate `RAG_CACHE_TTL` to `600` (10 minutes) or `1800` (30 minutes).
- Make sure memory capacity `RAG_CACHE_SIZE` accommodates your user base size.

### 3.3. Concurrent Vectors Indexing
- Set `RAG_ASYNC_WORKERS` to match CPU thread counts (`4` or `8`) to speed up bulk indexing.
- Use `RAG_BATCH_SIZE=32` or `64` to maximize Ollama embedding speed.

---

## 4. Monitoring & Metrics

Operational teams should poll the `/api/v1/rag/metrics` endpoint regularly and alert on the following thresholds:
1. **Error Rate (`error_rate`)**: Trigger alerts if `error_rate > 0.05` (5% failed queries).
2. **End-to-End Latency (`average_total_latency_ms`)**: Trigger warnings if latency exceeds `2000`ms, indicating Ollama bottlenecks.
3. **Cache Hit Ratio (`cache_hit_ratio`)**: A value `< 0.20` suggests cache TTL or keys need adjustment.

---

## 5. Troubleshooting Guide

### 5.1. Circular Import Errors
- **Symptom**: `ImportError: cannot import name 'ResponseCacheService' from partially initialized module`.
- **Solution**: Always import generation schemas inside `if TYPE_CHECKING:` in service layers and use `from __future__ import annotations` at the top of python files.

### 5.2. Ollama Connection Failures
- **Symptom**: `OllamaUnavailableError` or connection refused on port `11434`.
- **Solution**: Check if the Ollama service is running (`systemctl status ollama` or through the desktop app). Verify the value of `OLLAMA_HOST` matches the current binding.

### 5.3. Empty Context Failures
- **Symptom**: `EmptyContextError: No relevant context found in the knowledge base`.
- **Solution**: If strict mode is on, queries failing to match documents will trigger an error. Check document registry status or lower `RAG_SIMILARITY_THRESHOLD`.

---

## 6. Best Practices

- **Never log prompt inputs or LLM response texts**: Compliance protocols prohibit logging resume contexts, credentials, or client questions.
- **Isolate collections**: Maintain separate vector collections for resume storage, job descriptions, and course contents to prevent cross-contamination.
- **Regularly clear caches**: During system upgrades or prompt updates, trigger `DELETE /api/v1/rag/cache` to prevent stale response delivery.
