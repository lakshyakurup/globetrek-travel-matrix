from dataclasses import dataclass, field
from datetime import date
from threading import RLock


@dataclass
class StoredUser:
    id: str
    email: str
    display_name: str
    password_hash: str


@dataclass
class StoredTrip:
    id: str
    owner_id: str
    title: str
    destination: str
    start_date: date
    end_date: date
    travelers: list[str] = field(default_factory=list)
    version: int = 1


class MemoryStore:
    def __init__(self) -> None:
        self.lock = RLock()
        self.users: dict[str, StoredUser] = {}
        self.trips: dict[str, StoredTrip] = {}
        self.email_index: dict[str, str] = {}


store = MemoryStore()
