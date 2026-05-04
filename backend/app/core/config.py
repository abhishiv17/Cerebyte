from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        # Check backend/.env first, then root .env (for running from project root)
        env_file=(".env", "../.env"),
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # Supabase
    supabase_url: str
    supabase_anon_key: str
    supabase_service_role_key: str
    # AI
    groq_api_key: str

    # App
    app_env: str = "development"
    api_prefix: str = "/api/v1"


settings = Settings()
