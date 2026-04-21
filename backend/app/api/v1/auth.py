from fastapi import APIRouter

router = APIRouter()


@router.get("/status")
async def auth_status():
    """Auth module health — the actual auth is handled by Supabase directly."""
    return {"auth_provider": "supabase", "status": "active"}
