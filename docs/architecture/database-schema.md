# Database schema

Core relations:

- `users(id, email, display_name, password_hash, created_at)`
- `trips(id, owner_id, title, destination, start_date, end_date, version)`
- `expenses(id, trip_id, paid_by, amount, description)`
- `matrix_nodes(id, trip_id, label, latitude, longitude)`

`users` owns many `trips`; a trip owns expenses and matrix nodes. `version` is incremented on each accepted mutation and is used as an optimistic concurrency token for multi-user editing.

The owner and trip foreign-key indexes support dashboard reads. The expense trip index supports settlement aggregation. Personal identifiers are unique and normalized at the API boundary. Monetary values use fixed-precision numeric columns, never floating point storage.
