import hashlib
import hmac
import secrets
import time


def hash_password(password: str, salt: str | None = None) -> str:
    chosen_salt = salt or secrets.token_hex(16)
    digest = hashlib.scrypt(password.encode(), salt=chosen_salt.encode(), n=2**14, r=8, p=1).hex()
    return f"{chosen_salt}${digest}"


def verify_password(password: str, encoded: str) -> bool:
    salt, expected = encoded.split("$", 1)
    actual = hash_password(password, salt).split("$", 1)[1]
    return hmac.compare_digest(actual, expected)


def issue_token(subject: str, secret: str, ttl_seconds: int = 3600) -> str:
    expires = int(time.time()) + ttl_seconds
    payload = f"{subject}.{expires}"
    signature = hmac.new(secret.encode(), payload.encode(), hashlib.sha256).hexdigest()
    return f"{payload}.{signature}"


def verify_token(token: str, secret: str) -> str | None:
    try:
        subject, expires, signature = token.split(".", 2)
        payload = f"{subject}.{expires}"
        expected = hmac.new(secret.encode(), payload.encode(), hashlib.sha256).hexdigest()
        if int(expires) < int(time.time()) or not hmac.compare_digest(signature, expected):
            return None
        return subject
    except (ValueError, TypeError):
        return None
