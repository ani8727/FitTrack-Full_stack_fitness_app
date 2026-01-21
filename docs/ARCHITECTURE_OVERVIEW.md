# FitTrack Architecture Overview

**Last Updated:** January 2026

## Introduction

This document provides a comprehensive overview of the FitTrack fitness platform architecture, including both high-level system design and detailed low-level implementations. The system follows microservices architecture principles with event-driven communication patterns, built on Spring Boot 3.5.9, Spring Cloud 2025.0.0, and Java 21.

## Quick Links

- **[System Design Documentation](SYSTEM_DESIGN.md)** - C4 model diagrams and component architecture
- **[Low-Level Design Specifications](LOW_LEVEL_DESIGN.md)** - Detailed service implementation and API contracts
- **[PlantUML Diagrams](diagrams/)** - Renderable architecture diagrams

## Architecture Principles

### 1. Microservices Architecture
- **Service Independence**: Each service owns its data and business logic
- **Technology Diversity**: Services can use different technology stacks as needed
- **Fault Isolation**: Failure in one service doesn't cascade to others
- **Independent Deployment**: Services can be deployed and scaled independently

### 2. Event-Driven Design
- **Asynchronous Processing**: Heavy operations (AI/ML) don't block user requests
- **Loose Coupling**: Services communicate through events rather than direct calls
- **Eventual Consistency**: Data consistency achieved through event propagation
- **Audit Trail**: All business events are captured for analytics and debugging

### 3. Security-First Approach
- **Zero Trust**: Every request is authenticated and authorized
- **JWT Token-Based**: Stateless authentication using Keycloak
- **Method-Level Security**: Fine-grained access control on API endpoints
- **Data Encryption**: Sensitive data encrypted at rest and in transit

### 4. Cloud-Native Patterns
- **Container-Ready**: All services containerized with Docker
- **Configuration Externalization**: Environment-specific config via Config Server
- **Health Monitoring**: Actuator endpoints for health checks and metrics
- **Scalability**: Horizontal scaling support for all stateless services

## System Components Overview

### Frontend Layer
```
React 19 SPA (Vite 7)
├── Authentication (Auth0 integration with JWT)
├── User Dashboard & Activity Tracking
├── Admin Management Interface
├── Responsive UI (TailwindCSS, Mobile-first design)
├── State Management (Redux Toolkit)
└── UI Components (Material-UI, React Icons)
```

### API Gateway Layer
```
Spring Cloud Gateway
├── JWT Token Validation
├── Request Routing (/users/*, /activities/*, etc.)
├── Rate Limiting & Throttling
└── Cross-Cutting Concerns (CORS, Logging)
```

### Business Services Layer
```
Microservices Ecosystem
├── User Service (Profile & Account Management)
├── Activity Service (Fitness Tracking)
├── AI Service (Insights & Recommendations)
└── Admin Service (User Management & Analytics)
```

### Infrastructure Layer
```
Supporting Services
├── Config Server (Centralized Configuration - Spring Cloud Config)
├── Eureka (Service Discovery - Netflix Eureka)
├── PostgreSQL (Neon Cloud - Separate databases per service)
│   ├── user_db (user_schema) - User Service
│   └── admin_db (admin_schema) - Admin Service
├── MongoDB (Cloud - Activity & AI data)
├── RabbitMQ (CloudAMQP - Event Messaging)
└── Auth0 (Identity & Authentication Provider)
```

## Data Flow Patterns

### Synchronous Flows
1. **User Registration**: React → Auth0 → Gateway (JWT validation) → User Service → Neon PostgreSQL (user_db)
2. **Activity Submission**: React → Gateway (JWT validation) → Activity Service → MongoDB
3. **Profile Updates**: React → Gateway (JWT validation) → User Service → Neon PostgreSQL → RabbitMQ Event

### Asynchronous Flows
1. **AI Processing**: Activity Service → RabbitMQ → AI Service → MongoDB
2. **User Events**: User Service → RabbitMQ → Analytics/Audit Services
3. **Notifications**: Various Services → RabbitMQ → Notification Service

## Security Architecture

### Authentication Flow
```
User Login → Auth0 (OAuth2/OIDC) → JWT Token → Gateway Validation → Service Access
```

**Auth0 Configuration:**
- Issuer URI: Configured per tenant
- JWK Set URI: Auto-discovered from Auth0
- JWT Audience: API identifier configured in Auth0
- Roles: Embedded in JWT claims (USER, ADMIN)

### Authorization Patterns
- **Role-Based**: USER, ADMIN roles with different permissions
- **Resource-Based**: Users can only access their own data
- **Method-Level**: Spring Security annotations on service methods

### Data Security
- **Encryption**: TLS/SSL for data in transit
- **Secrets Management**: Environment variables for sensitive data
- **Database Security**: Neon PostgreSQL with SSL, isolated schemas per service
- **Authentication**: OAuth2/OIDC via Auth0 with JWT tokens
- **Authorization**: Role-based (USER, ADMIN) with method-level security

## Deployment Architecture

### Local Development Environment
```
Local Services (No Docker Compose currently)
├── Infrastructure Services
│   ├── Config Server: localhost:8888
│   ├── Eureka Server: localhost:8761
│   ├── Neon PostgreSQL: Cloud-hosted
│   ├── MongoDB: Cloud-hosted (MongoDB Atlas)
│   ├── RabbitMQ: Cloud-hosted (CloudAMQP)
│   └── Auth0: Cloud-hosted
├── Microservices
│   ├── Gateway: localhost:8085
│   ├── User Service: localhost:8081
│   ├── Admin Service: localhost:8082
│   ├── Activity Service: localhost:8083
│   └── AI Service: localhost:8084
└── Frontend: localhost:5173 (Vite dev server)
```

**Note:** All infrastructure services (databases, message broker, auth) are cloud-hosted for both development and production environments.

### Production Environment
```
Kubernetes/Cloud Platform
├── Ingress Controller (Load Balancer)
├── Service Mesh (Istio - Optional)
├── Microservices (Pod Deployments)
├── Managed Databases (Cloud Provider)
└── Monitoring Stack (Prometheus/Grafana)
```

## Monitoring & Observability

### Health Monitoring
- **Service Health**: Spring Boot Actuator endpoints
- **Database Health**: Connection pool and query performance
- **Infrastructure Health**: Resource utilization and availability

### Logging Strategy
- **Structured Logging**: JSON format with correlation IDs
- **Centralized Aggregation**: ELK Stack or cloud logging service
- **Log Levels**: Configurable per service and environment

### Metrics Collection
- **Application Metrics**: Custom business metrics via Micrometer
- **Infrastructure Metrics**: System resources and container stats
- **Performance Metrics**: Response times, throughput, error rates

## Scalability Considerations

### Horizontal Scaling
- **Stateless Services**: All business services can scale horizontally
- **Database Scaling**: Read replicas and sharding strategies
- **Cache Distribution**: Redis clustering for high availability

### Performance Optimization
- **Caching Strategy**: Multi-level caching (Redis, application-level)
- **Database Indexing**: Optimized queries and proper indexing
- **Async Processing**: Background jobs for heavy computations

## Development Workflow

### CI/CD Pipeline
1. **Code Commit**: Git push triggers pipeline
2. **Build & Test**: Maven/Gradle builds with unit tests
3. **Quality Gates**: SonarQube analysis and security scans
4. **Container Build**: Docker image creation and registry push
5. **Deployment**: Automated deployment to environments

### Testing Strategy
- **Unit Tests**: Service and repository layer testing
- **Integration Tests**: API endpoint testing with test containers
- **E2E Tests**: Full user journey testing with Selenium/Cypress
- **Performance Tests**: Load testing with JMeter or similar

## Future Enhancements

### Technical Roadmap
- **Service Mesh**: Implement Istio for advanced traffic management
- **Event Sourcing**: Consider event sourcing for audit and replay capabilities
- **CQRS**: Separate read/write models for complex analytics
- **GraphQL**: Implement GraphQL for flexible client queries

### Business Features
- **Mobile Apps**: Native iOS/Android applications
- **Social Features**: User communities and challenges
- **Wearable Integration**: Fitness tracker and smartwatch sync
- **Nutrition Tracking**: Meal planning and calorie tracking

## Documentation Structure

```
docs/
├── ARCHITECTURE_OVERVIEW.md (This file)
├── SYSTEM_DESIGN.md (High-level C4 diagrams)
├── LOW_LEVEL_DESIGN.md (Detailed service specs)
├── diagrams/
│   ├── system_context.puml
│   ├── container_diagram.puml
│   ├── user_registration_sequence.puml
│   ├── activity_tracking_sequence.puml
│   ├── user_service_components.puml
│   ├── activity_service_components.puml
│   ├── database_schema.puml
│   └── event_flow.puml
└── Guide/ (Existing implementation guides)
```

## Getting Started

### For Developers
1. Read the [System Design](SYSTEM_DESIGN.md) for high-level understanding
2. Review [Low-Level Design](LOW_LEVEL_DESIGN.md) for implementation details
3. Check the [Development Guide](Guide/DEVELOPMENT_GUIDE.md) for setup instructions
4. Review PlantUML diagrams in the `diagrams/` folder for visual understanding

### For Architects
1. Start with the System Context and Container diagrams
2. Review the component diagrams for each service
3. Analyze the sequence diagrams for key user flows
4. Examine the database schema and event flow patterns

### For Operations
1. Review the deployment architecture section
2. Understand monitoring and observability requirements
3. Check the scalability considerations
4. Review security architecture patterns

---

*This architecture overview is a living document that should be updated as the system evolves. For the latest information, always refer to the source code and implementation guides.*