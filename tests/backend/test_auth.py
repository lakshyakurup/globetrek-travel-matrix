from fastapi.testclient import TestClient

from backend.main import app

client = TestClient(app)


def test_register_login_and_session() -> None:
    email = "auth-suite@example.com"
    registration = client.post("/api/auth/register", json={"email": email, "password": "correct-horse", "display_name": "Tester"})
    assert registration.status_code == 201
    token = registration.json()["access_token"]
    session = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert session.status_code == 200
    assert session.json()["email"] == email


def test_invalid_session_is_rejected() -> None:
    response = client.get("/api/auth/me", headers={"Authorization": "Bearer invalid"})
    assert response.status_code == 401


def test_login_only_requires_credentials() -> None:
    email = "login-suite@example.com"
    client.post("/api/auth/register", json={"email": email, "password": "correct-horse", "display_name": "Login user"})
    response = client.post("/api/auth/login", json={"email": email, "password": "correct-horse"})
    assert response.status_code == 200
    assert response.json()["user"]["email"] == email
