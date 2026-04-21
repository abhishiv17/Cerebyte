from supabase import create_client, Client
from app.core.config import settings

# Service-role client — bypasses RLS, used server-side only
supabase: Client = create_client(
    settings.supabase_url,
    settings.supabase_service_role_key,
)
