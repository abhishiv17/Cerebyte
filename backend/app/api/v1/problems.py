from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional

from app.db.client import supabase
from app.schemas.problem import ProblemCreate, ProblemUpdate, ProblemResponse
from app.core.security import get_current_user

router = APIRouter()

@router.get("/", response_model=List[ProblemResponse])
async def list_problems(difficulty: Optional[str] = None, topic: Optional[str] = None, limit: int = 50):
    """List all problems, optionally filtered by difficulty or topic."""
    query = supabase.table("problems").select("*").limit(limit)
    if difficulty:
        query = query.eq("difficulty", difficulty)
    if topic:
        query = query.eq("topic", topic)
        
    res = query.execute()
    return res.data

@router.get("/{problem_id}", response_model=ProblemResponse)
async def get_problem(problem_id: str):
    """Get a specific problem by ID."""
    res = supabase.table("problems").select("*").eq("id", problem_id).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Problem not found")
    return res.data[0]

@router.post("/", response_model=ProblemResponse)
async def create_problem(problem: ProblemCreate, current_user: dict = Depends(get_current_user)):
    """Create a new problem (admin or contributor function)."""
    data = problem.model_dump()
    data["created_by"] = current_user["id"]
    
    res = supabase.table("problems").insert(data).execute()
    if not res.data:
        raise HTTPException(status_code=500, detail="Failed to create problem")
    return res.data[0]

@router.put("/{problem_id}", response_model=ProblemResponse)
async def update_problem(problem_id: str, problem: ProblemUpdate, current_user: dict = Depends(get_current_user)):
    """Update an existing problem."""
    existing = supabase.table("problems").select("*").eq("id", problem_id).execute()
    if not existing.data:
        raise HTTPException(status_code=404, detail="Problem not found")
        
    update_data = problem.model_dump(exclude_unset=True)
    res = supabase.table("problems").update(update_data).eq("id", problem_id).execute()
    if not res.data:
        raise HTTPException(status_code=500, detail="Failed to update problem")
    return res.data[0]

@router.delete("/{problem_id}")
async def delete_problem(problem_id: str, current_user: dict = Depends(get_current_user)):
    """Delete a problem."""
    res = supabase.table("problems").delete().eq("id", problem_id).execute()
    return {"status": "success", "message": "Problem deleted"}
