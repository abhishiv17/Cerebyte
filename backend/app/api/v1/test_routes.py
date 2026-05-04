from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, Any

from app.db.client import supabase

router = APIRouter()

@router.get("/db-check")
async def db_check() -> Dict[str, Any]:
    """
    Temporary route to test the database connection to Supabase.
    """
    try:
        # A simple check to ensure we can communicate with Supabase.
        # We try to query the users table or any available table. 
        # For a simple ping, accessing auth or an empty select usually works.
        response = supabase.table("users").select("*").limit(1).execute()
        return {
            "status": "success", 
            "message": "Database connection successful", 
            "data": response.data
        }
    except Exception as e:
        return {
            "status": "error", 
            "message": "Database connection failed", 
            "error": str(e)
        }

@router.post("/run-background-checks")
async def run_background_checks() -> Dict[str, Any]:
    """
    Temporary route to trigger background checks or long-running tasks.
    """
    # Here you would typically dispatch tasks to a background worker like Celery or use FastAPI BackgroundTasks
    # For now, we simulate a successful job trigger.
    return {
        "status": "success", 
        "message": "Background checks initiated successfully. They are running asynchronously."
    }
