What this service does
----------------------
The Admin Service provides a small set of endpoints for managing and querying admin user records. It runs as a Spring Boot resource-server (no login/redirect flow) and accepts JWTs issued by Auth0 forwarded by the Gateway.

Tech stack
----------
- Java 21
- Spring Boot
- Spring Data JPA (PostgreSQL)
- Spring Security OAuth2 Resource Server
- Actuator

Endpoints
---------
- GET /admin/me -> returns the logged-in admin (uses Auth0 `sub` as auth0Id)
- POST /admin -> create new admin (requires SUPER_ADMIN)
- GET /admin/{id} -> fetch admin by id (requires SUPER_ADMIN)

User management (requires ADMIN or SUPER_ADMIN):
- GET /admin/users -> list all users
- GET /admin/users/{id} -> get user by id
- PUT /admin/users/{id} -> update user
- DELETE /admin/users/{id} -> soft-delete user (SUPER_ADMIN only)

Activity / Logs (requires ADMIN or SUPER_ADMIN):
- GET /admin/activity -> list recent activities
- GET /admin/activity/{userId} -> list activities for a specific user

Statistics:
- GET /admin/stats -> aggregated stats (total users, total activities)

Environment variables
---------------------
- DB_URL - JDBC URL to Postgres (e.g. jdbc:postgresql://host:5432/db)
- DB_USERNAME
- DB_PASSWORD
- AUTH0_DOMAIN - Auth0 issuer domain (e.g. https://your-tenant.us.auth0.com)
- AUTH0_AUDIENCE - expected audience in incoming tokens
- EMAILJS_SERVICE_ID
- EMAILJS_TEMPLATE_ID
- EMAILJS_PUBLIC_KEY
- EMAILJS_PRIVATE_KEY

How it works with Gateway and Auth0
----------------------------------
The Gateway is responsible for CORS, login redirects and presenting the OAuth2 login flow. The Gateway issues or forwards JWTs to downstream services. This Admin Service is configured as a resource server only and validates incoming JWTs (issuer + audience).

How to deploy on Render
-----------------------
1. Set environment variables from `.env.example` in the Render dashboard.
2. Build with Maven and deploy the produced JAR or use the Dockerfile provided.
3. Ensure the Gateway forwards Authorization: Bearer <token> header to this service.
4. Expose only necessary actuator endpoints (`/actuator/health`) publicly.
