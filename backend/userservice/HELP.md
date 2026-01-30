# User Service (FitTrack)

**What this service does**
- Stores and returns minimal user profiles for the FitTrack system.
- Users are created after Auth0 login; this service stores Auth0 ID and basic profile info.

**Tech stack**
- Java 21, Spring Boot
- Spring Data JPA (PostgreSQL)
- Spring Security OAuth2 Resource Server (Auth0 JWT validation)

**Endpoints**
- GET /users/me — returns the current authenticated user (requires valid JWT)
- POST /users — create user record (uses Auth0 subject from JWT; request may include name/email)
- GET /users/{id} — admin-only lookup by database id (requires admin authority)

**Environment variables** (see .env.example)
- `DB_URL` — JDBC URL for PostgreSQL (e.g. `jdbc:postgresql://host:5432/db`)
- `DB_USERNAME` — DB user
- `DB_PASSWORD` — DB password
- `AUTH0_DOMAIN` — your Auth0 tenant domain (example: `your-tenant.auth0.com`)
- `AUTH0_AUDIENCE` — expected audience for tokens
- `PORT` — server port (default 8081)

**How it works with Gateway and Auth0**
- This service is configured as an OAuth2 Resource Server that validates JWTs issued by Auth0.
- The Spring Cloud Gateway should handle CORS and perform authentication/authorization if required; this service only validates tokens and enforces method-level access.
- Tokens must be valid and include the expected audience (`AUTH0_AUDIENCE`).
- The service extracts the Auth0 subject (`sub`) from the token and uses it as the unique `auth0Id` when creating/fetching users.

**Database**
- Uses PostgreSQL only. JPA config uses `spring.jpa.hibernate.ddl-auto=update` in production profile.

**Deploying to Render**
1. Add environment variables in Render dashboard matching `.env.example`.
2. Set the start command (for Maven):

```bash
mvn -DskipTests package
java -jar target/userservice-0.0.1-SNAPSHOT.jar
```

3. Configure health check to `/actuator/health`.
4. Make sure your Gateway forwards the `Authorization: Bearer <token>` header to this service.

**Notes & cleanup**
- This repository was trimmed to a minimal, production-ready User service: unused controllers and legacy features were deprecated/removed; Auth0 is used as an identity provider and this service acts strictly as a resource server.

