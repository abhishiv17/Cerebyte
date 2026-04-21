from fastapi import APIRouter, Depends

from app.core.security import get_current_user

router = APIRouter()


@router.get("/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    """Returns the currently authenticated user's profile."""
    return {
        "id": current_user["id"],
        "email": current_user["email"],
        "created_at": current_user["created_at"],
        "display_name": current_user["user_metadata"].get("full_name", ""),
    }
