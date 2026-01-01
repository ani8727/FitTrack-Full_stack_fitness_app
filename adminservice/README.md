# Admin Service

Clean admin microservice for FitTrack application - shares database with userservice.

## Features
- Dashboard statistics (total users, admin users, regular users)
- User management (view, update role, delete)
- Admin-only access with OAuth2 JWT authentication
- **Shares MySQL database with userservice** (fitness_users_db)
- Registered with Eureka Discovery
- Routed through API Gateway on `/api/admin/**`

## Configuration
- **Port**: 8083
- **Service Name**: adminservice
- **Database**: fitness_users_db (shared with userservice)
- **Database User**: fitnessuser / fitness123
- **Eureka**: http://localhost:8761
- **Config Server**: http://localhost:8888
- **Keycloak**: http://localhost:8181

## Database Structure
Uses the same `users` table as userservice:
- id (UUID)
- firstName, lastName
- email (unique)
- role (USER/ADMIN enum)
- keycloakId
- password
- createAt, updateAt (auto-managed)

## Build & Run
```bash
# Build
mvn clean package -DskipTests

# Run
mvn spring-boot:run
```

## API Endpoints
All endpoints require `ROLE_ADMIN` authorization.

### Dashboard
- `GET /api/admin/dashboard/stats` - Get dashboard statistics
  ```json
  {
    "totalUsers": 10,
    "adminUsers": 2,
    "regularUsers": 8
  }
  ```

### Users
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users?role=ADMIN` - Filter by role
- `GET /api/admin/users/{id}` - Get user by ID
- `PUT /api/admin/users/{id}/role` - Update user role
  ```json
  { "role": "ADMIN" }
  ```
- `DELETE /api/admin/users/{id}` - Delete user

## Architecture
```
adminservice (port 8083)
├── Uses fitness_users_db (shared with userservice)
├── Registered with Eureka
├── Routed via Gateway: /api/admin/**
└── OAuth2 secured with ROLE_ADMIN
```

## Dependencies
- Spring Boot 3.2.0
- Spring Data JPA
- Spring Security OAuth2 Resource Server
- MySQL Connector
- Eureka Client
- Config Client
- Lombok
