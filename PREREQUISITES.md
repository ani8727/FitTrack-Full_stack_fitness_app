# Prerequisites (Run/Deploy)

Minimal list to get the stack running locally or in CI. Tune versions as needed, but keep services compatible.

## Core tools
- Docker + docker-compose (preferred path to run everything).
- Java 21 (if running Spring services outside Docker).
- Node 20+ and npm (if building/running frontend outside Docker).

## Infrastructure services
- Keycloak (OIDC) reachable to issue JWTs; set realm/client/issuer envs.
- MySQL (relational) and MongoDB (document) reachable with credentials.
- RabbitMQ for messaging.
- Redis for cache/session.
- Config Server + Eureka should be up before app services if you run them individually.

## Environment variables (common)
- Database: `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_DB`, `MYSQL_USER`, `MYSQL_PASSWORD`; `MONGO_HOST`, `MONGO_PORT`, `MONGO_DB`, `MONGO_USER`, `MONGO_PASSWORD` if auth enabled.
- Keycloak/OIDC: `KEYCLOAK_HOST`, `KEYCLOAK_REALM`, `KEYCLOAK_CLIENT_ID`, `KEYCLOAK_CLIENT_SECRET`, `KEYCLOAK_ISSUER_URI`.
- Messaging/cache: `RABBITMQ_HOST`, `RABBITMQ_PORT`, `RABBITMQ_USER`, `RABBITMQ_PASSWORD`; `REDIS_HOST`, `REDIS_PORT`.
- Gateway/frontend: `API_BASE_URL` (frontend), service base URLs if not using Eureka; JWT audience/issuer to match Keycloak.

## Run options
- Fast path: `docker-compose up --build` from repo root after setting `.env` values.
- Manual: start infra (MySQL, Mongo, RabbitMQ, Redis, Keycloak), then run each Spring Boot app with matching envs; run frontend with `npm install && npm run dev`.

Keep secrets out of git (.env is ignored). Update versions/hosts for your environment.
