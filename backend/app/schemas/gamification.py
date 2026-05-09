from pydantic import BaseModel
from typing import Optional, List


class XPAwardRequest(BaseModel):
    """Request to award XP for completing a task."""
    task_type: str  # "dsa_problem" | "dbms_quiz" | "sql_query" | "lesson_complete"
    task_id: Optional[str] = None


class XPAwardResponse(BaseModel):
    """Response after XP is awarded."""
    xp_gained: int
    total_xp: int
    rank: str
    rank_changed: bool
    previous_rank: Optional[str] = None


class ProfileSyncRequest(BaseModel):
    """Request to sync missing profile fields."""
    full_name: Optional[str] = None
    phone_no: Optional[str] = None
    college: Optional[str] = None
    year_of_study: Optional[int] = None
    usn: Optional[str] = None
    interests: Optional[List[str]] = None
    tutor_enabled: Optional[bool] = None

