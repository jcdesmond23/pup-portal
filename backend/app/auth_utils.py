from datetime import datetime, timedelta, timezone
from typing import Optional
import jwt
from .config import settings
from .password_utils import verify_password

def get_user(db, username: str) -> Optional[dict]:
    if username in db:
        return db[username]
    return None

def authenticate_user(db, username: str, password: str) -> Optional[dict]:
    user = get_user(db, username)
    if not user:
        return None
    if not verify_password(password, user["hashed_password"]):
        return None
    return user

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    now = datetime.now(timezone.utc)
    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt
