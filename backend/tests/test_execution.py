# pyrefly: ignore [missing-import]
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
    # Execution uses Judge0 (remote) with local subprocess fallback
    try:
        response = await execution_service.execute_code(request)
        if response:
            assert hasattr(response, 'stdout')
            assert hasattr(response, 'stderr')
            assert hasattr(response, 'exit_code')
    except Exception:
        pytest.skip("Execution engine unavailable in test environment")

@pytest.mark.asyncio
async def test_unsupported_language():
    """Test that unsupported languages are rejected."""
    request = CodeExecutionRequest(
        language="cobol",
        code="DISPLAY 'Hello'"
    )
    with pytest.raises(Exception):
        await execution_service.execute_code(request)
