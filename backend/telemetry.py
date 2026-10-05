import logging
import time
import uuid
from collections import defaultdict

logger = logging.getLogger("globetrek")


class Telemetry:
    def __init__(self, limit: int = 120, window_seconds: int = 60) -> None:
        self.limit = limit
        self.window_seconds = window_seconds
        self._requests: dict[str, list[float]] = defaultdict(list)

    def startup(self) -> None:
        logger.info("backend_started")

    def shutdown(self) -> None:
        logger.info("backend_stopped")

    def allow(self, identity: str) -> bool:
        now = time.time()
        recent = [stamp for stamp in self._requests[identity] if now - stamp < self.window_seconds]
        self._requests[identity] = recent
        if len(recent) >= self.limit:
            return False
        recent.append(now)
        return True

    def request(self, method: str, path: str, status: int, duration: float) -> None:
        logger.info("http_request", extra={"method": method, "path": path, "status": status, "duration_ms": round(duration * 1000, 2)})

    @staticmethod
    def request_id() -> str:
        return str(uuid.uuid4())


telemetry = Telemetry()
