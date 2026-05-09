from pydantic import BaseModel, Field
from typing import Optional, List


class OnboardingDiagnostic(BaseModel):
    """Payload from the frontend diagnostic questionnaire."""
    experience_level: str = Field(..., pattern="^(beginner|intermediate|advanced)$")
    primary_language: str = Field(..., pattern="^(python|javascript|cpp|java)$")
    career_goal: str = Field(..., pattern="^(university|faang|competitive|general)$")
    focus_areas: List[str] = Field(default=["dsa"])
    weekly_hours: int = Field(default=5, ge=1, le=40)


class OnboardingResponse(BaseModel):
    """Response returned after onboarding is completed."""
    naval_rank: str
    quest_map_narrative: str
    onboarding_completed: bool


class OnboardingStatus(BaseModel):
    """Quick status check — has the user completed onboarding?"""
    onboarding_completed: bool
    naval_rank: Optional[str] = None
    experience_level: Optional[str] = None
    career_goal: Optional[str] = None
