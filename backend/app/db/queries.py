from app.db.client import supabase

def get_by_id(table: str, item_id: str):
    """Reusable query to fetch a single record by ID."""
    return supabase.table(table).select("*").eq("id", item_id).execute()

def get_all(table: str, limit: int = 100):
    """Reusable query to fetch all records from a table with a limit."""
    return supabase.table(table).select("*").limit(limit).execute()
