# FitTrack – Overview

A full-stack fitness platform built as Java microservices with a React (Vite) frontend. Uses Spring Boot services for users, admin, gateway, activity, AI, config, and service discovery via Eureka. Messaging is over RabbitMQ; MySQL and MongoDB back persistence; Redis for caching/sessions. Keycloak provides auth (roles: ADMIN, USER). Everything can run locally via docker-compose with env-driven configuration.

## Architecture (high level)
- Gateway: entry point for client traffic, routes to downstream services.
- Config Server + Eureka: central config and service discovery.
- Userservice: registration, profiles, onboarding; Keycloak-linked identities.
- Adminservice: admin dashboards, user management.
- Activityservice: activity/fitness data.
- Aiservice: AI/analysis features.
- Frontend (Vite/React): dark/light UI, calls gateway APIs.
- Infrastructure: RabbitMQ (events), MySQL (relational), MongoDB (document), Redis (cache/session), Keycloak (OIDC).

## Runtime flow (simplified)
1) Client hits Gateway with JWT from Keycloak.
2) Gateway forwards to the right service; services consult Eureka for locations.
3) Userservice manages identities/profiles; Adminservice oversees user/roles; Activityservice/Aiservice handle fitness + insights.
4) Async events move over RabbitMQ; data lands in MySQL/MongoDB; Redis caches hot paths.

## How to run (brief)
- Preferred: `docker-compose up --build` with required `.env` values (see PREREQUISITES.md).
- Alternatively: start infra (MySQL, MongoDB, RabbitMQ, Redis, Keycloak), then run each Spring Boot app with matching envs, and `npm install && npm run dev` or `npm run build && npm run preview` for frontend.

## Notes
- Docs live in the Guide/ folder for deeper detail. This README stays intentionally brief for quick orientation.
