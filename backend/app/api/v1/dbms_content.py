from fastapi import APIRouter, HTTPException
from typing import List
from app.db.client import supabase
from app.schemas.dbms_content import DBMSLessonResponse

router = APIRouter()

@router.get("/lessons", response_model=List[DBMSLessonResponse])
async def list_lessons():
    """List all available DBMS tutorials/lessons from the database."""
    res = supabase.table("dbms_lessons").select("*").order("order").execute()
    return res.data

@router.get("/lessons/{lesson_id}", response_model=DBMSLessonResponse)
async def get_lesson(lesson_id: str):
    """Get a specific DBMS lesson by ID from the database."""
    res = supabase.table("dbms_lessons").select("*").eq("id", lesson_id).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Lesson not found")
    return res.data[0]
