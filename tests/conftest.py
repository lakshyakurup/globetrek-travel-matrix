"""Pytest configuration shared by backend integration suites."""

import os

os.environ.setdefault("GLOBETREK_JWT_SECRET", "test-secret")
