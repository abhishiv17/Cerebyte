from fastapi import Depends, HTTPException, status

from app.core.security import get_current_user
from app.db.client import supabase


async def require_admin(current_user: dict = Depends(get_current_user)) -> dict:
    """
    FastAPI dependency — ensures the authenticated user has admin privileges.
    Wraps get_current_user and additionally checks the is_admin flag in the DB.
    Returns 403 Forbidden if the user is not an admin.
    """
    user_id = current_user["id"]

    try:
        res = (
            supabase.table("users")
            .select("is_admin")
            .eq("id", user_id)
            .single()
            .execute()
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not verify admin status",
        )

    if not res.data or not res.data.get("is_admin"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required",
        )

    return current_user
