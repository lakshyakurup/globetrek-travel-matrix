# Globetrek Travel Matrix

[![CI](https://github.com/lakshyakurup/globetrek-travel-matrix/actions/workflows/ci.yml/badge.svg)](https://github.com/lakshyakurup/globetrek-travel-matrix/actions/workflows/ci.yml)
[![Security](https://github.com/lakshyakurup/globetrek-travel-matrix/actions/workflows/security-scan.yml/badge.svg)](https://github.com/lakshyakurup/globetrek-travel-matrix/actions/workflows/security-scan.yml)

Globetrek is a collaborative travel-planning platform for itinerary design, shared expenses, destination intelligence, and real-time trip coordination.

## Architecture

- **Web:** Next.js 16 App Router, React 19, typed dashboard views, and accessible matrix widgets.
- **API:** FastAPI routers for authentication, trip collaboration, AI orchestration, and payment webhooks.
- **Data:** PostgreSQL relational models with optimistic trip versions and a Redis-compatible task/presence bus.
- **Intelligence:** deterministic budget regression, anomaly detection, recommendations, sentiment, clustering, funnel analysis, and telemetry aggregation.
- **Operations:** Docker, Nginx, Kubernetes, ECS deployment automation, CodeQL/Snyk scanning, and Lighthouse performance audits.

## Local development

```bash
npm install
npm run dev
```

For the API:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
uvicorn backend.main:app --reload --port 8000
```

Run validation with `npx tsc --noEmit`, `npm run lint`, `npm run build`, and `pytest tests/backend -q`.

## CLI

The typed matrix CLI supports project initialization, deterministic environment diagnostics, and mock trip generation:

```bash
matrix-cli init ./my-trip
matrix-cli doctor
matrix-cli seed --count=5
```

## Repository map

`app/` contains routes, `components/` and `src/` contain reusable UI and domain modules, `backend/` contains the API, `infrastructure/` contains deployment manifests, `tests/` contains unit/integration/e2e suites, and `docs/` records operational and security standards.
