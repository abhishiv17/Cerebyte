from fastapi import APIRouter, Depends, HTTPException
from app.schemas.execution import CodeExecutionRequest, CodeExecutionResponse
from app.core.security import get_current_user
from app.services import execution_service

router = APIRouter()

@router.post("/run", response_model=CodeExecutionResponse)
async def run_code(request: CodeExecutionRequest, current_user: dict = Depends(get_current_user)):
    """Execute code using the execution service."""
    return await execution_service.execute_code(request)
