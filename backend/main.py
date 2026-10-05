from contextlib import asynccontextmanager
from time import monotonic

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from backend.routers import ai_matrix, auth, health, payments, trips
from backend.telemetry import telemetry


@asynccontextmanager
async def lifespan(_: FastAPI):
    telemetry.startup()
    yield
    telemetry.shutdown()


app = FastAPI(title="Globetrek Travel Matrix API", version="1.0.0", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def request_telemetry(request: Request, call_next):
    started = monotonic()
    if not telemetry.allow(request.client.host if request.client else "unknown"):
        return JSONResponse({"detail": "rate limit exceeded"}, status_code=429)
    response = await call_next(request)
    telemetry.request(request.method, request.url.path, response.status_code, monotonic() - started)
    response.headers["X-Request-ID"] = telemetry.request_id()
    return response


app.include_router(health.router, prefix="/health")
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(trips.router, prefix="/api/trips", tags=["trips"])
app.include_router(ai_matrix.router, prefix="/api/ai", tags=["ai"])
app.include_router(payments.router, prefix="/api/payments", tags=["payments"])
