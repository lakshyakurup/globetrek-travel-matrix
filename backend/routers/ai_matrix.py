import os

from fastapi import APIRouter, HTTPException

from backend.schemas import MatrixPrompt

router = APIRouter()


@router.post("/itinerary")
async def generate_itinerary(prompt: MatrixPrompt) -> dict[str, object]:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=503, detail="AI provider is not configured")
    return {"provider": "gemini", "destination": prompt.destination, "days": prompt.days, "preferences": prompt.preferences, "request": f"Create a {prompt.days}-day itinerary for {prompt.destination}."}


@router.post("/stream")
async def stream_assistant(prompt: MatrixPrompt) -> dict[str, str]:
    if not os.getenv("GROQ_API_KEY"):
        raise HTTPException(status_code=503, detail="Streaming AI provider is not configured")
    return {"provider": "groq", "message": f"Planning a {prompt.days}-day trip to {prompt.destination}"}
