"""
Tests for admin-only problem management.

These tests verify that:
- Unauthenticated users cannot create/update/delete problems
- Regular (non-admin) users cannot create/update/delete problems
- Anyone can list and view problems (public read access)

Tests use FastAPI's dependency override mechanism to mock authentication
without requiring a real Supabase connection.
"""

import pytest
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient
from fastapi import HTTPException, status

# We need to mock the supabase client BEFORE importing the app,
# because the app module imports supabase at module level.
import sys
from unittest.mock import MagicMock as _MagicMock

# Create a mock supabase module so imports don't fail
mock_supabase_client = _MagicMock()
mock_supabase_module = _MagicMock()
mock_supabase_module.create_client.return_value = mock_supabase_client

# Patch before any app imports
with patch.dict(sys.modules, {"supabase": mock_supabase_module}):
    # Also need to mock the settings so they don't fail on missing env vars
    with patch("app.core.config.Settings") as MockSettings:
        mock_settings = MockSettings.return_value
        mock_settings.supabase_url = "https://fake.supabase.co"
        mock_settings.supabase_anon_key = "fake-anon-key"
        mock_settings.supabase_service_role_key = "fake-service-role-key"
        mock_settings.groq_api_key = "fake-groq-key"
        mock_settings.judge0_api_key = ""
        mock_settings.app_env = "test"
        mock_settings.api_prefix = "/api/v1"

from app.core.security import get_current_user
from app.core.admin import require_admin
from main import app


# ─── Fake users ────────────────────────────────────────────────────────────────

FAKE_ADMIN = {
    "id": "admin-uuid-1234",
    "email": "admin@cerebyte.com",
    "created_at": "2026-01-01T00:00:00",
    "user_metadata": {"full_name": "Admin User"},
}

FAKE_REGULAR_USER = {
    "id": "user-uuid-5678",
    "email": "student@cerebyte.com",
    "created_at": "2026-01-01T00:00:00",
    "user_metadata": {"full_name": "Regular Student"},
}

SAMPLE_PROBLEM = {
    "title": "Test Problem",
    "description": "This is a test problem for unit tests.",
    "difficulty": "Easy",
    "topic": "Arrays",
    "time_limit_ms": 2000,
    "memory_limit_mb": 256,
    "test_cases": [{"input": "[1,2]", "output": "3"}],
    "tags": ["array", "test"],
}


# ─── Dependency overrides ──────────────────────────────────────────────────────

def override_get_current_user_as_regular():
    """Simulates a logged-in regular (non-admin) user."""
    return FAKE_REGULAR_USER


def override_get_current_user_as_admin():
    """Simulates a logged-in admin user."""
    return FAKE_ADMIN


def override_require_admin_reject():
    """Simulates require_admin rejecting a non-admin user."""
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Admin privileges required",
    )


def override_require_admin_allow():
    """Simulates require_admin allowing an admin user."""
    return FAKE_ADMIN


# ─── Test fixtures ─────────────────────────────────────────────────────────────

@pytest.fixture
def client_no_auth():
    """Client with no authentication — unauthenticated requests."""
    # Don't override anything; let the real bearer check fail
    app.dependency_overrides.clear()
    client = TestClient(app, raise_server_exceptions=False)
    yield client
    app.dependency_overrides.clear()


@pytest.fixture
def client_regular_user():
    """Client authenticated as a regular (non-admin) user."""
    app.dependency_overrides[get_current_user] = override_get_current_user_as_regular
    app.dependency_overrides[require_admin] = override_require_admin_reject
    client = TestClient(app, raise_server_exceptions=False)
    yield client
    app.dependency_overrides.clear()


@pytest.fixture
def client_admin_user():
    """Client authenticated as an admin user."""
    app.dependency_overrides[get_current_user] = override_get_current_user_as_admin
    app.dependency_overrides[require_admin] = override_require_admin_allow
    client = TestClient(app, raise_server_exceptions=False)
    yield client
    app.dependency_overrides.clear()


# ─── Test 1: Unauthenticated users cannot create problems ─────────────────────

def test_unauthenticated_user_cannot_create_problem(client_no_auth):
    """POST /api/v1/problems with no auth header should return 403."""
    response = client_no_auth.post("/api/v1/problems", json=SAMPLE_PROBLEM)
    assert response.status_code == 403, (
        f"Expected 403 for unauthenticated create, got {response.status_code}: {response.text}"
    )


# ─── Test 2: Regular users cannot create problems ─────────────────────────────

def test_regular_user_cannot_create_problem(client_regular_user):
    """POST /api/v1/problems with a non-admin JWT should return 403."""
    response = client_regular_user.post("/api/v1/problems", json=SAMPLE_PROBLEM)
    assert response.status_code == 403, (
        f"Expected 403 for non-admin create, got {response.status_code}: {response.text}"
    )
    assert "admin" in response.json()["detail"].lower()


# ─── Test 3: Regular users cannot update problems ─────────────────────────────

def test_regular_user_cannot_update_problem(client_regular_user):
    """PUT /api/v1/problems/{id} with a non-admin JWT should return 403."""
    response = client_regular_user.put(
        "/api/v1/problems/fake-problem-id",
        json={"title": "Hacked Title"},
    )
    assert response.status_code == 403, (
        f"Expected 403 for non-admin update, got {response.status_code}: {response.text}"
    )
    assert "admin" in response.json()["detail"].lower()


# ─── Test 4: Regular users cannot delete problems ─────────────────────────────

def test_regular_user_cannot_delete_problem(client_regular_user):
    """DELETE /api/v1/problems/{id} with a non-admin JWT should return 403."""
    response = client_regular_user.delete("/api/v1/problems/fake-problem-id")
    assert response.status_code == 403, (
        f"Expected 403 for non-admin delete, got {response.status_code}: {response.text}"
    )
    assert "admin" in response.json()["detail"].lower()


# ─── Test 5: Anyone can list problems ──────────────────────────────────────────

def test_anyone_can_list_problems(client_no_auth):
    """GET /api/v1/problems should return 200 with no auth required."""
    # Mock the supabase table query to return sample data
    mock_response = MagicMock()
    mock_response.data = [
        {
            "id": "problem-1",
            "title": "Two Sum",
            "description": "Find two numbers.",
            "difficulty": "Easy",
            "topic": "Arrays",
            "time_limit_ms": 2000,
            "memory_limit_mb": 256,
            "test_cases": [],
            "tags": [],
            "created_at": "2026-01-01T00:00:00+00:00",
        }
    ]

    with patch("app.api.v1.problems.supabase") as mock_sb:
        mock_sb.table.return_value.select.return_value.limit.return_value.execute.return_value = mock_response
        response = client_no_auth.get("/api/v1/problems")

    assert response.status_code == 200, (
        f"Expected 200 for public list, got {response.status_code}: {response.text}"
    )
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1


# ─── Test 6: Anyone can get a single problem ──────────────────────────────────

def test_anyone_can_get_single_problem(client_no_auth):
    """GET /api/v1/problems/{id} should return 200 with no auth required."""
    mock_response = MagicMock()
    mock_response.data = [
        {
            "id": "problem-1",
            "title": "Two Sum",
            "description": "Find two numbers.",
            "difficulty": "Easy",
            "topic": "Arrays",
            "time_limit_ms": 2000,
            "memory_limit_mb": 256,
            "test_cases": [],
            "tags": [],
            "created_at": "2026-01-01T00:00:00+00:00",
        }
    ]

    with patch("app.api.v1.problems.supabase") as mock_sb:
        mock_sb.table.return_value.select.return_value.eq.return_value.execute.return_value = mock_response
        response = client_no_auth.get("/api/v1/problems/problem-1")

    assert response.status_code == 200, (
        f"Expected 200 for public get, got {response.status_code}: {response.text}"
    )
    data = response.json()
    assert data["title"] == "Two Sum"
