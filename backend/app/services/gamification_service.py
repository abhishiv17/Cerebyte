from fastapi import HTTPException
from app.db.client import supabase
from app.schemas.gamification import XPAwardRequest, XPAwardResponse

# ──────────────────────────────────────────────────────────────
# XP Rewards Table
# ──────────────────────────────────────────────────────────────
XP_REWARDS = {
    "dsa_problem": 50,
    "dbms_quiz": 100,
    "sql_query": 25,
    "lesson_complete": 30,
}

# ──────────────────────────────────────────────────────────────
# Rank Thresholds — Naval Progression
# ──────────────────────────────────────────────────────────────
RANK_THRESHOLDS = [
    (0, "Ensign"),
    (501, "Lieutenant"),
    (1501, "Commander"),
    (3001, "Admiral of the Fleet"),
]


def _calculate_rank(xp: int) -> str:
    """Determine rank based on XP thresholds."""
    rank = "Ensign"
    for threshold, title in RANK_THRESHOLDS:
        if xp >= threshold:
            rank = title
    return rank


async def award_xp(request: XPAwardRequest, user_id: str) -> XPAwardResponse:
    """Award XP for task completion and auto-promote rank."""

    # 1. Get current user profile
    res = supabase.table("users").select("xp, rank").eq("id", user_id).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="User profile not found")

    current_xp = res.data[0].get("xp", 0) or 0
    current_rank = res.data[0].get("rank", "Ensign")

    # 2. Calculate XP gain
    xp_gained = XP_REWARDS.get(request.task_type, 0)
    if xp_gained == 0:
        raise HTTPException(
            status_code=400,
            detail=f"Unknown task type: {request.task_type}. Valid: {', '.join(XP_REWARDS.keys())}"
        )

    new_xp = current_xp + xp_gained

    # 3. Calculate new rank
    new_rank = _calculate_rank(new_xp)
    rank_changed = new_rank != current_rank

    # 4. Update database
    update_data = {"xp": new_xp, "rank": new_rank}
    update_res = supabase.table("users").update(update_data).eq("id", user_id).execute()

    if not update_res.data:
        raise HTTPException(status_code=500, detail="Failed to update XP")

    return XPAwardResponse(
        xp_gained=xp_gained,
        total_xp=new_xp,
        rank=new_rank,
        rank_changed=rank_changed,
        previous_rank=current_rank if rank_changed else None,
    )


async def get_leaderboard(limit: int = 10) -> list:
    """Fetch top users by XP for leaderboard."""
    res = supabase.table("users").select(
        "id, full_name, xp, rank, avatar_url"
    ).order("xp", desc=True).limit(limit).execute()

    return res.data or []
