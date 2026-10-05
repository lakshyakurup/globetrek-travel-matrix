# System overview

Globetrek is a collaborative travel planning platform organized into four runtime planes:

```text
Browser ── HTTPS/WSS ── Nginx ── Next.js dashboard
                         │
                         └── FastAPI API ── PostgreSQL
                              │       ├── Redis jobs/pub-sub
                              │       ├── AI providers
                              │       └── payment providers
```

The browser owns presentation state and reconnectable collaboration sessions. Next.js provides the App Router UI and server-rendered shells. FastAPI owns authentication, trip invariants, optimistic version checks, webhook verification, and service orchestration. PostgreSQL is the system of record; Redis carries transient queues and presence events.

Every request receives telemetry, is rate limited at the API edge, and is authorized against a resource-level RBAC rule. Deployments use immutable images, readiness probes, horizontal scaling, and a rollback-ready ECS/Kubernetes release process.
