from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Database
    MONGODB_URL: str = "mongodb+srv://Ranu:ranu@cluster0.iwtsa.mongodb.net/"
    DATABASE_NAME: str = "money_mentor"
    
    # JWT
    SECRET_KEY: str = "073d09b4bf0440eff8f6a322fce7117e3ef427ac0b3d73044798e3b0c0e68eb6"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Groq
    GROQ_API_KEY: Optional[str] = None
    GROQ_MODEL: str = "mixtral-8x7b-32768"
    
    # Server
    PORT: int = 5000
    HOST: str = "0.0.0.0"
    DEBUG: bool = True
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
