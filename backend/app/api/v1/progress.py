from fastapi import APIRouter, Depends
from app.db.client import supabase
from app.schemas.progress import ProgressCreate
from app.core.security import get_current_user

router = APIRouter()

@router.post("/complete")
async def mark_lesson_complete(progress: ProgressCreate, current_user: dict = Depends(get_current_user)):
    """Mark a lesson as completed for the current user."""
    data = progress.model_dump()
    data["user_id"] = current_user["id"]
    # Using upsert so multiple 'completes' don't error out due to unique constraint
    res = supabase.table("user_progress").upsert(data).execute()
    return {"status": "success", "data": res.data[0] if res.data else None}

@router.get("/")
async def get_my_progress(current_user: dict = Depends(get_current_user)):
    """Get all completed lessons for the current user."""
    res = supabase.table("user_progress").select("*").eq("user_id", current_user["id"]).execute()
    return res.data
