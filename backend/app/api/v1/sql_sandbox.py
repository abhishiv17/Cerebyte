from fastapi import APIRouter, Depends
from app.schemas.sql_sandbox import SQLExecuteRequest, SQLExecuteResponse
from app.core.security import get_current_user
from app.services import sql_sandbox_service

router = APIRouter()

@router.post("/execute", response_model=SQLExecuteResponse)
async def execute_sql(request: SQLExecuteRequest, current_user: dict = Depends(get_current_user)):
    """Execute SQL queries using the SQL sandbox service."""
    return sql_sandbox_service.execute_sql(request)
