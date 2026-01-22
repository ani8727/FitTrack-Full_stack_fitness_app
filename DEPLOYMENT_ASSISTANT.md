You are a Senior DevOps Engineer responsible for preparing this repository for full cloud deployment.

This repository contains a distributed microservices system called **FitTrack** with:
- Spring Boot microservices
- Spring Cloud API Gateway
- React frontend
- MongoDB Atlas
- Neon PostgreSQL
- CloudAMQP (RabbitMQ)
- Auth0 OAuth
- Gemini AI API

Your task is to convert this GitHub repository into a **cloud-ready production system**.

Follow the steps in the exact order below and modify the code where required.

---

# STEP 1 — ENVIRONMENT NORMALIZATION

Scan all backend services and:

1. Replace all hardcoded:
   - database URLs
   - RabbitMQ URLs
   - API keys
   - Auth0 URLs
with **environment variables** using Spring Boot standard syntax.

2. Ensure every service has:
   - application.yml
   - .env.example

Example format:
SPRING_DATASOURCE_URL=
SPRING_DATA_MONGODB_URI=
SPRING_RABBITMQ_URI=
AUTH0_ISSUER_URI=
GEMINI_API_KEY=


---

# STEP 2 — DOCKERIZATION

For **each backend microservice and the API Gateway**:

1. Generate a production-grade `Dockerfile`
2. Ensure:
   - Java 17 or Java 21
   - multi-stage build
   - no dev dependencies
   - port exposed correctly

Then generate:
docker-compose.yml

that runs:
- Gateway
- User Service
- Activity Service
- AI Service
- Admin Service

using environment variables only.

---

# STEP 3 — MICROSERVICE DISCOVERY FIX

Because Render does not support Eureka:
- Remove all service discovery logic
- Replace all internal service calls with:
${USER_SERVICE_URL}
${ACTIVITY_SERVICE_URL}
${AI_SERVICE_URL}
${ADMIN_SERVICE_URL}


Update:
- Gateway routes
- Feign clients
- WebClient calls

---

# STEP 4 — AUTH0 SECURITY HARDENING

Verify:
- JWT validation
- CORS
- OAuth audience
- Scope-based access

Ensure:
- Gateway blocks unauthorized traffic
- Services trust only gateway tokens

---

# STEP 5 — EVENT BUS CONFIGURATION

Ensure RabbitMQ:
- Has durable queues
- Has retry logic
- Has dead-letter queues

Verify:
- Activity → AI pipeline is async
- No blocking HTTP calls exist

---

# STEP 6 — FRONTEND PRODUCTION CONFIG

Create:
.env.production

Set:
VITE_API_URL
VITE_AUTH0_DOMAIN
VITE_AUTH0_CLIENT_ID
VITE_AUTH0_AUDIENCE


Ensure:
- No localhost remains anywhere

---

# STEP 7 — CLOUD READINESS CHECK

Run checks for:
- Port binding
- Health endpoints
- Actuator enabled
- Logging to STDOUT
- No file system writes

---

# STEP 8 — RENDER DEPLOYMENT FILES

Generate:
- render.yaml
or deployment notes for:
- gateway
- userservice
- activityservice
- aiservice
- adminservice

Each service must:
- build from Dockerfile
- inject env vars
- expose correct port

---

# STEP 9 — FINAL VALIDATION

Produce:
1. A list of all environment variables required
2. Deployment order
3. Service URL wiring map
4. How to verify production works

---

# Output rules:
- Modify real files in this repo
- Create missing files
- Use production best practices
- No mock data
- No localhost
- Treat this as a real SaaS launch