from pydantic import BaseModel, ConfigDict
from typing import List, Dict, Any, Optional

class SQLExecuteRequest(BaseModel):
    query: str
    setup_sql: Optional[str] = None

class SQLExecuteResponse(BaseModel):
    columns: List[str]
    rows: List[Dict[str, Any]]
    execution_time_ms: float
    error: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
