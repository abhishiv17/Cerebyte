from fastapi import APIRouter, Depends
from app.schemas.gamification import XPAwardRequest, XPAwardResponse, ProfileSyncRequest
from app.core.security import get_current_user
from app.services import gamification_service
from app.db.client import supabase

router = APIRouter()


@router.post("/award-xp", response_model=XPAwardResponse)
async def award_xp(request: XPAwardRequest, current_user: dict = Depends(get_current_user)):
    """Award XP for completing a task (DSA problem, DBMS quiz, etc.)."""
    return await gamification_service.award_xp(request, current_user["id"])


@router.get("/leaderboard")
async def get_leaderboard():
    """Get the top 10 users by XP."""
    return await gamification_service.get_leaderboard()


@router.get("/my-stats")
async def get_my_stats(current_user: dict = Depends(get_current_user)):
    """Get the current user's XP, rank, and profile completeness."""
    res = supabase.table("users").select(
        "id, full_name, email, xp, rank, phone_no, college, year_of_study, usn, interests, tutor_enabled"
    ).eq("id", current_user["id"]).execute()

    if not res.data:
        new_user = {
            "id": current_user["id"],
            "email": current_user.get("email"),
            "full_name": current_user.get("user_metadata", {}).get("full_name", ""),
            "xp": 0,
            "rank": "Ensign",
        }
        try:
            ins = supabase.table("users").insert(new_user).execute()
            if ins.data:
                profile = ins.data[0]
            else:
                return {"xp": 0, "rank": "Ensign", "profile_complete": False, "email": current_user.get("email")}
        except Exception:
            return {"xp": 0, "rank": "Ensign", "profile_complete": False, "email": current_user.get("email")}
    else:
        profile = res.data[0]

    # Check profile completeness
    required = ["phone_no", "college", "year_of_study", "usn"]
    profile["profile_complete"] = all(profile.get(f) for f in required)

    return profile


@router.put("/sync-profile")
async def sync_profile(data: ProfileSyncRequest, current_user: dict = Depends(get_current_user)):
    """Update missing profile fields (college, USN, interests, etc.)."""
    update = data.model_dump(exclude_unset=True)
    if not update:
        return {"message": "No fields to update"}

    update["id"] = current_user["id"]
    if "email" not in update and current_user.get("email"):
        update["email"] = current_user["email"]

    res = supabase.table("users").update(update).eq("id", current_user["id"]).execute()
    if not res.data:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail="Failed to update profile")

    return res.data[0]
