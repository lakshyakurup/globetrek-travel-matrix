# Globetrek Travel Matrix

<p align="center">
  <strong>Plan together. Optimize every stop. Settle every shared expense.</strong><br />
  A collaborative travel operating system for itinerary intelligence, live trip coordination, and transparent group finances.
</p>

<p align="center">
  <a href="https://github.com/lakshyakurup/globetrek-travel-matrix/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/lakshyakurup/globetrek-travel-matrix/ci.yml?branch=main&label=build&logo=github" alt="Build status" /></a>
  <a href="https://github.com/lakshyakurup/globetrek-travel-matrix"><img src="https://img.shields.io/github/license/lakshyakurup/globetrek-travel-matrix?color=blue" alt="License" /></a>
  <img src="https://img.shields.io/badge/coverage-test%20suite-informational" alt="Coverage" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/FastAPI-0.115+-009688?logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/Vercel-ready-black?logo=vercel&logoColor=white" alt="Vercel" />
  <img src="https://img.shields.io/badge/AWS%20ECS-supported-FF9900?logo=amazon-aws&logoColor=white" alt="AWS ECS" />
</p>

> [!IMPORTANT]
> Globetrek is an actively evolving reference platform. The repository contains production-oriented boundaries, validation, security controls, deployment manifests, and test suites. Provider credentials, managed PostgreSQL/Redis services, TLS certificates, and cloud IAM must be supplied by the deployment environment.

## Contents

- [Executive architecture](#executive-architecture)
- [Dataflow and collaboration workflow](#dataflow-and-collaboration-workflow)
- [Technology stack](#technology-stack)
- [Repository layout](#repository-layout)
- [Local development](#local-development)
- [Testing and quality gates](#testing-and-quality-gates)
- [Containerization and deployment](#containerization-and-deployment)
- [CLI utilities](#cli-utilities)
- [Security and governance](#security-and-governance)
- [Contributing](#contributing)
- [License](#license)

## Executive architecture

Globetrek combines a Next.js 16 App Router experience with typed TypeScript domain modules and a Python FastAPI service boundary. The browser renders dashboards and widgets, maintains authenticated client state, and reconnects to collaboration channels through WebSockets. FastAPI owns request validation, authentication, trip invariants, optimistic version checks, AI/payment orchestration, and webhook verification. PostgreSQL is the durable relational system of record, while Redis is the transient coordination layer for queues, presence, and pub/sub.

The TypeScript routing, middleware, event, caching, encryption, and provider clients in `src/` are reusable gateway/domain primitives. They can be hosted behind a Node.js gateway or consumed by Next.js route handlers. The current HTTP API bootstrap is `backend/main.py`; the architecture intentionally keeps protocol adapters separate from core algorithms so the analytics and financial logic remains testable without cloud services.

### System architecture

| Tier | Primary technology | Core responsibility | Durability / scaling boundary |
| --- | --- | --- | --- |
| Experience | Next.js 16, React 19, Tailwind CSS 4, TypeScript | Dashboard shell, trip editor, matrix canvas, map, assistant, command palette | Vercel or containerized Next.js replicas |
| Client state | React Context, typed hooks, WebSocket protocol | Auth session, local preferences, optimistic trip state, reconnectable collaboration | Browser memory and local storage |
| Gateway primitives | TypeScript router, CORS, rate limiter, auth guard, logger, compression | Route dispatch, request policy, structured observability, security middleware | Stateless Node.js/Next.js processes |
| API services | Python 3.10+, FastAPI, Pydantic | Auth, trip CRUD, AI orchestration, checkout/webhooks, health and telemetry | Stateless FastAPI replicas behind a load balancer |
| Domain intelligence | TypeScript analytics/ML modules | Budget regression, anomaly detection, recommendations, sentiment, clustering, funnel and telemetry calculations | CPU-bound request or worker execution |
| Collaboration | WebSockets, Redis-compatible pub/sub worker | Presence, trip version events, live peer updates, background task dispatch | Redis channels and horizontally scaled consumers |
| Persistence | PostgreSQL, SQLAlchemy, `backend/schema.sql` | Users, trips, expenses, matrix nodes, audit-supporting relational data | Managed PostgreSQL with backups and read replicas |
| Edge and delivery | Nginx, Docker, Kubernetes, AWS ECS, Vercel | TLS termination, routing, health checks, image rollout, autoscaling | ALB/Ingress, ECS services, HPA, CDN |

### Request boundaries

```text
Browser
  │ HTTPS / WSS
  ▼
Nginx or ALB
  ├── /              ──► Next.js dashboard
  └── /api/*         ──► FastAPI service
                           ├── PostgreSQL (durable state)
                           ├── Redis (ephemeral state/events)
                           ├── Gemini/Groq (AI providers)
                           └── Stripe/Razorpay (payments)
```

## Dataflow and collaboration workflow

The following workflow shows two peers editing one trip. Every mutation carries a version. The API accepts only the current version, increments it atomically in the service boundary, persists the change, and publishes an event for other connected clients.

```mermaid
sequenceDiagram
    autonumber
    participant A as Client A
    participant B as Client B
    participant WS as WebSocket Gateway
    participant API as FastAPI API
    participant Auth as Auth Guard
    participant DB as PostgreSQL
    participant Redis as Redis Pub/Sub

    A->>API: POST /api/auth/login
    API->>Auth: Verify password and issue signed token
    Auth-->>A: Bearer token + user session
    A->>WS: Connect /rooms/{tripId} with token
    WS->>Auth: Validate token and room membership
    Auth-->>WS: Authorized session
    WS-->>A: presence.joined
    WS-->>B: presence.joined

    A->>API: PATCH /api/trips/{id} { version: 3, changes }
    API->>Auth: Validate bearer and owner/member policy
    Auth-->>API: Authorized subject
    API->>DB: Compare version 3 and persist version 4
    DB-->>API: Updated trip
    API->>Redis: Publish trip.updated(version=4)
    Redis-->>WS: Broadcast event to room
    WS-->>A: mutation.ack(version=4)
    WS-->>B: trip.updated(version=4)
    B->>API: PATCH /api/trips/{id} { version: 3, changes }
    API-->>B: 409 conflict; refresh required
    B->>WS: Request latest room snapshot
    WS-->>B: snapshot(version=4)
```

### End-to-end dataflow

1. **Authentication:** a user registers or logs in through `/api/auth`. Passwords are salted and hashed; the service issues a signed, expiring bearer token. Protected routes resolve the subject before reading or mutating resources.
2. **Trip reads:** the service filters trips by owner or collaborator membership. The dashboard uses typed models and renders the current version and traveler presence.
3. **Trip mutations:** clients submit a version token with each update. A stale token returns `409 Conflict`, preventing silent overwrites. Successful updates increment the version and publish a collaboration event.
4. **Debt splitting:** expense records are normalized into participant balances. `src/utils/matrixMath.ts` calculates net creditors/debtors and emits a minimal settlement set; `src/analytics/anomalyDetector.ts` can flag unusual category charges before settlement.
5. **AI itinerary generation:** the AI route validates destination, duration, and preferences, then dispatches to a configured Gemini/Groq provider. Provider credentials are environment secrets; the API returns explicit configuration errors rather than fabricated success.
6. **Observability:** request telemetry captures method, path, status, duration, and request IDs. The TypeScript `TelemetryStream` aggregates bounded in-memory metrics for dashboards and can be replaced by a hosted metrics exporter.
7. **Recovery:** clients reconnect with exponential backoff. Deployment probes use `/health`; failed rollouts can be reversed to a previous immutable ECS task definition or Kubernetes ReplicaSet.

## Technology stack

| Area | Technologies |
| --- | --- |
| Frontend | Next.js 16, React 19, TypeScript 5, Tailwind CSS 4, Leaflet/react-leaflet |
| Backend | Python 3.10+, FastAPI, Pydantic, SQLAlchemy, Uvicorn |
| Algorithms | TypeScript regression, z-score, cosine similarity, sentiment lexicon, K-Means, funnel metrics |
| Realtime | WebSocket browser API, React synchronization hooks, Redis-compatible pub/sub worker |
| Security | Signed bearer tokens, scrypt password hashing, AES-256-GCM utility, CORS, CSP, RBAC, rate limiting |
| Data | PostgreSQL schema, SQLAlchemy ORM, Redis-compatible transient cache and queue boundary |
| Delivery | Docker Compose, multi-stage Dockerfiles, Nginx, Kubernetes, AWS ECS, Vercel |
| Quality | TypeScript compiler, ESLint, Node test runner, pytest, Playwright, CodeQL, Snyk, Lighthouse |
| Protocols | HTTPS, WSS, JSON, REST, WebSocket, webhook HMAC signatures |

> [!NOTE]
> The repository provides a Redis-compatible worker abstraction. BullMQ is an appropriate Node.js production adapter for the same queue contract, but BullMQ is not currently a runtime dependency. Install and wire it only when the deployment chooses a Node-owned queue worker.

## Repository layout

```text
.
├── app/                         # Next.js App Router pages and dashboard routes
│   └── dashboard/               # Overview, trips, editor, analytics, settings
├── backend/                     # FastAPI application, routers, models, schema, services
│   ├── models/                  # SQLAlchemy ORM entities
│   ├── routers/                 # auth, trips, AI, payments, health
│   └── services/                # Redis worker and vector search boundary
├── bin/                         # Executable matrix CLI entry point
├── components/                  # Matrix visualizer, map, assistant, command palette
├── config/                      # Enterprise Webpack, Tailwind, ESLint, Jest configuration
├── context/                     # Global auth and collaboration providers
├── docs/                        # Architecture, operations, contribution, incident response
├── hooks/                       # Browser WebSocket and local-storage hooks
├── infrastructure/              # Compose, Dockerfiles, Nginx, Kubernetes manifests
├── security/                    # CSP, RBAC, SOC 2/GDPR checklist
├── scripts/                     # ECS deployment automation
├── src/                         # Reusable TypeScript core, middleware, services, analytics, ML
├── tests/                       # Backend, unit, integration, frontend, E2E, performance suites
├── package.json                 # Frontend and developer tooling scripts
└── tsconfig.json                # Strict TypeScript compiler configuration
```

## Local development

### Prerequisites

- Node.js 18 or newer (Node.js 22 LTS is recommended)
- npm 10 or newer
- Python 3.10 or newer (Python 3.12 is recommended for pinned dependencies)
- Docker Engine and Docker Compose v2
- Git
- PostgreSQL and Redis locally, or Docker Compose

### Clone and install

```bash
git clone https://github.com/lakshyakurup/globetrek-travel-matrix.git
cd globetrek-travel-matrix

npm ci

python3 -m venv .venv
source .venv/bin/activate                 # Windows: .venv\Scripts\activate
python -m pip install -r backend/requirements.txt
```

### Configure environment

Create `.env.local` for Next.js and a shell environment or `.env` for FastAPI:

```bash
cat > .env.local <<'EOF'
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
EOF

cat > .env <<'EOF'
GLOBETREK_JWT_SECRET=replace-with-a-long-random-development-secret
DATABASE_URL=postgresql+psycopg://globetrek:local-development-only@localhost:5432/globetrek
REDIS_URL=redis://localhost:6379/0
# Optional provider credentials:
# GEMINI_API_KEY=
# GROQ_API_KEY=
# STRIPE_SECRET_KEY=
# STRIPE_WEBHOOK_SECRET=
# RAZORPAY_KEY_ID=
# RAZORPAY_KEY_SECRET=
EOF
```

The `matrix-cli init <directory>` command also creates a project-local `.env.example` containing the API base URL. Never commit real provider keys, JWT secrets, database passwords, or webhook secrets.

### Start the development services

Run the API and frontend in separate terminals:

```bash
# Terminal 1
source .venv/bin/activate
uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000

# Terminal 2
npm run dev
```

Open [http://localhost:3000/dashboard](http://localhost:3000/dashboard). The API health endpoint is [http://localhost:8000/health](http://localhost:8000/health).

For local PostgreSQL, Redis, API, and frontend orchestration:

```bash
docker compose -f infrastructure/docker-compose.yml up --build
```

## Testing and quality gates

### TypeScript and Next.js

```bash
npx tsc --noEmit
npm run lint
npm run build
```

### Python API

```bash
source .venv/bin/activate
pytest tests/backend -q
python -m compileall -q backend tests/backend
```

### Algorithms and integration tests

The repository uses the Node test runner for deterministic TypeScript suites. A direct TypeScript compile keeps the test command dependency-light:

```bash
rm -rf /tmp/globetrek-tests
npx tsc --target ES2020 --module commonjs --moduleResolution node \
  --esModuleInterop --skipLibCheck --outDir /tmp/globetrek-tests \
  tests/unit/*.test.ts tests/integration/*.test.ts \
  src/analytics/*.ts src/ml/*.ts src/core/router.ts
node --test /tmp/globetrek-tests/tests/unit/*.test.js \
  /tmp/globetrek-tests/tests/integration/*.test.js
```

### Playwright E2E

Install browsers once, then run the browser workflow:

```bash
npx playwright install --with-deps chromium
npx playwright test
```

The Playwright configuration starts `npm run dev` automatically when no server is already listening. E2E tests cover dashboard navigation, trip filtering, and the authentication-to-workspace journey.

### Performance

`tests/performance/loadTest.js` is an Artillery-compatible scenario definition:

```bash
npx artillery run tests/performance/loadTest.js
```

The scheduled GitHub Actions performance workflow builds the application, starts Next.js, waits for port 3000, and uploads a Lighthouse report.

## CI/CD and production deployment

### GitHub Actions

| Workflow | Trigger | Purpose |
| --- | --- | --- |
| `ci.yml` | Push and pull request | Type-check, lint, build, install Python dependencies, run pytest |
| `lint.yml` | Pull request | Strict ESLint and Prettier enforcement |
| `security-scan.yml` | Push, PR, weekly schedule | CodeQL analysis, npm audit, optional Snyk scan |
| `docker-build.yml` | Main push | Build and publish multi-architecture backend images to GHCR |
| `cd.yml` | Version tag | Authenticate to AWS and force a new ECS deployment |
| `release.yml` | Main push | Publish a generated GitHub release for feature/fix commits |
| `performance.yml` | Manual and weekly schedule | Run Lighthouse against the dashboard |

Required production secrets and variables should be configured in GitHub Environments, not committed to workflow files:

`AWS_DEPLOY_ROLE_ARN`, `AWS_REGION`, `ECR_REGISTRY`, `ECS_CLUSTER`, `ECS_SERVICE`, and optional `SNYK_TOKEN`.

### Docker Compose

```bash
docker compose -f infrastructure/docker-compose.yml up --build -d
docker compose -f infrastructure/docker-compose.yml ps
docker compose -f infrastructure/docker-compose.yml logs -f backend
docker compose -f infrastructure/docker-compose.yml down
```

The Compose stack includes PostgreSQL, Redis, FastAPI, and Next.js. Persistent PostgreSQL data is stored in the `postgres-data` named volume.

### Kubernetes

Review image tags, secrets, domain names, and TLS issuer settings before applying:

```bash
kubectl create secret generic globetrek-secrets \
  --from-literal=GLOBETREK_JWT_SECRET="$GLOBETREK_JWT_SECRET" \
  --from-literal=DATABASE_URL="$DATABASE_URL" \
  --from-literal=REDIS_URL="$REDIS_URL"

kubectl apply -f infrastructure/k8s/deployment.yaml
kubectl apply -f infrastructure/k8s/ingress.yaml
kubectl rollout status deployment/globetrek-backend
kubectl get ingress globetrek
```

The deployment defines three API replicas, readiness checks, a service, and a CPU-based horizontal pod autoscaler. The ingress expects an Nginx controller and cert-manager-managed TLS.

### AWS ECS

The scripted deployment path is:

```bash
export AWS_REGION=us-east-1
export ECR_REPOSITORY=globetrek-backend
export ECS_CLUSTER=globetrek-production
export ECS_SERVICE=globetrek-api
export IMAGE_TAG="$(git rev-parse --short HEAD)"

./scripts/deploy-ecs.sh
```

The script authenticates to ECR, builds and pushes the backend image, requests a new ECS deployment, and waits for service stability. Use an ECS task role with least-privilege access to ECR, CloudWatch, Secrets Manager, and required storage. Apply backward-compatible database migrations before switching application traffic.

### Vercel

For the Next.js experience:

1. Import the repository into Vercel.
2. Set the framework preset to Next.js.
3. Configure `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_WS_URL` for the deployed API and WebSocket gateway.
4. Configure preview and production environments separately.
5. Keep FastAPI, PostgreSQL, Redis, and provider secrets outside Vercel unless they are intentionally hosted there.
6. Verify `/dashboard`, browser console errors, API CORS, WebSocket upgrades, and provider callback URLs after deployment.

## CLI utilities

The executable [bin/matrix-cli.ts](./bin/matrix-cli.ts) exposes small operational workflows:

```bash
npx tsx bin/matrix-cli.ts init ./examples/weekend-trip
npx tsx bin/matrix-cli.ts doctor
npx tsx bin/matrix-cli.ts seed --count=5
```

The commands initialize a trip project, check Node/JWT/package prerequisites, and generate mock trip records. Migration execution is available as a typed library function in `src/cli/commands/migrate.ts` and accepts an injected database connection.

## Security and governance

- **Authentication:** signed expiring tokens, salted scrypt password hashes, bearer validation, and explicit unauthorized responses.
- **Authorization:** resource-level RBAC definitions in [`security/policies/rbac.json`](./security/policies/rbac.json).
- **Transport policy:** CORS enforcement, security headers/CSP policy in [`security/policies/csp.json`](./security/policies/csp.json), TLS at the edge, and WSS for collaboration.
- **Input safety:** Pydantic and TypeScript validation, sanitizer utilities, bounded rate limiting, webhook HMAC verification, and no success-shaped provider fallback.
- **Data protection:** AES-256-GCM utility for application payloads; managed database encryption, secret rotation, backups, and access logs remain deployment responsibilities.
- **Compliance:** the SOC 2/GDPR operational checklist is maintained in [`security/audit/complianceChecklist.md`](./security/audit/complianceChecklist.md).
- **Incident response:** follow [`docs/security/incident-response.md`](./docs/security/incident-response.md); preserve evidence, revoke credentials, contain, patch, recover, notify, and record lessons learned.

> [!WARNING]
> The default JWT secret in development is intentionally unsafe for production. Set a high-entropy secret through a managed secret store before exposing the API.

## Contributing

1. Create a focused branch from `main`.
2. Keep domain logic deterministic and I/O boundaries injectable.
3. Add or update tests for behavior changes, especially authorization, version conflicts, financial calculations, and provider failures.
4. Run the local quality gates before opening a pull request:

   ```bash
   npx tsc --noEmit
   npm run lint
   npm run build
   pytest tests/backend -q
   ```

5. Use Conventional Commits:

   ```text
   feat(scope): add a capability
   fix(scope): correct a defect
   test(scope): add coverage
   docs(scope): update documentation
   chore(scope): maintain tooling
   ```

6. Do not commit credentials, customer data, generated caches, local `.env` files, or unreviewed infrastructure changes.

Detailed standards are documented in [`docs/contributing/code-standards.md`](./docs/contributing/code-standards.md).

## License

Globetrek Travel Matrix is attributed to **Lakshya Kurup** and is intended to be distributed under the **MIT License**:

```text
Copyright (c) 2026 Lakshya Kurup

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
