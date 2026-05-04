from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional

from app.db.client import supabase
from app.schemas.submission import SubmissionCreate, SubmissionResponse
from app.core.security import get_current_user
from app.services import submission_service

router = APIRouter()

@router.post("/", response_model=SubmissionResponse)
async def create_submission(submission: SubmissionCreate, current_user: dict = Depends(get_current_user)):
    """Submit code for a problem, execute it, and return the result."""
    return await submission_service.create_submission(submission, current_user["id"])

@router.get("/", response_model=List[SubmissionResponse])
async def list_submissions(problem_id: Optional[str] = None, current_user: dict = Depends(get_current_user)):
    """List submissions for the currently authenticated user."""
    query = supabase.table("submissions").select("*").eq("user_id", current_user["id"])
    if problem_id:
        query = query.eq("problem_id", problem_id)
        
    res = query.order("created_at", desc=True).limit(50).execute()
    return res.data
