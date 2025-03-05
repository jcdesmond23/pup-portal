from pydantic_settings import BaseSettings
from dotenv import load_dotenv
import os
from .password_utils import get_password_hash

# Load environment variables from .env file
load_dotenv()

class Settings(BaseSettings):
    # JWT settings
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))
    
    # Authorized user settings
    AUTH_USERNAME: str = os.getenv("AUTH_USERNAME", "admin")
    AUTH_PASSWORD: str = os.getenv("AUTH_PASSWORD", "")

    class Config:
        env_file = ".env"

settings = Settings()

# Create a single authorized user record
authorized_user = {
    settings.AUTH_USERNAME: {
        "username": settings.AUTH_USERNAME,
        "hashed_password": get_password_hash(settings.AUTH_PASSWORD),
        "disabled": False,
    }
}
