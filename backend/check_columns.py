"""Quick script to check and fix the users table columns."""
from app.db.client import supabase

# Check current columns
res = supabase.table("users").select("*").limit(1).execute()
if res.data:
    print("Current columns:", list(res.data[0].keys()))
else:
    print("No users found")
