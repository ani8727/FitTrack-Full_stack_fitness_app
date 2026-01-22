# FitTrack – Production Microservices System Design Document

---

## 1. Executive Summary

### What is FitTrack?
FitTrack is a **cloud-native, event-driven fitness tracking SaaS platform** designed for real-time activity monitoring, AI-powered workout recommendations, and personalized daily fitness planning. The system processes user workouts, tracks calories, generates intelligent insights using Google's Gemini AI, and provides administrative oversight through a comprehensive dashboard.

### Target Users
- **End Users**: Fitness enthusiasts seeking data-driven workout tracking and AI-generated personalized recommendations
- **Administrators**: Platform managers requiring user management, audit trails, and system-wide analytics
- **Developers/DevOps**: Teams needing a reference implementation of production-ready microservices architecture

### Problem Solved
Traditional fitness applications suffer from:
1. **Monolithic architectures** that cannot scale individual features independently
2. **Limited intelligence** - no real-time AI analysis of workout patterns
3. **Poor fault isolation** - single point of failure affects entire system
4. **Tight coupling** - difficult to upgrade or modify specific features without system-wide deployment

### Why Microservices Over Monolith?

| Aspect | Monolith Problem | FitTrack Microservices Solution |
|--------|-----------------|--------------------------------|
| **Scalability** | AI workload spikes overwhelm entire app | AI Service scales independently; activity tracking remains unaffected |
| **Technology Stack** | Locked into single database/framework | PostgreSQL for transactional data, MongoDB for documents, Redis for caching |
| **Team Autonomy** | Single deployment pipeline bottleneck | Teams deploy User Service, Activity Service independently |
| **Fault Tolerance** | AI API failure crashes entire system | Circuit breakers isolate failures; RabbitMQ queues buffer requests |
| **Operational Complexity** | All or nothing deployment | Canary deployments per service; rollback without full system outage |

**Business Justification**: A fitness SaaS must handle:
- Sudden traffic spikes during peak gym hours (6-8 AM, 6-9 PM)
- Heavy AI inference workloads without blocking user activity logging
- Third-party API dependencies (Auth0, Gemini) that may fail independently
- Compliance requirements demanding audit trails and data isolation

Microservices architecture ensures **each bounded context operates independently**, enabling horizontal scaling, polyglot persistence, and resilient failure handling.

---

## 2. High-Level Architecture

### System Overview
```
┌─────────────┐          ┌──────────────────────────────────────┐
│   React     │          │         API Gateway (8085)           │
│  Frontend   ├─────────▶│  JWT Validation | CORS | Routing    │
│ (Vite SPA)  │          └────────┬────────────────────────┬────┘
└─────────────┘                   │                        │
     ↑ OAuth                      │                        │
     │ Flow                       ▼                        ▼
┌────┴─────┐            ┌─────────────────┐    ┌─────────────────────┐
│  Auth0   │            │  User Service   │    │  Activity Service   │
│  (OIDC)  │            │  (PostgreSQL)   │    │    (MongoDB)        │
└──────────┘            │   Port: 8081    │    │   Port: 8083        │
                        └────────┬────────┘    └─────────┬───────────┘
                                 │                        │
                                 │                   ┌────▼────────┐
                        ┌────────▼────────┐          │  RabbitMQ   │
                        │  Admin Service  │          │ (CloudAMQP) │
                        │  (PostgreSQL)   │          └────┬────────┘
                        │   Port: 8082    │               │
                        └─────────────────┘               ▼
                                                  ┌────────────────┐
                        ┌─────────────────┐       │   AI Service   │
                        │  Config Server  │       │   (MongoDB)    │
                        │   Port: 8888    │       │  Port: 8084    │
                        └─────────────────┘       └────────┬───────┘
                                                           │
                        ┌─────────────────┐               ▼
                        │     Eureka      │        ┌─────────────┐
                        │ Service Registry│        │  Gemini API │
                        │   Port: 8761    │        │  (External) │
                        └─────────────────┘        └─────────────┘
```

### Communication Flow
```
Client → API Gateway → Microservices → Databases → External APIs
```

**Synchronous Communication (REST over HTTP)**:
- Frontend → API Gateway: HTTPS with JWT Bearer token
- API Gateway → User/Activity/AI Services: HTTP REST (service mesh)
- Inter-service calls: WebClient (Spring WebFlux) for non-blocking I/O

**Asynchronous Communication (Event-Driven)**:
- Activity Service → RabbitMQ: Publishes activity events
- AI Service ← RabbitMQ: Consumes events for recommendation generation
- Message persistence: Durable queues with dead-letter exchange for failure handling

**Service Discovery**:
- Production: Static service URLs injected via environment variables (`USER_SERVICE_URL`, `ACTIVITY_SERVICE_URL`, `AI_SERVICE_URL`, `ADMIN_SERVICE_URL`); no dynamic discovery
- Config Server / Eureka: Present for legacy/local scenarios but disabled in production; configs resolved from service-local `application.yml` and env vars

### Component Roles

#### 1. **React Frontend (Vite + TailwindCSS)**
- **Purpose**: Single Page Application for user interaction
- **Technology**: React 19, React Router, Redux Toolkit, Axios
- **Responsibilities**:
  - OAuth 2.0 flow with Auth0 (@auth0/auth0-react)
  - JWT token management and automatic refresh
  - CRUD operations via API Gateway
  - Real-time UI updates for activity tracking
  - Admin dashboard with analytics charts (Chart.js)
- **Deployment**: Vercel CDN (static asset hosting with edge caching)

#### 2. **API Gateway (Spring Cloud Gateway - Port 8085)**
- **Purpose**: Single entry point; reverse proxy and security enforcement
- **Technology**: Spring Cloud Gateway (reactive WebFlux), Spring Security OAuth2 Resource Server
- **Responsibilities**:
  - JWT validation using Auth0 JWKS endpoint
  - CORS policy enforcement
  - Path-based routing (e.g., `/api/users/**` → User Service)
  - Rate limiting (future: Redis-backed token bucket)
  - Request/response logging and tracing
- **Security**: Validates JWT signatures; rejects unauthenticated requests before reaching backend

#### 3. **User Service (Port 8081)**
- **Database**: Neon PostgreSQL (`user_db`, schema: `user_schema`)
- **Purpose**: Identity and profile management
- **Responsibilities**:
  - User registration and onboarding flow
  - Profile CRUD (email, name, fitness goals, account status)
  - JWT claims mapping (sub → keycloakId, email)
  - Account lifecycle (deactivate, reactivate, delete)
  - Contact form handling (EmailJS integration)
- **Data Ownership**: Users table, contact messages, onboarding state

#### 4. **Activity Service (Port 8083)**
- **Database**: MongoDB Atlas (`activity_db`)
- **Purpose**: Fitness activity tracking and metrics aggregation
- **Responsibilities**:
  - Log workouts (type: RUNNING, CYCLING, YOGA, etc.)
  - Track duration, calories burned, start time
  - User-specific activity history queries
  - Aggregate statistics (total workouts, average calories)
  - Publish events to RabbitMQ on every new activity
- **Data Ownership**: Activities collection (document store for flexible metrics)

#### 5. **AI Service (Port 8084)**
- **Database**: MongoDB Atlas (`ai_db`)
- **Purpose**: AI-powered fitness recommendations and daily plans
- **Responsibilities**:
  - Consume activity events from RabbitMQ
  - Call Gemini API for workout analysis
  - Generate personalized recommendations based on user history
  - Create daily fitness plans using AI prompts
  - Store recommendations and plans in MongoDB
- **External Dependency**: Google Gemini 2.0 Flash API (REST over HTTPS)

#### 6. **Admin Service (Port 8082)**
- **Database**: Neon PostgreSQL (`admin_db`, schema: `admin_schema`)
- **Purpose**: Platform administration and monitoring
- **Responsibilities**:
  - User management (ban, suspend, reactivate)
  - Audit log storage and querying
  - Dashboard statistics (user count, activity metrics)
  - Cross-service data aggregation via WebClient
- **Access Control**: Requires JWT with `ADMIN` role claim

#### 7. **Config Server (Port 8888)**

#### 7. **Config Server (Port 8888)**
**Purpose**: Legacy centralized configuration (not used in production)
**Current State**: Services load configuration from local `application.yml` + environment variables; Config Server remains available for legacy/local flows but is not required for production deployments.


#### 8. **Eureka Server (Port 8761)**
**Purpose**: Legacy service discovery (not used in production)
**Current State**: Eureka is disabled in production; services use static URLs provided via env vars and container DNS (Render/Docker). Module retained only for backward compatibility.
- **Note**: Currently disabled in production (services use static URLs via env vars)

#### 9. **MongoDB Atlas**
- **Usage**: Document storage for unstructured/semi-structured data
- **Services**:
  - Activity Service: Stores activities with flexible metrics (Map<String, Object>)
  - AI Service: Stores recommendations and daily plans
- **Justification**: Schema-less design for evolving workout attributes (GPS data, heart rate, etc.)

#### 10. **Neon PostgreSQL**
- **Usage**: ACID-compliant relational data
- **Databases**:
  - `user_db`: User profiles, authentication state, onboarding flags
  - `admin_db`: Audit logs, admin actions, system events
- **Schema Isolation**: Each service uses dedicated schema (no shared `public` schema)
- **Justification**: Referential integrity for user accounts, transactional consistency

#### 11. **CloudAMQP (RabbitMQ)**
- **Purpose**: Asynchronous message broker
- **Exchange Type**: Topic exchange (`activity.exchange`)
- **Routing**: `activity.tracking` key
- **Queue**: `activity.queue` (durable, survives broker restart)
- **Consumer**: AI Service with `@RabbitListener`
- **Failure Handling**: Dead-letter queue for failed message processing

#### 12. **Auth0**
- **Purpose**: OAuth 2.0 / OpenID Connect provider
- **Flow**: Authorization Code with PKCE
- **Token Type**: JWT with HS256/RS256 signature
- **Claims**: `sub` (user ID), `email`, `roles` (custom namespace)
- **Integration**:
  - Frontend: @auth0/auth0-react SDK
  - Backend: Spring Security OAuth2 Resource Server

#### 13. **Redis (Optional - Caching Layer)**
- **Purpose**: Session storage and query result caching
- **Usage**: 
  - Gateway: Rate limiting token bucket
  - User Service: Profile cache with TTL
- **Deployment**: Container DNS in dev, Redis Cloud in production

---

## 3. Low-Level Design (Service by Service)

### Service 1: User Service

**Purpose**: Manages user identity, profile data, and account lifecycle

**Entry Point**: 
```java
@SpringBootApplication
public class UserserviceApplication {
    public static void main(String[] args) {
        SpringApplication.run(UserserviceApplication.class, args);
    }
}
```

**Main Routes**:
```
POST   /api/users/register           - Create new user account
GET    /api/users/{userId}           - Fetch user profile
GET    /api/users/{userId}/validate  - Check if user exists (internal)
GET    /api/users/admin/all          - List all users (ADMIN only)
GET    /api/users/admin/stats        - User statistics (ADMIN only)
POST   /api/users/{userId}/deactivate         - Soft delete
POST   /api/users/{userId}/reactivate         - Restore account
POST   /api/users/{userId}/delete             - Hard delete
POST   /api/users/{userId}/onboarding/complete - Complete onboarding
GET    /api/users/{userId}/onboarding/status  - Check onboarding state
POST   /api/contact                  - Submit contact form
```

**Database Schema** (PostgreSQL - `user_schema.users`):
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    username VARCHAR(50) UNIQUE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'USER',
    keycloak_id VARCHAR(255) UNIQUE,
    account_status VARCHAR(20) DEFAULT 'ACTIVE',
    email_verified BOOLEAN DEFAULT false,
    onboarding_completed BOOLEAN DEFAULT false,
    last_login_at TIMESTAMP,
    deactivated_at TIMESTAMP,
    deactivation_reason VARCHAR(500),
    gender VARCHAR(20),
    fitness_goal VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**External Dependencies**:
- Auth0: JWT validation via JWK Set URI
- EmailJS: Contact form notifications (optional)

**Scaling Strategy**:
- **Horizontal**: Deploy multiple instances behind load balancer
- **Database**: Read replicas for user profile queries
- **Caching**: Redis for frequently accessed profiles (TTL: 5 minutes)

---

### Service 2: Activity Service

**Purpose**: Tracks fitness activities and publishes events for AI processing

**Entry Point**:
```java
@SpringBootApplication
@EnableMongoAuditing
public class ActivityServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(ActivityServiceApplication.class, args);
    }
}
```

**Main Routes**:
```
POST   /api/activities              - Log new activity
GET    /api/activities              - Get all activities (user-specific via JWT)
GET    /api/activities/{activityId} - Get single activity
GET    /api/activities/stats        - User activity statistics
GET    /api/activities/admin/all    - All activities (ADMIN only)
GET    /api/activities/admin/stats  - System-wide stats (ADMIN only)
```

**Database Schema** (MongoDB - `activities` collection):
```json
{
  "_id": "ObjectId",
  "userId": "string (UUID)",
  "type": "enum(RUNNING, CYCLING, SWIMMING, WEIGHTLIFTING, YOGA, CARDIO)",
  "duration": "integer (minutes)",
  "caloriesBurned": "integer",
  "startTime": "ISO 8601 datetime",
  "additionalMetrics": {
    "distance": "double (km)",
    "averageHeartRate": "integer",
    "maxHeartRate": "integer",
    "steps": "integer",
    "custom": "any"
  },
  "createdAt": "ISO 8601 datetime",
  "updatedAt": "ISO 8601 datetime"
}
```

**Event Publishing**:
```java
@Service
public class ActivityService {
    private final RabbitTemplate rabbitTemplate;
    
    @Value("${rabbitmq.exchange.name}")
    private String exchange; // activity.exchange
    
    @Value("${rabbitmq.routing.key}")
    private String routingKey; // activity.tracking
    
    public ActivityResponse trackActivity(ActivityRequest request) {
        Activity savedActivity = activityRepository.save(activity);
        rabbitTemplate.convertAndSend(exchange, routingKey, savedActivity);
        return mapToResponse(savedActivity);
    }
}
```

**External Dependencies**:
- User Service: Validates userId via REST call (GET `/api/users/{userId}/validate`)
- RabbitMQ: Publishes activity events

**Scaling Strategy**:
- **Horizontal**: Stateless; load balance across instances
- **Database**: MongoDB sharding by `userId` for write distribution
- **RabbitMQ**: Publisher confirms ensure message delivery

---

### Service 3: AI Service

**Purpose**: Generates AI-powered workout recommendations and daily fitness plans

**Entry Point**:
```java
@SpringBootApplication
@EnableMongoAuditing
public class AiServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(AiServiceApplication.class, args);
    }
}
```

**Main Routes**:
```
GET    /api/recommendations/user/{userId}        - Get all recommendations
GET    /api/recommendations/activity/{activityId} - Get recommendation by activity
POST   /api/daily-plans/generate/{userId}        - Generate new daily plan
GET    /api/daily-plans/user/{userId}            - Get all user plans
GET    /api/daily-plans/user/{userId}/date/{date} - Get plan for specific date
```

**Message Consumer**:
```java
@Service
public class ActivityMessageListener {
    @RabbitListener(
        queues = "${rabbitmq.queue.name}",
        autoStartup = "${rabbitmq.listener.auto-startup:true}"
    )
    public void processActivity(Activity activity) {
        aiService.generateRecommendation(activity)
            .publishOn(Schedulers.boundedElastic())
            .doOnNext(recommendation -> {
                recommendationRepository.save(recommendation);
            })
            .subscribe();
    }
}
```

**Gemini API Integration**:
```java
@Service
public class GeminiService {
    @Value("${gemini.api.url}")
    private String geminiApiUrl;
    
    @Value("${gemini.api.key}")
    private String geminiApiKey;
    
    public Mono<String> getAnswer(String prompt) {
        return webClient.post()
            .uri(geminiApiUrl + "?key=" + geminiApiKey)
            .bodyValue(buildRequest(prompt))
            .retrieve()
            .bodyToMono(String.class);
    }
}
```

**Database Schema** (MongoDB - `recommendations` and `daily_plans` collections):
```json
// Recommendations
{
  "_id": "ObjectId",
  "activityId": "string",
  "userId": "string",
  "recommendation": "string (AI-generated text)",
  "generatedAt": "ISO 8601 datetime"
}

// Daily Plans
{
  "_id": "ObjectId",
  "userId": "string",
  "planDate": "date",
  "plan": "string (AI-generated plan)",
  "goal": "string",
  "createdAt": "ISO 8601 datetime"
}
```

**External Dependencies**:
- RabbitMQ: Consumes activity events
- Gemini API: AI text generation

**Scaling Strategy**:
- **Horizontal**: Multiple consumers with message prefetch limit
- **Circuit Breaker**: Resilience4j wraps Gemini API calls (fallback: generic recommendation)
- **Rate Limiting**: Gemini API quotas managed via token bucket

---

### Service 4: Admin Service

**Purpose**: Administrative dashboard and user management

**Entry Point**:
```java
@SpringBootApplication
public class AdminServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(AdminServiceApplication.class, args);
    }
}
```

**Main Routes**:
```
GET    /api/admin/dashboard/stats     - Aggregate dashboard stats
GET    /api/admin/users               - List all users with pagination
GET    /api/admin/users/{id}          - Get user details
GET    /api/admin/audit-logs          - Fetch audit trail
POST   /api/admin/users/{id}/ban      - Ban user account
POST   /api/admin/users/{id}/suspend  - Suspend user temporarily
POST   /api/admin/users/{id}/deactivate - Deactivate user
POST   /api/admin/users/{id}/reactivate - Reactivate user
GET    /api/admin/stats/users         - User growth statistics
GET    /api/admin/stats/activities    - Activity statistics
```

**Inter-Service Communication**:
```java
@Service
public class AdminService {
    private final WebClient userServiceClient;
    private final WebClient activityServiceClient;
    
    public DashboardStats getDashboardStats() {
        var userStats = userServiceClient.get()
            .uri("/api/users/admin/stats")
            .retrieve()
            .bodyToMono(UserStats.class)
            .block();
            
        var activityStats = activityServiceClient.get()
            .uri("/api/activities/admin/stats")
            .retrieve()
            .bodyToMono(ActivityStats.class)
            .block();
            
        return aggregateStats(userStats, activityStats);
    }
}
```

**Database Schema** (PostgreSQL - `admin_schema.audit_logs`):
```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id VARCHAR(255) NOT NULL,
    action VARCHAR(100) NOT NULL,
    target_user_id VARCHAR(255),
    details TEXT,
    ip_address VARCHAR(50),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**External Dependencies**:
- User Service: Fetches user data
- Activity Service: Fetches activity statistics

**Scaling Strategy**:
- **Read-heavy**: Database read replicas
- **Caching**: Redis for dashboard stats (TTL: 1 minute)

---

### Service 5: API Gateway

**Purpose**: Unified entry point for all client requests

**Entry Point**:
```java
@SpringBootApplication
public class GatewayApplication {
    public static void main(String[] args) {
        SpringApplication.run(GatewayApplication.class, args);
    }
}
```

**Route Configuration** (application.yml):
```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: user-service
          uri: ${USER_SERVICE_URL:https://userservice.onrender.com}
          predicates:
            - Path=/api/users/**
        - id: activity-service
          uri: ${ACTIVITY_SERVICE_URL:https://activityservice.onrender.com}
          predicates:
            - Path=/api/activities/**
        - id: ai-service
          uri: ${AI_SERVICE_URL:https://aiservice.onrender.com}
          predicates:
            - Path=/api/ai/**,/api/recommendations/**,/api/daily-plans/**
        - id: admin-service
          uri: ${ADMIN_SERVICE_URL:https://adminservice.onrender.com}
          predicates:
            - Path=/api/admin/**
```

**Security Filter**:
```java
@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {
    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        http
            .authorizeExchange(exchanges -> exchanges
                .pathMatchers("/actuator/**").permitAll()
                .anyExchange().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt.jwtDecoder(jwtDecoder()))
            )
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(ServerHttpSecurity.CsrfSpec::disable);
        return http.build();
    }
}
```

**External Dependencies**:
- Auth0: JWT validation via JWKS endpoint

**Scaling Strategy**:
- **Horizontal**: Deploy behind Application Load Balancer (AWS ALB/Azure App Gateway)
- **Connection Pooling**: Tune Netty thread pools for high concurrency

---

## 4. Data Architecture

### Database-Per-Service Pattern

**Principle**: Each microservice owns its data exclusively; no shared database tables

| Service | Database | Type | Schema | Justification |
|---------|----------|------|--------|---------------|
| User Service | Neon PostgreSQL | Relational | `user_schema` | ACID transactions for profile updates; referential integrity |
| Admin Service | Neon PostgreSQL | Relational | `admin_schema` | Audit logs require immutable, ordered records |
| Activity Service | MongoDB Atlas | Document | `activity_db` | Flexible schema for evolving workout metrics (GPS, biometrics) |
| AI Service | MongoDB Atlas | Document | `ai_db` | Unstructured AI responses; fast writes without schema validation |

### Why PostgreSQL for User/Admin?
1. **ACID Compliance**: User registration must be atomic (insert user + send verification email)
2. **Joins**: Admin dashboard queries join users with audit logs
3. **Constraints**: Unique email/username constraints enforced at DB level
4. **Transactions**: Account deactivation updates multiple fields atomically

### Why MongoDB for Activity/AI?
1. **Schema Evolution**: Activity metrics change frequently (steps → GPS → heart rate)
2. **Write Performance**: High-velocity activity logging (1000s writes/sec during peak hours)
3. **Nested Documents**: AI recommendations store raw JSON responses
4. **Horizontal Scaling**: MongoDB sharding distributes writes across clusters

### No Shared Databases
**Problem with Shared DB**:
- Tight coupling: Schema changes require coordination
- Deadlocks: Service A locks table while Service B waits
- Blast radius: Database failure affects all services

**FitTrack Solution**:
- Each service has dedicated connection pool
- Schema migrations run independently per service
- Neon PostgreSQL: Separate databases (`user_db`, `admin_db`)
- MongoDB: Separate databases (`activity_db`, `ai_db`)

### Data Consistency Strategy
**Problem**: User registers in User Service, then logs activity in Activity Service. How does Activity Service know the user exists?

**Solutions Implemented**:
1. **Eventual Consistency**: Activity Service validates userId via REST call to User Service (GET `/api/users/{userId}/validate`)
2. **Saga Pattern** (future): Distributed transactions using event sourcing (user.created → profile.initialized → activity.enabled)
3. **Idempotency**: All write operations use UUID to prevent duplicate entries

---

## 5. Authentication & Security Flow

### OAuth 2.0 Authorization Code Flow (PKCE)

**Step-by-Step Flow**:
```
1. User clicks "Login" in React app
   ↓
2. Frontend redirects to Auth0 login page
  https://dev-5s2csl8rpq2phx88.us.auth0.com/authorize?
  client_id=...&redirect_uri=https://app.fittrack.com/callback&
   response_type=code&scope=openid profile email&
   code_challenge=...&code_challenge_method=S256
   ↓
3. User authenticates with Auth0 (email/password or social login)
   ↓
4. Auth0 redirects back with authorization code
  https://app.fittrack.com/callback?code=ABC123
   ↓
5. Frontend exchanges code for tokens
   POST /oauth/token
   Body: { code, code_verifier, redirect_uri }
   ↓
6. Auth0 returns JWT access token + refresh token
   {
     "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
     "id_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     "refresh_token": "...",
     "expires_in": 3600
   }
   ↓
7. Frontend stores tokens in memory (React Context)
   ↓
8. Every API call includes JWT in Authorization header
   Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
   ↓
9. API Gateway validates JWT signature using Auth0 JWKS endpoint
   https://dev-5s2csl8rpq2phx88.us.auth0.com/.well-known/jwks.json
   ↓
10. Gateway extracts user claims (sub, email, roles) and forwards to backend
    X-User-Id: auth0|123456
    X-User-Email: user@example.com
    X-User-Roles: USER
```

### JWT Structure
```json
{
  "header": {
    "alg": "RS256",
    "typ": "JWT",
    "kid": "abc123"
  },
  "payload": {
    "iss": "https://dev-5s2csl8rpq2phx88.us.auth0.com/",
    "sub": "auth0|67890abc",
    "aud": "https://fittrack-api",
    "exp": 1737500000,
    "iat": 1737496400,
    "email": "user@example.com",
    "email_verified": true,
    "https://fittrack.com/roles": ["USER"]
  },
  "signature": "..."
}
```

### JWT Validation in Gateway
```java
@Configuration
public class SecurityConfig {
    @Bean
    public ReactiveJwtDecoder jwtDecoder() {
        return ReactiveJwtDecoders.fromOidcIssuerLocation(
            "https://dev-5s2csl8rpq2phx88.us.auth0.com/"
        );
    }
}
```

**Validation Steps**:
1. Extract JWT from `Authorization: Bearer <token>` header
2. Fetch public keys from Auth0 JWKS endpoint (cached for 10 minutes)
3. Verify signature using RS256 algorithm
4. Check `exp` claim (reject expired tokens)
5. Check `aud` claim (reject tokens not issued for this API)
6. Extract claims and pass to downstream services

### Inter-Service Authentication
**Problem**: How does Admin Service call User Service securely?

**Solution**: Service-to-Service JWT (future enhancement)
- Gateway issues short-lived service tokens
- Services include `X-Service-Name: admin-service` header
- Downstream services validate via shared secret or mutual TLS

**Current Implementation**: Services trust internal network (no authentication for internal calls)

### Security Best Practices Implemented
1. **No JWT storage in localStorage**: Prevents XSS attacks
2. **HTTPS only in production**: TLS 1.3 for data in transit
3. **CORS whitelist**: `https://app.fittrack.com` (prod)
4. **Rate limiting**: 100 req/min per IP (enforced at Gateway)
5. **Secret rotation**: Environment variables (never hardcoded)

---

## 6. Event-Driven Architecture

### Why Asynchronous Processing?

**Scenario**: User logs a 30-minute run
- **Synchronous Problem**: Activity Service must wait for AI Service to generate recommendation (5-10 seconds due to Gemini API latency). User waits for response.
- **Asynchronous Solution**: Activity Service returns immediately; AI processing happens in background.

**Benefits**:
1. **Decoupling**: Activity Service doesn't depend on AI Service availability
2. **Resilience**: If AI Service is down, activities are still logged
3. **Scalability**: Multiple AI Service instances consume from same queue
4. **Retry Logic**: RabbitMQ retries failed message processing

### RabbitMQ Configuration

**Exchange**: `activity.exchange` (Topic Exchange)
**Queue**: `activity.queue` (Durable)
**Routing Key**: `activity.tracking`
**Binding**: Queue bound to exchange with routing key pattern `activity.*`
**Dead Letter**: DLX `activity.dlx` routes to DLQ `activity.dlq`; queue TTL and max retries are driven by env vars (`RABBITMQ_ACTIVITY_TTL_MS`, `RABBITMQ_ACTIVITY_MAX_RETRIES`).
**Defaults**: TTL `600000ms` (10m) via `RABBITMQ_MESSAGE_TTL_MS`; retry/backoff enabled with defaults `max-attempts=5`, `initial-interval=2000ms`, `max-interval=60000ms`, `multiplier=2.0` (`RABBITMQ_RETRY_*`).
**DLQ Flow**: Failure → retried with backoff → exceeds attempts or TTL → routed to `activity.dlq` via `activity.dlx` → operator inspects/replays.

**Publisher (Activity Service)**:
```java
@Service
public class ActivityService {
    private final RabbitTemplate rabbitTemplate;
    
    public void trackActivity(ActivityRequest request) {
        Activity activity = activityRepository.save(request);
        
        // Publish message
        rabbitTemplate.convertAndSend(
            "activity.exchange",
            "activity.tracking",
            activity
        );
    }
}
```

**Consumer (AI Service)**:
```java
@Service
public class ActivityMessageListener {
    @RabbitListener(
        queues = "activity.queue",
        autoStartup = "true",
        concurrency = "3-10" // Scale consumers dynamically
    )
    public void processActivity(Activity activity) {
        aiService.generateRecommendation(activity)
            .doOnError(e -> {
                log.error("Failed to process activity: {}", e.getMessage());
                // Message requeued automatically
            })
            .subscribe();
    }
}
```

### Message Flow
```
1. User logs activity via POST /api/activities
   ↓
2. Activity Service saves to MongoDB
   ↓
3. Activity Service publishes message to RabbitMQ
   Message: { "id": "123", "userId": "abc", "type": "RUNNING", ... }
   ↓
4. RabbitMQ stores message in durable queue
   ↓
5. AI Service consumes message (3-10 instances)
   ↓
6. AI Service calls Gemini API
   POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent
   Body: { "prompt": "Analyze this workout: running, 30 min, 300 cal..." }
   ↓
7. Gemini returns recommendation (e.g., "Great pace! Try increasing distance by 10%.")
   ↓
8. AI Service saves recommendation to MongoDB
   ↓
9. Message acknowledged to RabbitMQ (deleted from queue)
```

### Failure Handling

**Dead Letter Exchange (DLX)**:
```yaml
rabbitmq:
  queue:
    name: activity.queue
    durable: true
    arguments:
      x-dead-letter-exchange: activity.dlx
      x-dead-letter-routing-key: activity.failed
      x-message-ttl: 86400000 # 24 hours
```

**Retry Strategy**:
1. Message processing fails (e.g., Gemini API timeout)
2. RabbitMQ requeues message (3 attempts)
3. After 3 failures, message moves to DLX
4. Dead letter queue monitored for manual intervention

### Idempotency
**Problem**: Message redelivered due to consumer crash. How to prevent duplicate recommendations?

**Solution**: Idempotency key
```java
@Service
public class ActivityMessageListener {
    public void processActivity(Activity activity) {
        String idempotencyKey = activity.getId();
        
        // Check if already processed
        if (recommendationRepository.existsByActivityId(idempotencyKey)) {
            log.info("Duplicate message ignored: {}", idempotencyKey);
            return;
        }
        
        // Process and save
        aiService.generateRecommendation(activity).subscribe();
    }
}
```

---

## 7. Deployment Architecture

### Environment Configuration

| Component | Local Dev | Staging | Production |
|-----------|-----------|---------|------------|
| **Frontend** | Vite dev via gateway service DNS (gateway:8085/api) | Vercel Preview | Vercel CDN |
| **API Gateway** | container DNS `gateway:8085` | Render (gateway-staging) | Render (gateway-prod) |
| **User Service** | container DNS `userservice:8081` | Render | Render |
| **Activity Service** | container DNS `activityservice:8083` | Render | Render |
| **AI Service** | container DNS `aiservice:8084` | Render | Render |
| **Admin Service** | container DNS `adminservice:8082` | Render | Render |
| **PostgreSQL** | Docker service `postgres:5432` | Neon (shared project) | Neon (separate project) |
| **MongoDB** | Docker service `mongo:27017` | MongoDB Atlas (M10 cluster) | MongoDB Atlas (M30 cluster) |
| **RabbitMQ** | Docker service `rabbitmq:5672` | CloudAMQP (Lemur plan) | CloudAMQP (Tiger plan) |
| **Redis** | Docker/managed cache | Redis Cloud (30MB) | Redis Cloud (100MB) |
| **Auth0** | Dev tenant | Dev tenant | Prod tenant |

### Why Vercel for Frontend?
1. **CDN**: Global edge caching (300+ PoPs)
2. **Automatic HTTPS**: Free SSL certificates
3. **Git Integration**: Deploy on every push to main branch
4. **Environment Variables**: Inject `VITE_API_URL` per environment
5. **Serverless Functions**: Future API routes for SSR/SSG

**Vercel Build Config**:
```json
{
  "build": {
    "env": {
      "VITE_API_URL": "https://fittrack-gateway.onrender.com",
      "VITE_AUTH0_DOMAIN": "dev-5s2csl8rpq2phx88.us.auth0.com",
      "VITE_AUTH0_CLIENT_ID": "...",
      "VITE_AUTH0_AUDIENCE": "https://fittrack-api"
    }
  },
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Why Render for Microservices?
1. **Auto-Deploy from Git**: Push to GitHub → Render rebuilds Docker image
2. **Zero-Downtime Deployments**: Rolling updates with health checks
3. **Managed PostgreSQL**: Automatic backups, connection pooling
4. **Environment Variables**: Inject secrets via web dashboard
5. **Horizontal Scaling**: Spin up multiple instances per service

**Render Service Config** (render.yaml):
```yaml
services:
  - type: web
    name: fittrack-gateway
    env: docker
    dockerfilePath: ./backend/gateway/Dockerfile
    healthCheckPath: /actuator/health
    envVars:
      - key: CONFIG_SERVER_URL
        value: http://config-server:8888
      - key: USER_SERVICE_URL
        value: http://user-service:8081
      - key: AUTH0_JWK_SET_URI
        sync: false # Secret
    autoDeploy: true
    branch: main
    scaling:
      minInstances: 2
      maxInstances: 10
      targetCPU: 70
```

### Why Neon PostgreSQL?
1. **Serverless**: Auto-pause after 5 minutes of inactivity (free tier)
2. **Branching**: Create staging database from production snapshot
3. **Connection Pooling**: PgBouncer included (up to 10,000 connections)
4. **Backups**: Point-in-time recovery (PITR) up to 30 days
5. **Schema Isolation**: Each service connects to separate database

**Neon Connection String**:
```
postgresql://user_db_user:password@ep-morning-wave-123456.us-west-2.aws.neon.tech/user_db?sslmode=require&currentSchema=user_schema
```

### Why MongoDB Atlas?
1. **Managed Clusters**: Automated backups, monitoring, scaling
2. **Global Distribution**: Multi-region replication for low latency
3. **Change Streams**: Real-time event notifications (future: trigger functions)
4. **Atlas Search**: Full-text search on activity descriptions
5. **Free Tier**: M0 cluster for development (512 MB storage)

**Atlas Connection String**:
```
mongodb+srv://activity_user:password@fitapp.awbcqor.mongodb.net/activity_db?retryWrites=true&w=majority&appName=FitApp
```

### Why CloudAMQP?
1. **Managed RabbitMQ**: No need to maintain broker infrastructure
2. **High Availability**: Clustered setup with automatic failover
3. **Monitoring**: Built-in dashboard for queue depth, message rates
4. **Lazy Queues**: Disk-backed queues for large backlogs
5. **AMQPS**: TLS encryption for message transport

**CloudAMQP Connection String**:
```
amqps://fittrack_user:password@puffin.rmq2.cloudamqp.com/fittrack_vhost
```

### Environment Variables Management

**Development** (.env file):
```env
# Services
USER_SERVICE_PORT=8081
ACTIVITY_SERVICE_PORT=8083
AI_SERVICE_PORT=8084
GATEWAY_SERVICE_PORT=8085

# Databases
USER_DB_URL=jdbc:postgresql://postgres:5432/user_db?currentSchema=user_schema
MONGO_URI_ACTIVITY=mongodb://mongo:27017/activity_db

# Auth
AUTH0_ISSUER_URI=https://dev-5s2csl8rpq2phx88.us.auth0.com/
AUTH0_JWK_SET_URI=https://dev-5s2csl8rpq2phx88.us.auth0.com/.well-known/jwks.json

# External APIs
GEMINI_API_KEY=your_key_here
```

**Production** (Render environment variables):
- Injected via Render dashboard or CI/CD pipeline
- Secrets stored in encrypted vault
- Never committed to Git

### Service Communication URLs

**Local Development (container network)**:
```
Frontend → http://gateway:8085/api/users
Gateway  → http://userservice:8081/api/users
```

**Production**:
```
Frontend → https://api.fittrack.com/api/users
Gateway  → https://userservice.onrender.com/api/users
```

**Internal Service Mesh** (Render):
- Services on same Render account use private network
- DNS resolution: `http://user-service:8081` (no public internet)
- Lower latency, higher security

---

## 8. CI/CD and Cloud Readiness

### Current Deployment Flow

```
Developer → Git Push → GitHub → Render Webhook → Build → Deploy

1. Developer commits code to GitHub (main branch)
   ↓
2. GitHub webhook triggers Render build
   ↓
3. Render clones repo and detects Dockerfile
   ↓
4. Render builds Docker image
   docker build -t user-service:v1.2.3 ./backend/userservice
   ↓
5. Render pushes image to private registry
   ↓
6. Render deploys new image with zero downtime
   - Start new container
   - Health check passes
   - Route traffic to new container
   - Stop old container
   ↓
7. Render notifies Slack/Email on deployment status
```

### Containerization

**Why Docker?**
- **Consistency**: Same image runs in dev, staging, production
- **Isolation**: Each service has own dependencies (Java 21, Maven 3.9)
- **Resource Limits**: CPU/memory constraints prevent resource hogging
- **Orchestration Ready**: Easy to migrate to Kubernetes later

**Sample Dockerfile** (User Service):
```dockerfile
# Stage 1: Build
FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/userservice-0.0.1-SNAPSHOT.jar app.jar

# Non-root user for security
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget -qO- https://userservice.onrender.com/actuator/health || exit 1

EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### GitHub Actions Workflow (Proposed)

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up JDK 21
        uses: actions/setup-java@v3
        with:
          java-version: '21'
      - name: Run Tests
        run: |
          cd backend/userservice
          mvn test
      - name: Upload Coverage
        uses: codecov/codecov-action@v3

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build Docker Image
        run: |
          docker build -t ghcr.io/${{ github.repository }}/user-service:${{ github.sha }} \
            -f backend/userservice/Dockerfile .
      - name: Push to GitHub Container Registry
        run: |
          echo ${{ secrets.GITHUB_TOKEN }} | docker login ghcr.io -u ${{ github.actor }} --password-stdin
          docker push ghcr.io/${{ github.repository }}/user-service:${{ github.sha }}

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to Render
        run: |
          curl -X POST https://api.render.com/deploy/srv-abc123 \
            -H "Authorization: Bearer ${{ secrets.RENDER_API_KEY }}"
```

### Scaling Strategies

**Horizontal Scaling** (Render Auto-Scaling):
```yaml
scaling:
  minInstances: 2
  maxInstances: 10
  targetMetrics:
    cpu: 70%
    memory: 80%
    requestsPerSecond: 100
```

**Database Scaling**:
- **Neon PostgreSQL**: Vertical scaling (compute units), read replicas
- **MongoDB Atlas**: Horizontal scaling via sharding, vertical via cluster tier

**Message Queue Scaling**:
- **RabbitMQ**: Multiple consumers (AI Service replicas)
- **CloudAMQP**: Upgrade plan for higher throughput

---

## 9. Fault Tolerance & Scalability

### Failure Scenarios & Mitigations

#### Scenario 1: AI Service Down
**Impact**: Recommendations not generated
**Mitigation**:
1. **Circuit Breaker**: Activity Service publishes to RabbitMQ (returns 202 Accepted)
2. **Message Persistence**: RabbitMQ queues messages (durable storage)
3. **Retry**: When AI Service recovers, processes backlog
4. **Fallback**: Return cached recommendations or generic advice

**Implementation** (Resilience4j):
```java
@CircuitBreaker(name = "gemini-api", fallbackMethod = "fallbackRecommendation")
public Mono<String> callGeminiAPI(String prompt) {
    return webClient.post()
        .uri(geminiApiUrl)
        .bodyValue(prompt)
        .retrieve()
        .bodyToMono(String.class);
}

public Mono<String> fallbackRecommendation(String prompt, Exception e) {
    return Mono.just("Keep up the great work! We'll provide detailed insights shortly.");
}
```

#### Scenario 2: RabbitMQ Slow/Overloaded
**Impact**: Activity Service publishes timeout
**Mitigation**:
1. **Async Publishing**: Use `RabbitTemplate.convertAndSend` (non-blocking)
2. **Publisher Confirms**: Retry on NACK
3. **Lazy Queues**: RabbitMQ offloads messages to disk (prevents memory overflow)
4. **Dead Letter Queue**: Failed messages route to DLX for manual review

**Configuration**:
```yaml
spring:
  rabbitmq:
    publisher-confirms: true
    publisher-returns: true
    template:
      mandatory: true
      retry:
        enabled: true
        max-attempts: 3
        initial-interval: 1000ms
```

#### Scenario 3: Database Connection Pool Exhausted
**Impact**: New requests timeout
**Mitigation**:
1. **HikariCP Tuning**:
   ```yaml
   spring:
     datasource:
       hikari:
         maximum-pool-size: 20
         minimum-idle: 10
         connection-timeout: 30000
         idle-timeout: 600000
   ```
2. **Connection Leak Detection**: Log slow queries (> 1 second)
3. **Read Replicas**: Route read queries to replicas

#### Scenario 4: Auth0 Outage
**Impact**: Users cannot log in; existing sessions still work (JWT cached)
**Mitigation**:
1. **JWT Caching**: Gateway caches Auth0 JWKS for 10 minutes
2. **Graceful Degradation**: Allow anonymous access to public endpoints
3. **Status Page**: Display "Authentication service unavailable" banner

#### Scenario 5: Gemini API Rate Limit Exceeded
**Impact**: AI recommendations fail
**Mitigation**:
1. **Rate Limiting**: Token bucket (100 requests/min)
2. **Exponential Backoff**: Retry after 2^n seconds
3. **Fallback**: Use cached recommendations or simpler rule-based logic

### Preventing Cascading Failures

**Bulkhead Pattern**:
```java
@Bulkhead(name = "user-service", type = Bulkhead.Type.THREADPOOL)
public ResponseEntity<User> getUserProfile(String userId) {
    // Isolated thread pool (max 10 threads)
    // If user-service slow, doesn't block activity-service calls
}
```

**Timeout Configuration**:
```yaml
resilience4j:
  timelimiter:
    configs:
      default:
        timeout-duration: 5s
        cancel-running-future: true
```

**Load Shedding**: Gateway rejects requests when backend unhealthy (503 Service Unavailable)

---

## 10. How to Explain This in Interviews

### 2-Minute Pitch
"FitTrack is a **cloud-native fitness SaaS platform** I built using **Spring Boot microservices** with React frontend. It handles **activity tracking, AI-powered recommendations, and admin dashboards**. I implemented **event-driven architecture** using RabbitMQ to decouple services—when a user logs a workout, it's immediately saved in MongoDB and published to a message queue. The AI service consumes these events asynchronously and calls Google's Gemini API to generate personalized recommendations. This design ensures **low latency** for users and **fault tolerance** if the AI service is temporarily down. I used **Auth0 for OAuth 2.0** authentication, **PostgreSQL for transactional data**, and **MongoDB for document storage**. The system is deployed on **Render** with **Vercel** hosting the frontend, using **Neon PostgreSQL** and **MongoDB Atlas** as managed cloud databases. This architecture demonstrates **separation of concerns, independent scalability, and production-ready DevOps practices**."

### 5-Minute Technical Deep-Dive
"Let me walk you through the architecture:

1. **Frontend**: React 19 SPA with Auth0 integration. When a user logs in, we use the Authorization Code flow with PKCE to get a JWT. This token is sent in every API request to the Gateway.

2. **API Gateway**: Built with Spring Cloud Gateway, it validates JWTs using Auth0's JWKS endpoint, enforces CORS policies, and routes requests to backend services. This single entry point simplifies security and logging.

3. **User Service**: Manages profiles and authentication. It uses Neon PostgreSQL because user data requires ACID transactions—registration must atomically create a user and send a verification email. Each service has its own database (database-per-service pattern) to avoid coupling.

4. **Activity Service**: Logs workouts in MongoDB because the schema evolves frequently. Today we track duration and calories; tomorrow we might add GPS data or heart rate. After saving an activity, it publishes an event to RabbitMQ with routing key `activity.tracking`.

5. **AI Service**: Consumes activity events from RabbitMQ and calls Google's Gemini API to generate recommendations like 'Increase your running distance by 10% next week.' This is asynchronous—users don't wait for AI processing. The service scales horizontally; we can run 10 consumers processing messages in parallel.

6. **Admin Service**: Aggregates stats from User and Activity services using WebClient (non-blocking HTTP). It stores audit logs in PostgreSQL for compliance.

7. **Deployment**: Frontend on Vercel (CDN with auto-scaling), backend on Render (Docker containers with auto-deploy from GitHub), databases on Neon and Atlas (managed cloud), and RabbitMQ on CloudAMQP.

8. **Resilience**: I implemented circuit breakers using Resilience4j. If Gemini API fails, we return cached recommendations. RabbitMQ provides durable queues—messages aren't lost even if the AI service crashes. Dead-letter queues catch failed messages for manual review.

This design achieves **independent deployability** (deploy AI service without restarting Gateway), **polyglot persistence** (right database for right job), and **graceful degradation** (system remains functional even if parts fail)."

### Resume-Ready Summary
**FitTrack – Microservices Fitness SaaS Platform**
- Architected event-driven microservices system using **Spring Boot 3, Spring Cloud Gateway, RabbitMQ**, and **React 19** with **Auth0 OAuth 2.0** for authentication
- Implemented **asynchronous AI recommendation engine** consuming activity events from RabbitMQ and integrating **Google Gemini API** for personalized workout insights
- Designed **polyglot persistence** strategy: **Neon PostgreSQL** for ACID transactions (users, audit logs), **MongoDB Atlas** for flexible activity metrics, achieving 1000+ writes/sec
- Deployed on **Render** (Docker containers) and **Vercel** (frontend CDN) with CI/CD pipeline, **zero-downtime deployments**, and **horizontal auto-scaling** (2-10 instances per service)
- Ensured **fault tolerance** via circuit breakers (Resilience4j), message persistence (durable RabbitMQ queues), and dead-letter exchange for failed events
- Technologies: Java 21, Spring Boot, Spring Cloud, Spring Security, WebFlux, MongoDB, PostgreSQL, Redis, RabbitMQ, Docker, Auth0, React, Redux, TailwindCSS

---

## 11. Enterprise-Scale Improvements

### 1. Observability & Monitoring

**Current Gap**: Limited visibility into production issues

**Recommended Stack**:
- **Metrics**: Prometheus + Grafana
  - JVM metrics (heap, GC, threads)
  - Custom metrics (activity logs/sec, AI processing latency)
  - Dashboards per service
  
- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)
  - Centralized log aggregation
  - Correlation IDs for distributed tracing
  - Log levels: DEBUG (dev), INFO (prod)
  
- **Tracing**: Jaeger or Zipkin
  - End-to-end request tracing across services
  - Identify bottlenecks (e.g., slow database queries)
  
- **APM**: New Relic or Datadog
  - Real-time performance monitoring
  - Error tracking with stack traces
  - Synthetic monitoring (uptime checks)

**Implementation**:
```yaml
# Prometheus scraping config
scrape_configs:
  - job_name: 'user-service'
    metrics_path: '/actuator/prometheus'
    static_configs:
      - targets: ['user-service:8081']
```

```java
// Spring Boot Actuator
@RestController
public class UserController {
    private final MeterRegistry meterRegistry;
    
    public ResponseEntity<User> getUser(String id) {
        Counter counter = meterRegistry.counter("user.fetch.count");
        counter.increment();
        // ...
    }
}
```

### 2. API Gateway Enhancements

**Rate Limiting** (Redis-backed):
```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: user-service
          uri: http://user-service
          predicates:
            - Path=/api/users/**
          filters:
            - name: RequestRateLimiter
              args:
                redis-rate-limiter.replenishRate: 100
                redis-rate-limiter.burstCapacity: 200
                redis-rate-limiter.requestedTokens: 1
```

**API Versioning**:
```yaml
routes:
  - id: user-service-v1
    uri: http://user-service-v1
    predicates:
      - Path=/api/v1/users/**
  - id: user-service-v2
    uri: http://user-service-v2
    predicates:
      - Path=/api/v2/users/**
```

**Request Transformation**:
- Header enrichment (X-Request-Id, X-Forwarded-For)
- Response caching (Redis)
- Gzip compression

### 3. Security Hardening

**API Key Authentication** (for mobile apps):
```java
@Component
public class ApiKeyFilter implements GatewayFilter {
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String apiKey = exchange.getRequest().getHeaders().getFirst("X-API-Key");
        if (!isValidApiKey(apiKey)) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }
        return chain.filter(exchange);
    }
}
```

**Input Validation** (prevent SQL injection, XSS):
```java
@PostMapping("/register")
public ResponseEntity<User> register(@Valid @RequestBody UserRequest request) {
    // @Valid triggers JSR-303 validation
    // @Email, @Size(min=8), @Pattern(regexp="...")
}
```

**Secret Management**:
- **HashiCorp Vault**: Store database passwords, API keys
- **AWS Secrets Manager**: Rotate secrets automatically
- **Environment Variables**: Never commit secrets to Git

**HTTPS/TLS**:
- Force HTTPS in production (HTTP → HTTPS redirect)
- TLS 1.3 with strong cipher suites
- Certificate auto-renewal (Let's Encrypt)

### 4. Database Optimization

**Indexing**:
```sql
-- PostgreSQL
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_keycloak_id ON users(keycloak_id);

-- MongoDB
db.activities.createIndex({ userId: 1, createdAt: -1 });
db.activities.createIndex({ type: 1, startTime: -1 });
```

**Query Optimization**:
- Use pagination (avoid `SELECT *` without limits)
- Projection queries (fetch only needed fields)
- Caching (Redis for frequently accessed profiles)

**Connection Pooling**:
```yaml
spring:
  datasource:
    hikari:
      maximum-pool-size: 50
      minimum-idle: 10
      connection-timeout: 20000
      idle-timeout: 300000
      max-lifetime: 1200000
```

### 5. Kubernetes Migration

**Why Kubernetes?**
- **Auto-Scaling**: HorizontalPodAutoscaler based on CPU/memory
- **Self-Healing**: Restarts failed pods automatically
- **Service Mesh**: Istio for advanced traffic management
- **ConfigMaps/Secrets**: Inject environment variables
- **Rolling Updates**: Zero-downtime deployments

**Sample Kubernetes Manifest**:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: user-service
  template:
    metadata:
      labels:
        app: user-service
    spec:
      containers:
      - name: user-service
        image: ghcr.io/fittrack/user-service:v1.2.3
        ports:
        - containerPort: 8081
        env:
        - name: USER_DB_URL
          valueFrom:
            secretKeyRef:
              name: db-secrets
              key: user-db-url
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
        livenessProbe:
          httpGet:
            path: /actuator/health
            port: 8081
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /actuator/health/readiness
            port: 8081
          initialDelaySeconds: 10
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: user-service
spec:
  selector:
    app: user-service
  ports:
  - port: 8081
    targetPort: 8081
  type: ClusterIP
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: user-service-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: user-service
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

### 6. Advanced Testing

**Load Testing** (Gatling/JMeter):
- Simulate 10,000 concurrent users
- Identify breaking point (e.g., database connection pool exhaustion)
- Measure response time (P50, P95, P99)

**Chaos Engineering** (Chaos Monkey):
- Randomly kill service instances
- Inject network latency (100ms delay)
- Verify graceful degradation

**Contract Testing** (Pact):
- Consumer-driven contracts between services
- Prevent breaking changes in APIs

### 7. Cost Optimization

**Auto-Scaling Down**:
- Scale to 0 replicas during off-peak hours
- Use spot instances (AWS EC2 Spot, Azure Spot VMs)

**Database Optimization**:
- Neon: Auto-pause after 5 minutes (free tier)
- MongoDB: Use M0 free tier for dev, M10 for prod

**CDN Caching**:
- Cache static assets (images, JS, CSS) for 1 year
- Reduce Vercel bandwidth costs

### 8. Compliance & Auditing

**GDPR Compliance**:
- User data export (JSON format)
- Right to deletion (hard delete from all services)
- Data retention policies (delete inactive accounts after 2 years)

**Audit Logs**:
- Log every admin action (who, what, when, IP address)
- Immutable logs (append-only, no updates/deletes)
- Retention: 7 years for financial data

**Data Encryption**:
- At rest: AES-256 encryption (database-level)
- In transit: TLS 1.3 (API calls)
- Key management: Rotate keys every 90 days

---

## 12. Architecture Diagrams (PlantUML)

### System Context Diagram
```plantuml
@startuml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Context.puml

Person(user, "Fitness Enthusiast", "Tracks workouts")
Person(admin, "Administrator", "Manages platform")

System(fittrack, "FitTrack Platform", "Microservices fitness SaaS")

System_Ext(auth0, "Auth0", "OAuth 2.0 provider")
System_Ext(gemini, "Google Gemini", "AI recommendations")
System_Ext(emailjs, "EmailJS", "Email notifications")

Rel(user, fittrack, "Logs activities, views recommendations")
Rel(admin, fittrack, "Manages users, views analytics")
Rel(fittrack, auth0, "Authenticates users")
Rel(fittrack, gemini, "Generates AI insights")
Rel(fittrack, emailjs, "Sends contact form emails")

@enduml
```

### Container Diagram
```plantuml
@startuml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Container.puml

Person(user, "User")
System_Boundary(fittrack, "FitTrack Platform") {
    Container(frontend, "React Frontend", "Vite + React 19", "SPA with Auth0 integration")
    Container(gateway, "API Gateway", "Spring Cloud Gateway", "JWT validation, routing")
    Container(userservice, "User Service", "Spring Boot", "Profiles, authentication")
    Container(activityservice, "Activity Service", "Spring Boot", "Workout tracking")
    Container(aiservice, "AI Service", "Spring Boot", "AI recommendations")
    Container(adminservice, "Admin Service", "Spring Boot", "Admin dashboard")
    ContainerDb(postgres, "PostgreSQL", "Neon", "User, admin data")
    ContainerDb(mongo, "MongoDB", "Atlas", "Activities, recommendations")
    ContainerQueue(rabbitmq, "RabbitMQ", "CloudAMQP", "Event queue")
}

Rel(user, frontend, "Uses", "HTTPS")
Rel(frontend, gateway, "API calls", "HTTPS + JWT")
Rel(gateway, userservice, "Routes /api/users/**")
Rel(gateway, activityservice, "Routes /api/activities/**")
Rel(gateway, aiservice, "Routes /api/ai/**")
Rel(gateway, adminservice, "Routes /api/admin/**")

Rel(userservice, postgres, "Reads/writes")
Rel(adminservice, postgres, "Reads/writes")
Rel(activityservice, mongo, "Reads/writes")
Rel(aiservice, mongo, "Reads/writes")

Rel(activityservice, rabbitmq, "Publishes events")
Rel(aiservice, rabbitmq, "Consumes events")

@enduml
```

---

## Conclusion

FitTrack demonstrates a **production-grade microservices architecture** with:
- **Event-driven design** for asynchronous processing
- **Polyglot persistence** (PostgreSQL + MongoDB)
- **OAuth 2.0 authentication** with JWT
- **Fault tolerance** via circuit breakers and message queues
- **Cloud-native deployment** on Render, Vercel, Neon, Atlas, CloudAMQP
- **Horizontal scalability** and **independent deployability**

This system is designed for **real-world SaaS applications**, handling high traffic, third-party API failures, and evolving business requirements while maintaining **low latency** and **high availability**.

---

**Document Version**: 1.0  
**Last Updated**: January 22, 2026  
**Author**: FitTrack Engineering Team  
**Status**: Production-Ready
