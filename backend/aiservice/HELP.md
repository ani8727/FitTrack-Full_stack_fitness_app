## What this service does
----------------------
The AI Service generates smart recommendations and daily fitness plans for users based on their activities and profile. It consumes events from the Activity Service (via RabbitMQ) and reads user profile data through the API Gateway.

## Architecture
------------
- controller  service  repository  model  dto
- Spring Boot + Spring WebFlux client (WebClient)
- Spring Data MongoDB for storing recommendations and daily plans
- RabbitMQ listener for activity events
- External Gemini API client for AI-generated content

## Endpoints
---------
Recommendation endpoints (backed by MongoDB):
- GET /user/{userId}  list all AI recommendations for a user
- GET /activity/{activityId}  get the recommendation for a specific activity

Daily plan endpoints:
- POST /generate/{userId}  generate (or regenerate) a daily plan for the given user and date
- GET /user/{userId}  list daily plans for a user (optionally between startDate and endDate)
- GET /user/{userId}/date/{date}  get or auto-generate a plan for a specific day
- PUT /user/{userId}/date/{date}  update/override an existing plan (admin or user-driven edits)

## How it talks to other services
------------------------------
- Uses `WebClient` configured in WebClientConfig to call the API Gateway (`API_GATEWAY_URL`).
- The Gateway then calls the User Service to fetch user profile data (age, goals, health issues, etc.).
- Activity events are received from RabbitMQ (`activity.exchange` / `ai.activity.queue`) and processed by ActivityMessageListener to create recommendations asynchronously.

## Gemini / AI integration
-----------------------
- `GeminiService` wraps calls to the external Gemini Generative API.
- `ActivityAIService` builds a detailed prompt from Activity + UserProfile and parses the AI JSON response into a Recommendation.
- `DailyPlanService` builds a daily plan prompt and parses Gemini JSON into a DailyPlan document.
- On any AI or parsing failure, the service falls back to sensible default recommendations/daily plans so clients never get a hard error.

## Environment variables (see `.env.example`)
------------------------------------------
Core:
- `PORT`  service port (default 8084)
- `SPRING_PROFILES_ACTIVE`  typically `prod` in deployed environments

Gateway / security:
- `API_GATEWAY_URL`  base URL for the Gateway (e.g. https://fittrack-gateway.onrender.com)
- `AUTH0_AUDIENCE`  expected audience for JWTs
- `AUTH0_ISSUER_URI`  Auth0 issuer URL
- `AUTH0_JWK_SET_URI`  JWKS URL for JWT verification

MongoDB:
- `SPRING_DATA_MONGODB_URI`  MongoDB connection string for AI service data
- `SPRING_DATA_MONGODB_DATABASE`  database name for recommendations/daily plans

RabbitMQ / CloudAMQP:
- `SPRING_RABBITMQ_ADDRESSES`  AMQP URL (e.g. CloudAMQP URL)
- `SPRING_RABBITMQ_USERNAME` / `SPRING_RABBITMQ_PASSWORD` / `SPRING_RABBITMQ_VIRTUAL_HOST`
- `SPRING_RABBITMQ_SSL_ENABLED`  usually `true` in hosted environments

Gemini API:
- `GEMINI_API_URL`  base URL for the Gemini API
- `GEMINI_API_KEY`  API key for Gemini

## Deploying and running
---------------------
1. Copy `.env.example` to `.env` for local/dev and fill in real connection values.
2. Build with Maven from the `backend/aiservice` folder:
   - `mvn -DskipTests package`
3. Run the jar or use the provided Dockerfile.
4. Health endpoint: `/actuator/health`.

## Notes & cleanup
---------------
- The AI Service is designed to be resilient: if User profile, Gemini, or RabbitMQ are temporarily unavailable, default recommendations/plans are returned instead of failing requests.
- All controllers are thin and delegate to services; repositories only handle MongoDB persistence, matching the overall microservice architecture used by other services.
- If you disable RabbitMQ, the `ActivityMessageListener` will simply not receive messages, but REST endpoints remain functional.
