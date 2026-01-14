# FitTrack – Overview

A full-stack fitness platform built as Java microservices with a React (Vite) frontend. Uses Spring Boot services for users, admin, gateway, activity, AI, config, and service discovery via Eureka. Messaging is over RabbitMQ; PostgreSQL (Neon-ready) and MongoDB back persistence; Redis for caching/sessions. Keycloak provides auth (roles: ADMIN, USER). Everything can run locally via docker-compose with env-driven configuration.

## Deployment (Docker)

- Local infra (databases, brokers, auth): `docker compose --env-file backend/.env -f backend/docker-compose.yml up -d`. Enable optional services with profiles (e.g. `--profile keycloak`, `--profile redis`).
- Production-like stack: `docker compose --env-file backend/.env.prod -f backend/docker-compose.prod.yml up -d [--profile keycloak]` using pre-built images.
- Optional helpers: [scripts/run-local.sh](scripts/run-local.sh) (local stack) and [scripts/run-prod-sim.sh](scripts/run-prod-sim.sh) (prod-sim). Run via `bash scripts/run-local.sh` or `bash scripts/run-prod-sim.sh` and override env/profiles with `ENV_FILE`, `LOCAL_PROFILES`, or `PROD_PROFILES` as needed.
- Step-by-step: see [Guide/DEPLOYMENT_GUIDE.md](Guide/DEPLOYMENT_GUIDE.md)

## Architecture (high level)
- Gateway: entry point for client traffic, routes to downstream services.
- Config Server + Eureka: central config and service discovery.
- Userservice: registration, profiles, onboarding; Keycloak-linked identities.
- Adminservice: admin dashboards, user management.
- Activityservice: activity/fitness data.
- Aiservice: AI/analysis features.
- Frontend (Vite/React): dark/light UI, calls gateway APIs.
- Infrastructure: RabbitMQ (events), PostgreSQL (relational), MongoDB (document), Redis (cache/session), Keycloak (OIDC).

## Runtime flow (simplified)
1) Client hits Gateway with JWT from Keycloak.
2) Gateway forwards to the right service; services consult Eureka for locations.
3) Userservice manages identities/profiles; Adminservice oversees user/roles; Activityservice/Aiservice handle fitness + insights.
4) Async events move over RabbitMQ; data lands in PostgreSQL/MongoDB; Redis caches hot paths.

## How to run (brief)
- Preferred: `docker-compose up --build` with required `.env` values (see PREREQUISITES.md).
- Alternatively: start infra (PostgreSQL, MongoDB, RabbitMQ, Redis, Keycloak), then run each Spring Boot app with matching envs, and `npm install && npm run dev` or `npm run build && npm run preview` for frontend.

## Production deployment (short)
- See production compose at [backend/docker-compose.prod.yml](backend/docker-compose.prod.yml).
- Example production env template: [backend/.env.prod.example](backend/.env.prod.example).
- Secure deployment guidance: [backend/docker-compose.prod.secrets.md](backend/docker-compose.prod.secrets.md).

Notes: For production you should build and push images in CI, provide real image tags via the `*_IMAGE` environment variables, and inject secrets via a secrets manager or host-only `.env.prod` that is not checked into git.

## Neon PostgreSQL & Microservice Database Setup

### Database Isolation & Schema Rules
- Each microservice uses its own Neon PostgreSQL database and schema:
  - **user-service** → `user_db`, schema: `user_schema`
  - **admin-service** → `admin_db`, schema: `admin_schema`
- No service uses or has access to the `public` schema.
- Schema ownership is not changed; permissions are granted as needed.
- Each service is configured to use its schema via JDBC URL (`currentSchema=...`) and JPA (`hibernate.default_schema`).
- All Flyway migrations and JPA entities are schema-scoped.

### Environment Variables
- `USER_DB_USER`, `USER_DB_PASSWORD`: Credentials for user-service DB
- `ADMIN_DB_USER`, `ADMIN_DB_PASSWORD`: Credentials for admin-service DB
- `POSTGRES_URL` (optional): Override full JDBC URL if needed

### Example JDBC URLs
- User Service:  
  `jdbc:postgresql://<neon_host>:5432/user_db?sslmode=require&currentSchema=user_schema`
- Admin Service:  
  `jdbc:postgresql://<neon_host>:5432/admin_db?sslmode=require&currentSchema=admin_schema`

### JPA & Flyway
- `ddl-auto: validate` (no auto-creation in production)
- Flyway migration scripts live in `src/main/resources/db/migration/` per service and must use the correct schema.
- Example Flyway config in `application.yml`:
  ```yaml
  flyway:
    schemas: user_schema
    locations: classpath:db/migration
    baseline-on-migrate: true
  ```

### Security & Service Boundaries
- User service cannot access admin DB or schema, and vice versa.
- All sensitive credentials are injected via environment variables.
- No passwords or secrets are committed to source control.

### Running Locally
- Ensure Neon DBs and schemas exist and users have correct privileges.
- Set all required environment variables before starting services.
- On first run, Flyway will migrate schemas automatically.

---

For more, see the Guide/ and backend/configserver/config/*.yml for service-specific config examples.
