import pytest
from unittest.mock import patch, MagicMock
from app.services import ai_tutor_service
from app.schemas.ai_tutor import TutorRequest
from fastapi import HTTPException

@pytest.mark.asyncio
async def test_ai_tutor_feedback_config_error():
    """Test AI tutor feedback raises error when GROQ key is missing."""
    # We mock the supabase call so it doesn't try to validate the UUID format against the live DB
    with patch("app.db.client.supabase.table") as mock_table:
        mock_table.return_value.select.return_value.eq.return_value.execute.return_value.data = [{"id": "some-uuid", "title": "Test"}]
        
        with patch("app.core.config.settings.groq_api_key", ""):
            request = TutorRequest(
                problem_id="00000000-0000-0000-0000-000000000000",
                user_code="print('hello')",
                language="python",
                user_query="How to optimize?"
            )
            
            with pytest.raises(HTTPException) as excinfo:
                await ai_tutor_service.get_tutor_feedback(request, "user-123")
            
            assert excinfo.value.status_code == 500
            assert "GROQ_API_KEY" in excinfo.value.detail
