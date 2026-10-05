from dataclasses import dataclass
from math import sqrt


@dataclass(frozen=True)
class Destination:
    id: str
    name: str
    description: str
    vector: tuple[float, ...]


class VectorSearch:
    def __init__(self, destinations: list[Destination] | None = None) -> None:
        self.destinations = destinations or []

    def upsert(self, destination: Destination) -> None:
        self.destinations = [item for item in self.destinations if item.id != destination.id] + [destination]

    def search(self, vector: tuple[float, ...], limit: int = 5) -> list[Destination]:
        def cosine(item: Destination) -> float:
            numerator = sum(left * right for left, right in zip(vector, item.vector))
            denominator = sqrt(sum(value * value for value in vector)) * sqrt(sum(value * value for value in item.vector))
            return numerator / denominator if denominator else 0.0

        return sorted(self.destinations, key=cosine, reverse=True)[:limit]
