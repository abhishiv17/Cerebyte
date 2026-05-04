from fastapi import APIRouter, Depends
from app.schemas.ai_tutor import TutorRequest, TutorResponse
from app.core.security import get_current_user
from app.services import ai_tutor_service

router = APIRouter()

@router.post("/feedback", response_model=TutorResponse)
async def get_tutor_feedback(request: TutorRequest, current_user: dict = Depends(get_current_user)):
    """Ask the AI tutor for help with code using the service."""
    return await ai_tutor_service.get_tutor_feedback(request, current_user["id"])
