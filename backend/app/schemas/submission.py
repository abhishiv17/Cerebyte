from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class SubmissionBase(BaseModel):
    problem_id: str
    language: str
    code: str

class SubmissionCreate(SubmissionBase):
    pass

class SubmissionResponse(SubmissionBase):
    id: str
    user_id: str
    status: str
    execution_time_ms: Optional[float] = None
    memory_used_mb: Optional[float] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
