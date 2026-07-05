# app/modules/agents/tests/test_memory_engine.py

import time
from unittest.mock import patch
import pytest

from app.modules.agents.workflow.memory.memory_store import MemoryStore
from app.modules.agents.workflow.memory.session_memory import SessionMemory
from app.modules.agents.workflow.memory.conversation_memory import ConversationMemory, ChatMessage
from app.modules.agents.workflow.memory.context_memory import ContextMemory
from app.modules.agents.workflow.memory.memory_manager import MemoryManager


def test_memory_store_basic_operations():
    store = MemoryStore()
    session_id = "test_sess_1"
    
    # Set and get
    store.set(session_id, "test_ns", "key1", "val1")
    assert store.get(session_id, "test_ns", "key1") == "val1"
    
    # Delete
    store.delete(session_id, "test_ns", "key1")
    assert store.get(session_id, "test_ns", "key1") is None


def test_memory_store_ttl_expiration():
    store = MemoryStore()
    session_id = "test_sess_2"
    
    # Set with 1 second TTL
    store.set(session_id, "test_ns", "ttl_key", "ttl_val", ttl=1)
    assert store.get(session_id, "test_ns", "ttl_key") == "ttl_val"
    
    # Mock future time to check expiration
    with patch("time.time", return_value=time.time() + 5):
        assert store.get(session_id, "test_ns", "ttl_key") is None


def test_session_memory():
    store = MemoryStore()
    session_mem = SessionMemory(store)
    session_id = "sess_123"
    
    session_mem.set_var(session_id, "role", "developer")
    assert session_mem.get_var(session_id, "role") == "developer"
    
    all_vars = session_mem.get_all(session_id)
    assert all_vars == {"role": "developer"}
    
    session_mem.clear(session_id)
    assert session_mem.get_var(session_id, "role") is None


def test_conversation_memory():
    store = MemoryStore()
    conv_mem = ConversationMemory(store)
    session_id = "sess_456"
    conv_id = "conv_789"
    
    conv_mem.add_message(session_id, conv_id, "user", "Hello agent")
    conv_mem.add_message(session_id, conv_id, "assistant", "Hello user")
    
    messages = conv_mem.get_messages(session_id, conv_id)
    assert len(messages) == 2
    assert messages[0].role == "user"
    assert messages[0].content == "Hello agent"
    assert messages[1].role == "assistant"
    assert messages[1].content == "Hello user"
    
    all_convs = conv_mem.get_all_conversations(session_id)
    assert conv_id in all_convs
    assert len(all_convs[conv_id]) == 2
    
    conv_mem.clear_conversation(session_id, conv_id)
    assert len(conv_mem.get_messages(session_id, conv_id)) == 0


def test_context_memory_merge():
    store = MemoryStore()
    ctx_mem = ContextMemory(store)
    session_id = "sess_789"
    
    ctx_mem.set_context_var(session_id, "resume_score", 85)
    ctx_mem.merge_context(session_id, {"jd_match": 90, "skills": ["Python", "FastAPI"]})
    
    ctx = ctx_mem.get_context(session_id)
    assert ctx["resume_score"] == 85
    assert ctx["jd_match"] == 90
    assert ctx["skills"] == ["Python", "FastAPI"]


def test_memory_manager_orchestration():
    manager = MemoryManager()
    session_id = "sess_mgr_1"
    
    manager.set_session_var(session_id, "user_name", "Alice")
    manager.add_conversation_message(session_id, "c1", "user", "Hi")
    manager.set_agent_var(session_id, "ats_agent", "ats_graded", True)
    manager.set_workflow_var(session_id, "wf1", "step_status", "success")
    manager.merge_context(session_id, {"shared_var": "val"})
    
    # Assert namespaces segregation
    assert manager.get_session_var(session_id, "user_name") == "Alice"
    assert len(manager.get_conversation_history(session_id, "c1")) == 1
    assert manager.get_agent_var(session_id, "ats_agent", "ats_graded") is True
    assert manager.get_workflow_var(session_id, "wf1", "step_status") == "success"
    assert manager.get_context_var(session_id, "shared_var") == "val"
    
    # Clear session
    manager.clear_session(session_id)
    assert manager.get_session_var(session_id, "user_name") is None
    assert len(manager.get_conversation_history(session_id, "c1")) == 0
