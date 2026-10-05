from fastapi.testclient import TestClient

from backend.main import app

client = TestClient(app)


def _token() -> str:
    response = client.post("/api/auth/register", json={"email": "trip-suite@example.com", "password": "correct-horse", "display_name": "Planner"})
    return response.json()["access_token"]


def test_trip_create_list_and_optimistic_conflict() -> None:
    token = _token()
    headers = {"Authorization": f"Bearer {token}"}
    created = client.post("/api/trips", headers=headers, json={"title": "Kyoto", "destination": "Japan", "start_date": "2026-04-01", "end_date": "2026-04-10"})
    assert created.status_code == 201
    trip = created.json()
    assert client.get("/api/trips", headers=headers).json()[0]["id"] == trip["id"]
    conflict = client.patch(f"/api/trips/{trip['id']}", headers=headers, json={"version": 0, "title": "Changed"})
    assert conflict.status_code == 409
