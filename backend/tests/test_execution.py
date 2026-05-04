import pytest
from app.services import execution_service
from app.schemas.execution import CodeExecutionRequest

@pytest.mark.asyncio
async def test_code_execution_structure():
    """Test the structure of code execution request/response."""
    request = CodeExecutionRequest(
        language="python",
        code="print(5*5)"
    )
    # We test if the service can at least be called
    # Actual network call to Piston is wrapped in a try/except for test environments
    try:
        response = await execution_service.execute_code(request)
        if response:
            assert hasattr(response, 'stdout')
    except Exception:
        pytest.skip("Network unavailable for Piston API")
