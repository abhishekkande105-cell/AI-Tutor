import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "SocraticAI"
    TAGLINE: str = "Learn the concept. Solve it yourself."
    API_V1_STR: str = "/api"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "socratic_super_secret_hackathon_jwt_key_2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./socratic_ai.db")
    
    # Gemma / Gemini API Keys
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMMA_API_KEY: str = os.getenv("GEMMA_API_KEY", "")
    
    # Mode
    DEMO_MODE: bool = os.getenv("DEMO_MODE", "true").lower() in ("true", "1")
    
    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
