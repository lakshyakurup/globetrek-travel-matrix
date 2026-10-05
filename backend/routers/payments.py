import hashlib
import hmac
import os

from fastapi import APIRouter, HTTPException, Request

from backend.schemas import CheckoutRequest

router = APIRouter()


@router.post("/checkout")
async def checkout(payload: CheckoutRequest) -> dict[str, object]:
    provider = "stripe" if os.getenv("STRIPE_SECRET_KEY") else "razorpay" if os.getenv("RAZORPAY_KEY_ID") else None
    if not provider:
        raise HTTPException(status_code=503, detail="Payment provider is not configured")
    return {"provider": provider, "trip_id": payload.trip_id, "amount": payload.amount_cents, "currency": payload.currency.upper()}


@router.post("/webhooks/{provider}")
async def webhook(provider: str, request: Request) -> dict[str, bool]:
    raw = await request.body()
    signature = request.headers.get("x-webhook-signature", "")
    secret = os.getenv(f"{provider.upper()}_WEBHOOK_SECRET", "")
    expected = hmac.new(secret.encode(), raw, hashlib.sha256).hexdigest() if secret else ""
    if not secret or not hmac.compare_digest(signature, expected):
        raise HTTPException(status_code=400, detail="Invalid webhook signature")
    return {"accepted": True}
