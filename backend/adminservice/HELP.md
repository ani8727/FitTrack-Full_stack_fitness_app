What this service does
----------------------
The Admin Service is a control-plane (admin-only) microservice that manages and inspects other services via REST. It does NOT own business data or database tables. It reads and modifies user/activity/workout data by calling the corresponding microservices.

Architecture
------------
- controller → service → client → dto
- No JPA, no repositories, no entities, no database connection
- Communicates to other microservices via OpenFeign (Web REST)

Responsibilities
----------------
- View all users: `GET /admin/users`
- Delete user: `DELETE /admin/users/{id}`
- View all activities: `GET /admin/activities`
- Delete activity: `DELETE /admin/activities/{id}`
- View all workouts: `GET /admin/workouts`
- Delete workout: `DELETE /admin/workouts/{id}`
- System stats (aggregated): `GET /admin/stats`

How it talks to other services
-----------------------------
- Uses OpenFeign clients bound to environment URLs:
	- `USER_SERVICE_URL` → `UserServiceClient`
	- `ACTIVITY_SERVICE_URL` → `ActivityServiceClient`
	- `WORKOUT_SERVICE_URL` → `WorkoutServiceClient`
- All data is proxied; this service only maps DTOs and aggregates counts.

Auth0 Security (Resource Server)
--------------------------------
- This service is a Resource Server only (no interactive login).
- It validates JWTs forwarded by the Gateway using `AUTH0_DOMAIN` (issuer) and `AUTH0_AUDIENCE`.
- All `/admin/**` endpoints require the `ADMIN` role.
- `/actuator/health` is public.

Environment variables
---------------------
- `AUTH0_DOMAIN` (issuer URI, e.g. https://your-tenant.us.auth0.com)
- `AUTH0_AUDIENCE` (expected audience in tokens)
- `USER_SERVICE_URL` (base URL of UserService)
- `ACTIVITY_SERVICE_URL` (base URL of ActivityService)
- `WORKOUT_SERVICE_URL` (base URL of WorkoutService)

Deploying on Render
-------------------
1. Add environment variables in the Render service settings from `.env.example`.
2. Build with Maven: `mvn -DskipTests package` or use the provided `Dockerfile`.
3. Ensure the Gateway forwards the `Authorization: Bearer <token>` header to this service.
4. Expose only `/actuator/health` publicly; keep `/admin/**` protected behind the Gateway.

Notes
-----
- The admin service intentionally contains no database configuration and no JPA or Hibernate artifacts.
- If upstream service endpoints differ from `/users`, `/activities`, `/workouts`, update the corresponding Feign client `url` or method mappings.
