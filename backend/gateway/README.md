# Gateway Service - Local Run Guide

## Prerequisites
- Java 17+ (or 21)
- Docker & Docker Compose

## Environment Variables (example)
SPRING_PROFILES_ACTIVE=prod
AUTH0_ISSUER_URI=https://YOUR_DOMAIN/
AUTH0_JWK_SET_URI=https://YOUR_DOMAIN/.well-known/jwks.json
SERVICE_HOST_USERS=http://userservice:8081
SERVICE_HOST_ADMIN=http://adminservice:8082
SERVICE_HOST_ACTIVITY=http://activityservice:8083
SERVICE_HOST_AI=http://aiservice:8084

## Run Locally
1. Copy `.env.example` to `.env` and fill in values.
2. Run: `docker-compose up gatewayservice`
3. Gateway will be available at http://localhost:8080

## Notes
- No Eureka or config server required.
- All config is via environment variables.
- Actuator endpoints `/actuator/health` and `/actuator/info` are public.
- All other routes require a valid Auth0 JWT.
