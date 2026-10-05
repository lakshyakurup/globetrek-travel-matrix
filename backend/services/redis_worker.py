import asyncio
import json
import logging
from collections.abc import Awaitable, Callable

logger = logging.getLogger("globetrek.redis")


class InMemoryRedisBus:
    def __init__(self) -> None:
        self._queues: dict[str, asyncio.Queue[str]] = {}
        self._subscribers: dict[str, list[Callable[[dict[str, object]], Awaitable[None]]]] = {}

    async def enqueue(self, queue: str, payload: dict[str, object]) -> None:
        await self._queues.setdefault(queue, asyncio.Queue()).put(json.dumps(payload))

    async def publish(self, channel: str, payload: dict[str, object]) -> None:
        await asyncio.gather(*(handler(payload) for handler in self._subscribers.get(channel, [])))

    def subscribe(self, channel: str, handler: Callable[[dict[str, object]], Awaitable[None]]) -> None:
        self._subscribers.setdefault(channel, []).append(handler)

    async def work(self, queue: str, handler: Callable[[dict[str, object]], Awaitable[None]]) -> None:
        inbox = self._queues.setdefault(queue, asyncio.Queue())
        while True:
            payload = json.loads(await inbox.get())
            try:
                await handler(payload)
            except Exception:
                logger.exception("task_failed", extra={"queue": queue})
            finally:
                inbox.task_done()


redis_bus = InMemoryRedisBus()
