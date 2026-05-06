from fastapi import APIRouter, Depends, HTTPException
from app.core.security import get_current_user
from app.services import user_service

router = APIRouter()

@router.get("/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    """Returns the currently authenticated user's profile from the DB."""
    profile = await user_service.get_user_profile(current_user["id"])
    if not profile:
        # Fallback to JWT data if profile not in DB yet (trigger might be pending)
        return {
            "id": current_user["id"],
            "email": current_user["email"],
            "full_name": current_user["user_metadata"].get("full_name", ""),
        }
    return profile

@router.put("/me")
async def update_me(data: dict, current_user: dict = Depends(get_current_user)):
    """Update the current user's profile."""
    profile = await user_service.update_user_profile(current_user["id"], data)
    if not profile:
        raise HTTPException(status_code=404, detail="User profile not found")
    return profile
