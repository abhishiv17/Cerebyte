from fastapi import APIRouter, Depends
from app.schemas.onboarding import OnboardingDiagnostic, OnboardingResponse, OnboardingStatus
from app.core.security import get_current_user
from app.services import onboarding_service

router = APIRouter()


@router.get("/status", response_model=OnboardingStatus)
async def get_onboarding_status(current_user: dict = Depends(get_current_user)):
    """Check if the current user has completed onboarding."""
    return await onboarding_service.check_onboarding_status(current_user["id"])


@router.post("/complete", response_model=OnboardingResponse)
async def complete_onboarding(
    diagnostic: OnboardingDiagnostic,
    current_user: dict = Depends(get_current_user),
):
    """Submit diagnostic answers and generate the Admiral Hopper quest map."""
    return await onboarding_service.complete_onboarding(diagnostic, current_user["id"])
