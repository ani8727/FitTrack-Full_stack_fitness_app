# FitTrack - System Design Documentation

**Last Updated:** January 2026  
**Spring Boot:** 3.5.9 | **Spring Cloud:** 2025.0.0 | **Java:** 21 | **React:** 19 | **Vite:** 7

## Table of Contents
- [C4 Model Architecture](#c4-model-architecture)
  - [Level 1: System Context](#level-1-system-context)
  - [Level 2: Container Diagram](#level-2-container-diagram)
  - [Level 3: Component Diagrams](#level-3-component-diagrams)
  - [Level 4: Code Structure](#level-4-code-structure)
- [PlantUML Diagrams](#plantuml-diagrams)
- [Data Flow Analysis](#data-flow-analysis)
- [Service Interaction Patterns](#service-interaction-patterns)

---

## C4 Model Architecture

### Level 1: System Context

```mermaid
C4Context
    title System Context - FitTrack Fitness Platform

    Person(user, "Fitness User", "Tracks workouts, views insights")
    Person(admin, "Admin", "Manages users, monitors system")
    
    System(fittrack, "FitTrack Platform", "Full-stack fitness tracking and analysis system")
    
    System_Ext(auth0, "Auth0", "Identity & Authentication Provider (OAuth2/OIDC)")
    System_Ext(db_neon, "Neon PostgreSQL", "User & Admin Data (Separate databases)")
    System_Ext(db_mongo, "MongoDB Atlas", "Activity & AI Data")
    System_Ext(rabbitmq, "CloudAMQP", "Event Message Broker")
    
    Rel(user, fittrack, "Uses", "HTTPS/React SPA")
    Rel(admin, fittrack, "Manages", "HTTPS/Admin Portal")
    Rel(fittrack, auth0, "Authenticates", "OIDC/OAuth2 + JWT")
    Rel(fittrack, db_neon, "Stores", "JDBC over SSL")
    Rel(fittrack, db_mongo, "Stores", "MongoDB Driver")
    Rel(fittrack, rabbitmq, "Publishes/Consumes", "AMQP over SSL")
```

### Level 2: Container Diagram

```mermaid
C4Container
    title Container Diagram - FitTrack Internal Architecture

    Person(user, "User")
    Person(admin, "Admin")
    
    Container_Boundary(c1, "FitTrack Platform") {
        Container(spa, "React SPA", "React 19/Vite 7", "User interface for fitness tracking")
        Container(nginx, "Frontend Server", "Vite Dev/Nginx", "Serves static assets and proxies API")
        Container(gateway, "API Gateway", "Spring Cloud Gateway 4.x", "Entry point, routing, JWT auth")
        
        Container(eureka, "Service Registry", "Eureka Server", "Service discovery")
        Container(config, "Config Server", "Spring Cloud Config", "Centralized configuration")
        
        Container(userservice, "User Service", "Spring Boot", "User management, profiles, onboarding")
        Container(adminservice, "Admin Service", "Spring Boot", "Admin operations, user management")
        Container(activityservice, "Activity Service", "Spring Boot", "Activity tracking, fitness data")
        Container(aiservice, "AI Service", "Spring Boot", "ML insights, recommendations")
    }
    
    ContainerDb(neon, "Neon PostgreSQL", "user_db, admin_db (separate schemas)")
    ContainerDb(mongo, "MongoDB Atlas", "Activities, AI Models")
    ContainerQueue(mq, "CloudAMQP", "Event Messages")
    Container_Ext(auth0, "Auth0", "Identity Provider")
    
    Rel(user, spa, "Uses")
    Rel(admin, spa, "Manages")
    Rel(spa, nginx, "Serves")
    Rel(nginx, gateway, "Proxies API", "/api/*")
    
    Rel(gateway, eureka, "Discovers services")
    Rel(gateway, config, "Gets configuration")
    Rel(gateway, userservice, "Routes /users/*")
    Rel(gateway, adminservice, "Routes /admin/*")
    Rel(gateway, activityservice, "Routes /activities/*")
    Rel(gateway, aiservice, "Routes /ai/*")
    
    Rel(userservice, eureka, "Registers")
    Rel(adminservice, eureka, "Registers")
    Rel(activityservice, eureka, "Registers")
    Rel(aiservice, eureka, "Registers")
    
    Rel(userservice, config, "Gets config")
    Rel(adminservice, config, "Gets config")
    Rel(activityservice, config, "Gets config")
    Rel(aiservice, config, "Gets config")
    
    Rel(userservice, neon, "Stores users (user_db)")
    Rel(adminservice, neon, "Stores admin data (admin_db)")
    Rel(activityservice, mongo, "Stores activities")
    Rel(aiservice, mongo, "Stores AI data")
    
    Rel(userservice, redis, "Cache profiles")
    Rel(activityservice, redis, "Cache stats")
    
    Rel(activityservice, mq, "Publishes activity.recorded")
    Rel(aiservice, mq, "Consumes activity.recorded")
    Rel(userservice, mq, "Publishes user.onboarded")
    
    Rel(gateway, auth0, "Validates JWT")
    Rel(userservice, auth0, "Syncs user metadata")
```

### Level 3: Component Diagrams

#### User Service Components

```mermaid
C4Component
    title User Service - Internal Components

    Container_Boundary(c1, "User Service") {
        Component(controller, "UserController", "Spring MVC", "REST API endpoints")
        Component(security, "UserSecurity", "Spring Security", "Authorization logic")
        Component(userSvc, "UserService", "Business Logic", "Core user operations")
        Component(keycloakSvc, "KeycloakService", "External Integration", "Keycloak account management")
        Component(contactSvc, "ContactService", "Business Logic", "Contact message handling")
        Component(accountSvc, "AccountManagementService", "Business Logic", "Account lifecycle")
        
        Component(userRepo, "UserRepository", "Spring Data JPA", "User entity persistence")
        Component(contactRepo, "ContactMessageRepository", "Spring Data JPA", "Contact message persistence")
    }
    
    ContainerDb(postgres, "PostgreSQL")
    Container_Ext(keycloak, "Keycloak")
    ContainerQueue(mq, "RabbitMQ")
    
    Rel(controller, userSvc, "Uses")
    Rel(controller, security, "Authorizes with")
    Rel(userSvc, userRepo, "Persists via")
    Rel(userSvc, keycloakSvc, "Manages accounts")
    Rel(userSvc, accountSvc, "Delegates to")
    Rel(contactSvc, contactRepo, "Persists via")
    
    Rel(userRepo, postgres, "Queries")
    Rel(contactRepo, postgres, "Queries")
    Rel(keycloakSvc, keycloak, "API calls")
    Rel(userSvc, mq, "Publishes events")
```

#### Activity Service Components

```mermaid
C4Component
    title Activity Service - Internal Components

    Container_Boundary(c1, "Activity Service") {
        Component(actController, "ActivityController", "Spring MVC", "REST API endpoints")
        Component(actService, "ActivityService", "Business Logic", "Activity tracking operations")
        Component(actRepo, "ActivityRepository", "Spring Data MongoDB", "Activity document persistence")
    }
    
    ContainerDb(mongo, "MongoDB")
    ContainerQueue(mq, "RabbitMQ")
    ContainerDb(redis, "Redis")
    
    Rel(actController, actService, "Uses")
    Rel(actService, actRepo, "Persists via")
    Rel(actRepo, mongo, "Queries")
    Rel(actService, mq, "Publishes activity events")
    Rel(actService, redis, "Caches statistics")
```

### Level 4: Code Structure

#### User Service Class Diagram

```mermaid
classDiagram
    class UserController {
        +getUserProfile(userId) UserResponse
        +register(request) UserResponse
        +validateUser(userId) Boolean
        +getAllUsers(search, role, status) List~UserResponse~
        +getUserStats() Map~String,Object~
        +updateUserStatus(userId, status, reason) UserResponse
        +updateProfile(userId, request) UserResponse
    }
    
    class UserService {
        +getUserProfile(userId) UserResponse
        +register(request) UserResponse
        +existByUserId(userId) Boolean
        +getAllUsers(search, role, status) List~UserResponse~
        +getUserStats() Map~String,Object~
        +updateUserStatus(userId, status, reason) UserResponse
        +updateProfile(userId, request) UserResponse
    }
    
    class User {
        -String id
        -String userId
        -String email
        -String firstName
        -String lastName
        -UserRole role
        -AccountStatus status
        -Integer age
        -Gender gender
        -Double height
        -Double weight
        -String fitnessGoals
        -LocalDateTime createdAt
        -LocalDateTime updatedAt
    }
    
    class UserRepository {
        +findByUserId(userId) Optional~User~
        +findByEmail(email) Optional~User~
        +existsByUserId(userId) Boolean
        +findAll(spec) List~User~
    }
    
    UserController --> UserService
    UserService --> UserRepository
    UserRepository --> User
    UserService --> KeycloakService
    UserService --> AccountManagementService
```

#### Activity Service Class Diagram

```mermaid
classDiagram
    class ActivityController {
        +trackActivity(request, userId) ActivityResponse
        +getUserActivities(userId) List~ActivityResponse~
        +getActivity(activityId) ActivityResponse
        +getUserStats(userId) Object
        +deleteActivity(activityId, userId) void
        +getAllActivities() List~ActivityResponse~
        +getAdminStats() Object
        +adminDeleteActivity(activityId) void
    }
    
    class ActivityService {
        +trackActivity(request) ActivityResponse
        +getUserActivities(userId) List~ActivityResponse~
        +getActivityById(activityId) ActivityResponse
        +deleteActivity(activityId, userId) void
        +getAllActivities() List~ActivityResponse~
        +adminDeleteActivity(activityId) void
    }
    
    class Activity {
        -String id
        -String userId
        -String name
        -String type
        -Integer duration
        -Integer caloriesBurned
        -String notes
        -LocalDateTime date
        -LocalDateTime createdAt
    }
    
    class ActivityRepository {
        +findByUserId(userId) List~Activity~
        +findById(id) Optional~Activity~
        +save(activity) Activity
        +delete(activity) void
        +findAll() List~Activity~
    }
    
    ActivityController --> ActivityService
    ActivityService --> ActivityRepository
    ActivityRepository --> Activity
```

---

## PlantUML Diagrams

### Sequence Diagram: User Registration Flow

```plantuml
@startuml
title User Registration Flow

actor User
participant "React SPA" as SPA
participant "API Gateway" as Gateway
participant "User Service" as UserSvc
participant "Keycloak" as KC
participant "PostgreSQL" as DB
participant "RabbitMQ" as MQ

User -> SPA: Fill registration form
SPA -> Gateway: POST /api/users/register
Gateway -> KC: Validate JWT token
KC --> Gateway: Token valid
Gateway -> UserSvc: POST /register
UserSvc -> KC: Create user account
KC --> UserSvc: Account created
UserSvc -> DB: Save user profile
DB --> UserSvc: Profile saved
UserSvc -> MQ: Publish user.onboarded event
UserSvc --> Gateway: UserResponse
Gateway --> SPA: 200 OK
SPA --> User: Registration successful
@enduml
```

### Sequence Diagram: Activity Tracking Flow

```plantuml
@startuml
title Activity Tracking Flow

actor User
participant "React SPA" as SPA
participant "API Gateway" as Gateway
participant "Activity Service" as ActSvc
participant "MongoDB" as Mongo
participant "RabbitMQ" as MQ
participant "AI Service" as AI

User -> SPA: Submit activity data
SPA -> Gateway: POST /api/activities (with JWT)
Gateway -> ActSvc: POST /activities (with X-User-ID)
ActSvc -> Mongo: Save activity document
Mongo --> ActSvc: Activity saved
ActSvc -> MQ: Publish activity.recorded event
MQ -> AI: Consume activity.recorded event
AI -> Mongo: Update user insights
ActSvc --> Gateway: ActivityResponse
Gateway --> SPA: 200 OK
SPA --> User: Activity tracked
@enduml
```

### Component Interaction Diagram

```plantuml
@startuml
title Service Interaction Overview

!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Component.puml

Container_Boundary(gateway, "API Gateway") {
    Component(routes, "Route Filters", "Routes & Auth")
}

Container_Boundary(services, "Microservices") {
    Component(user, "User Service", "User Management")
    Component(admin, "Admin Service", "Admin Operations")
    Component(activity, "Activity Service", "Fitness Tracking")
    Component(ai, "AI Service", "ML Insights")
}

Container_Boundary(infra, "Infrastructure") {
    Component(eureka, "Eureka", "Service Discovery")
    Component(config, "Config Server", "Configuration")
    ComponentDb(postgres, "PostgreSQL", "Relational Data")
    ComponentDb(mongo, "MongoDB", "Document Data")
    ComponentDb(redis, "Redis", "Cache")
    ComponentQueue(mq, "RabbitMQ", "Events")
}

Rel(routes, user, "Routes /users/*")
Rel(routes, admin, "Routes /admin/*")
Rel(routes, activity, "Routes /activities/*")
Rel(routes, ai, "Routes /ai/*")

Rel(user, eureka, "Registers")
Rel(admin, eureka, "Registers")
Rel(activity, eureka, "Registers")
Rel(ai, eureka, "Registers")

Rel(user, config, "Gets config")
Rel(admin, config, "Gets config")
Rel(activity, config, "Gets config")
Rel(ai, config, "Gets config")

Rel(user, postgres, "User data")
Rel(admin, postgres, "Admin data")
Rel(activity, mongo, "Activity data")
Rel(ai, mongo, "AI data")

Rel(activity, mq, "Publishes")
Rel(ai, mq, "Consumes")
Rel(user, mq, "Publishes")

Rel(user, redis, "Caches")
Rel(activity, redis, "Caches")
@enduml
```

---

## Data Flow Analysis

### Request Flow Patterns

#### Synchronous Flow (User Profile Request)
1. **Client → Gateway**: JWT validation and routing
2. **Gateway → User Service**: Authorized request with user context
3. **User Service → PostgreSQL**: Query user data
4. **User Service → Redis**: Cache lookup/update
5. **Response Chain**: User data flows back through gateway to client

#### Asynchronous Flow (Activity Analytics)
1. **Activity Service**: Records activity in MongoDB
2. **Activity Service → RabbitMQ**: Publishes `activity.recorded` event
3. **AI Service**: Consumes event asynchronously
4. **AI Service → MongoDB**: Updates user insights and recommendations
5. **Background Processing**: ML models process data without blocking user requests

### Data Storage Patterns

#### PostgreSQL (User Service & Admin Service)
- **User profiles**: Structured relational data with foreign keys
- **Account management**: Status tracking, audit logs
- **Contact messages**: Structured support data

#### MongoDB (Activity Service & AI Service)
- **Activity documents**: Flexible schema for various activity types
- **AI insights**: Complex nested data for recommendations
- **Analytics aggregations**: Pre-computed statistics and trends

#### Redis (Caching Layer)
- **User sessions**: JWT token validation cache
- **Activity statistics**: Pre-computed user metrics
- **Frequently accessed data**: Profile caches, lookup tables

---

## Service Interaction Patterns

### Event-Driven Architecture

#### Published Events
- `user.onboarded`: Triggered after successful user registration
- `activity.recorded`: Triggered after activity tracking
- `user.profile.updated`: Triggered after profile modifications
- `admin.action.performed`: Triggered for audit logging

#### Event Consumers
- **AI Service**: Processes activity events for insights generation
- **Analytics Service**: Aggregates metrics for dashboards
- **Notification Service**: Sends user notifications (future enhancement)

### Security Patterns

#### JWT Flow
1. **Frontend**: Obtains JWT from Keycloak after authentication
2. **Gateway**: Validates JWT signature and extracts user claims
3. **Services**: Receive user context via headers (X-User-ID, X-User-Roles)
4. **Authorization**: Method-level security using Spring Security expressions

#### Service-to-Service Communication
- **Discovery**: Services register with Eureka and discover via service names
- **Configuration**: Centralized config server provides environment-specific settings
- **Health Checks**: Actuator endpoints enable container orchestration health monitoring

### Scalability Considerations

#### Horizontal Scaling
- **Stateless Services**: All business logic services can scale horizontally
- **Database Sharding**: MongoDB supports horizontal partitioning for activity data
- **Cache Distribution**: Redis can be clustered for high availability

#### Performance Optimization
- **Gateway Caching**: Response caching for read-heavy endpoints
- **Database Indexing**: Optimized queries for user and activity lookups
- **Async Processing**: Heavy ML computations offloaded to background workers
