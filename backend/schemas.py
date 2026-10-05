from datetime import date
from pydantic import BaseModel, Field


class UserCreate(BaseModel):
    email: str = Field(min_length=5, max_length=320)
    password: str = Field(min_length=8, max_length=128)
    display_name: str = Field(min_length=1, max_length=80)


class UserLogin(BaseModel):
    email: str = Field(min_length=5, max_length=320)
    password: str = Field(min_length=8, max_length=128)


class UserPublic(BaseModel):
    id: str
    email: str
    display_name: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    user: UserPublic


class TripCreate(BaseModel):
    title: str = Field(min_length=1, max_length=160)
    destination: str = Field(min_length=1, max_length=160)
    start_date: date
    end_date: date
    travelers: list[str] = Field(default_factory=list)


class TripUpdate(BaseModel):
    title: str | None = Field(default=None, max_length=160)
    destination: str | None = Field(default=None, max_length=160)
    version: int = Field(ge=0)
    travelers: list[str] | None = None


class TripPublic(TripCreate):
    id: str
    owner_id: str
    version: int


class MatrixPrompt(BaseModel):
    destination: str = Field(min_length=1, max_length=160)
    days: int = Field(ge=1, le=30)
    preferences: list[str] = Field(default_factory=list)


class CheckoutRequest(BaseModel):
    trip_id: str
    amount_cents: int = Field(gt=0)
    currency: str = Field(min_length=3, max_length=3)
