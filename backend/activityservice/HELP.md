What this service does
----------------------
The Activity Service stores and returns user activity records (runs, walks, workouts, etc.). It owns the `activities` collection in MongoDB and exposes REST endpoints consumed by the Gateway and other services.

Architecture
------------
- controller → service → repository → model → dto
- Spring Boot + Spring Data MongoDB
- Optional RabbitMQ publishing hooks for downstream AI processing
- Resilience (Circuit Breaker) and WebClient for inter-service calls

Public endpoints
----------------
- POST /activities — create/track an activity (requires `X-User-ID` header or authenticated user)
- GET /activities — list activities for the calling user (requires `X-User-ID` header)
- GET /activities/{id} — get activity by id
- GET /activities/stats — simple aggregated stats for the calling user
- DELETE /activities/{id} — delete an activity owned by the calling user

Admin endpoints (restricted)
----------------------------
- GET /activities/admin/activities — list all activities across users
- GET /activities/admin/activities/stats — aggregated system stats
- DELETE /activities/admin/activities/{id} — delete an activity by admin

Security
--------
- This service runs as an OAuth2 Resource Server (JWT validation) configured via application properties.
- The Gateway should forward `Authorization` and `X-User-ID` headers when proxying requests.

Environment variables (see `.env.example`)
------------------------------------------
- `API_GATEWAY_URL` — base URL for internal API gateway (used by WebClient)
- `MONGODB_URI` — connection string for MongoDB
- `RABBITMQ_EXCHANGE_NAME` — (optional) exchange name for activity publish
- `PORT` — service port (default 8082)

Deploying and running
---------------------
1. Provide environment variables from `.env.example`.
2. Build with Maven: `mvn -DskipTests package`.
3. Run the jar or use the provided `Dockerfile`.
4. Health endpoint: `/actuator/health` (recommended to be publicly accessible by health checks only).

Notes & cleanup
---------------
- This service intentionally keeps responsibilities small: it owns activity data and provides aggregation endpoints.
- If you disable RabbitMQ, the activity publishing hooks remain configurable but inert.
- For local dev, set `API_GATEWAY_URL` to your running gateway (or local gateway URL).
