# 🚀 FitTrack - Quick Start Guide

## Prerequisites Check

Run this first to verify all requirements:
```powershell
.\check-prerequisites.ps1
```

## Starting the Application

### Option 1: Start Everything (Recommended)
```powershell
.\run-all.ps1
```

This will:
1. Start Docker infrastructure (MySQL, MongoDB, RabbitMQ, Keycloak, Redis)
2. Start all Spring Boot microservices in order
3. Start the React frontend

### Option 2: Manual Start

#### 1. Start Infrastructure
```powershell
docker-compose up -d
```

#### 2. Start Services (in order)
```powershell
# Eureka Server (Port 8761)
cd eureka
mvnw.cmd spring-boot:run

# Config Server (Port 8888)
cd configserver
mvnw.cmd spring-boot:run

# User Service (Port 8081)
cd userservice
mvnw.cmd spring-boot:run

# Activity Service (Port 8082)
cd activityservice
mvnw.cmd spring-boot:run

# AI Service (Port 8083)
cd aiservice
mvnw.cmd spring-boot:run

# API Gateway (Port 8085)
cd gateway
mvnw.cmd spring-boot:run
```

#### 3. Start Frontend
```powershell
cd fitness-app-frontend
npm install  # First time only
npm run dev
```

## Stopping the Application

```powershell
.\stop-all.ps1
```

## Service URLs

### Application Services
- **Frontend**: http://localhost:5173
- **API Gateway**: http://localhost:8085
- **Eureka Dashboard**: http://localhost:8761

### Infrastructure Services
- **RabbitMQ Management**: http://localhost:15672 (guest/guest)
- **Keycloak Admin**: http://localhost:8181 (admin/admin)

### Direct Service Access (for testing)
- **User Service**: http://localhost:8081
- **Activity Service**: http://localhost:8082
- **AI Service**: http://localhost:8083
- **Config Server**: http://localhost:8888

## Database Access

### MySQL
- **Host**: localhost
- **Port**: 3306
- **Database**: fitness_users_db
- **Username**: root
- **Password**: @ani.8727M

### MongoDB
- **Connection String**: mongodb://root:@ani.8727M@localhost:27017
- **Databases**: 
  - activities_collection
  - ai_collection

## Troubleshooting

### Services won't start
1. Check prerequisites: `.\check-prerequisites.ps1`
2. Ensure Docker is running
3. Check if ports are available
4. Check service logs in the command windows

### Port already in use
```powershell
# Find process using port (e.g., 8761)
netstat -ano | findstr :8761

# Kill process by PID
taskkill /PID <PID> /F
```

### Docker issues
```powershell
# Restart Docker containers
docker-compose restart

# Clean restart (removes data!)
docker-compose down -v
docker-compose up -d
```

### Frontend won't start
```powershell
cd fitness-app-frontend
npm install
npm run dev
```

## Development Tips

### Viewing Logs
Each service runs in its own command window. Check those windows for logs.

### Rebuilding Services
```powershell
cd <service-directory>
mvnw.cmd clean install
```

### Hot Reload
- **Frontend**: Vite hot reloads automatically
- **Backend**: Restart the specific service

## Architecture

```
Frontend (5173)
    ↓
API Gateway (8085) ← Eureka (8761)
    ↓                   ↑
    ├─→ User Service (8081) → MySQL (3306)
    ├─→ Activity Service (8082) → MongoDB (27017) → RabbitMQ (5672)
    └─→ AI Service (8083) → MongoDB (27017) ← RabbitMQ
                                ↓
                           Gemini API
```

## Next Steps

1. **Configure Keycloak**: http://localhost:8181
   - Create realm: `fitness-oauth2`
   - Create client: `oauth2-user1-client`
   - Configure users

2. **Test Endpoints**: Use Postman or curl
3. **Access Frontend**: http://localhost:5173

## Support

Check the following files for detailed information:
- `USER_GUIDE.md` - Complete user guide
- `DEVELOPMENT_GUIDE.md` - Development documentation
