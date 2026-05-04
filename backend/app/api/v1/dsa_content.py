from fastapi import APIRouter, HTTPException
from typing import List
from app.db.client import supabase
from app.schemas.dsa_content import DSALessonResponse

router = APIRouter()

@router.get("/lessons", response_model=List[DSALessonResponse])
async def list_dsa_lessons():
    """List all available DSA tutorials/lessons from the database."""
    res = supabase.table("dsa_lessons").select("*").order("order").execute()
    return res.data

@router.get("/lessons/{lesson_id}", response_model=DSALessonResponse)
async def get_dsa_lesson(lesson_id: str):
    """Get a specific DSA lesson by ID from the database."""
    res = supabase.table("dsa_lessons").select("*").eq("id", lesson_id).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Lesson not found")
    return res.data[0]
