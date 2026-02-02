# FitTrack API Gateway — HELP

What this gateway does
- Acts as the single public entry point for FitTrack microservices.
- Enforces JWT validation (Auth0) and forwards authenticated requests to backend services.
- Applies CORS policy for the frontend and strips the `/api` prefix when forwarding.

Architecture diagram (text)
- Client (browser) → Render (public) → FitTrack API Gateway → { userservice, adminservice, activityservice }

How routing works
- Incoming requests use paths under `/api`:
  - `/api/users/**` → `userservice`
  - `/api/admin/**` → `adminservice`
  - `/api/activity/**` → `activityservice`
- Gateway strips the `/api` prefix and forwards to logical service names using `lb://` (service discovery / load balancer).

JWT flow
- Client obtains JWT from Auth0 (OIDC) and sends Authorization: Bearer <token>.
- Gateway validates JWT (issuer from `AUTH0_DOMAIN`, audience from `AUTH0_AUDIENCE`).
- Gateway rejects requests without valid JWT (except `/actuator/health` and `/public/**`).
- Gateway extracts claims and forwards user identity via headers: `X-User-Id`, `X-User-Email`, `X-User-Role`.

How it talks to backend services
- Gateway forwards authenticated requests to logical service names (`lb://userservice`, etc.).
- Backends trust the gateway and should not perform JWT validation again.

Required environment variables (in `backend/gateway/.env` or Render settings)
- `AUTH0_DOMAIN` (example: your-domain.auth0.com)
- `AUTH0_AUDIENCE` (API audience configured in Auth0)
- `FRONTEND_URL` (allowed origin)
- Optional: `PORT` (Render supplies this automatically)

Deploying on Render (summary)
1. Create a new Web Service on Render. Use Dockerfile or Maven build.
2. Add environment variables: `AUTH0_DOMAIN`, `AUTH0_AUDIENCE`, `FRONTEND_URL`.
3. Set `PORT` (Render provides automatically). Deploy.

Frontend connection
- Frontend calls gateway at `https://<gateway-url>/api/...` and includes `Authorization: Bearer <jwt>`.

Notes
- Gateway is stateless: no sessions, no login endpoints, no secrets stored.
- CORS is handled only by the gateway. Remove CORS config from downstream services.
