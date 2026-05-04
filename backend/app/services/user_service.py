from app.db.client import supabase

async def get_user_profile(user_id: str):
    """Fetch user profile from the public.users table."""
    res = supabase.table("users").select("*").eq("id", user_id).execute()
    if res.data:
        return res.data[0]
    return None

async def update_user_profile(user_id: str, data: dict):
    """Update user profile in the public.users table."""
    res = supabase.table("users").update(data).eq("id", user_id).execute()
    if res.data:
        return res.data[0]
    return None
