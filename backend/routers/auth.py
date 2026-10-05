import os
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from backend.schemas import TokenResponse, UserCreate, UserLogin, UserPublic
from backend.security import hash_password, issue_token, verify_password, verify_token
from backend.store import StoredUser, store

router = APIRouter()
bearer = HTTPBearer(auto_error=False)
SECRET = os.getenv("GLOBETREK_JWT_SECRET", "development-only-change-me")
TOKEN_TTL = 3600


def current_user(credentials: HTTPAuthorizationCredentials | None = Depends(bearer)) -> StoredUser:
    subject = verify_token(credentials.credentials, SECRET) if credentials else None
    user = store.users.get(subject or "")
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid session")
    return user


@router.post("/register", response_model=TokenResponse, status_code=201)
def register(payload: UserCreate) -> TokenResponse:
    with store.lock:
        if payload.email.lower() in store.email_index:
            raise HTTPException(status_code=409, detail="Email already registered")
        user = StoredUser(str(uuid4()), payload.email.lower(), payload.display_name, hash_password(payload.password))
        store.users[user.id] = user
        store.email_index[user.email] = user.id
    return _token_response(user)


@router.post("/login", response_model=TokenResponse)
def login(payload: UserLogin) -> TokenResponse:
    user = store.users.get(store.email_index.get(payload.email.lower(), ""))
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return _token_response(user)


@router.get("/me", response_model=UserPublic)
def me(user: StoredUser = Depends(current_user)) -> UserPublic:
    return UserPublic(id=user.id, email=user.email, display_name=user.display_name)


def _token_response(user: StoredUser) -> TokenResponse:
    return TokenResponse(access_token=issue_token(user.id, SECRET, TOKEN_TTL), expires_in=TOKEN_TTL, user=UserPublic(id=user.id, email=user.email, display_name=user.display_name))
