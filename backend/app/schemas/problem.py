from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime

class ProblemBase(BaseModel):
    title: str
    description: str
    difficulty: str
    topic: str
    time_limit_ms: int = 2000
    memory_limit_mb: int = 256
    test_cases: List[Dict[str, Any]] = []
    tags: List[str] = []

class ProblemCreate(ProblemBase):
    pass

class ProblemUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    difficulty: Optional[str] = None
    topic: Optional[str] = None
    time_limit_ms: Optional[int] = None
    memory_limit_mb: Optional[int] = None
    test_cases: Optional[List[Dict[str, Any]]] = None
    tags: Optional[List[str]] = None

class ProblemResponse(ProblemBase):
    id: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
