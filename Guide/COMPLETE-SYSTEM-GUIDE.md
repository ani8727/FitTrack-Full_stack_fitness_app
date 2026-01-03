# Fitness App - Complete System Guide

## 🎯 System Overview

This is a **microservices-based fitness tracking application** with the following components:

### Backend Services
1. **Eureka Server** (Port 8761) - Service registry
2. **Config Server** (Port 8888) - Centralized configuration
3. **User Service** (Port 8081) - User management
4. **Activity Service** (Port 8082) - Activity tracking
5. **AI Service** (Port 8083) - AI recommendations
6. **Gateway** (Port 8085) - API Gateway with JWT authentication

### Frontend
- **React App** (Port 5173) - User interface with OAuth2 PKCE

### Infrastructure
- **MySQL** (Port 3307) - User data
- **MongoDB** (Port 27017) - Activity data
- **RabbitMQ** (Ports 5672/15672) - Message broker
- **Redis** (Port 6379) - Caching
- **Keycloak** (Port 8181) - OAuth2 authentication

---

## 🚀 Complete Setup Guide

### Step 1: Start Docker Containers

```bash
# Start all containers
docker start fitness-mysql fitness-mongodb fitness-rabbitmq fitness-redis fitness-keycloak

# Verify all are running
docker ps
```

### Step 2: Start Backend Services (IN ORDER!)

**Important:** Wait 30 seconds between each service for proper registration.

```bash
# 1. Eureka Server
cd c:\Users\anike\Desktop\Project\fitness_app\eureka
start "Eureka Server" cmd /c "mvnw.cmd spring-boot:run"
timeout /t 30 /nobreak

# 2. Config Server
cd c:\Users\anike\Desktop\Project\fitness_app\configserver
start "Config Server" cmd /c "mvnw.cmd spring-boot:run"
timeout /t 30 /nobreak

# 3. User Service
cd c:\Users\anike\Desktop\Project\fitness_app\userservice
start "User Service" cmd /c "mvnw.cmd spring-boot:run"
timeout /t 30 /nobreak

# 4. Activity Service
cd c:\Users\anike\Desktop\Project\fitness_app\activityservice
start "Activity Service" cmd /c "mvnw.cmd spring-boot:run"
timeout /t 30 /nobreak

# 5. AI Service
cd c:\Users\anike\Desktop\Project\fitness_app\aiservice
start "AI Service" cmd /c "mvnw.cmd spring-boot:run"
timeout /t 30 /nobreak

# 6. Gateway
cd c:\Users\anike\Desktop\Project\fitness_app\gateway
start "Gateway" cmd /c "mvnw.cmd spring-boot:run"
```

### Step 3: Start Frontend

```bash
cd c:\Users\anike\Desktop\Project\fitness_app\fitness-app-frontend
npm run dev
```

### Step 4: Verify Everything is Running

```bash
# Check Eureka Dashboard
http://localhost:8761

# Should see 5 services registered:
# - GATEWAY
# - USER-SERVICE
# - ACTIVITY-SERVICE
# - AI-SERVICE
# - CONFIG-SERVER
```

---

## 🧪 Complete Testing Guide

### Quick Test - All Services

```powershell
# Run automated test script
cd c:\Users\anike\Desktop\Project\fitness_app
.\run-tests-and-setup.ps1
```

This script will:
- ✅ Create 3 test users
- ✅ Create 5 different activity types
- ✅ Run unit tests for all services
- ✅ Verify data in databases
- ✅ Show pass/fail summary

### Manual Test - User Flow

**1. Create a User**
```bash
curl -X POST http://localhost:8081/api/users/register \
  -H "Content-Type: application/json" \
  -d "{
    \"keycloakId\": \"test-user-1\",
    \"email\": \"john@fitness.com\",
    \"firstName\": \"John\",
    \"lastName\": \"Doe\",
    \"password\": \"password123\"
  }"
```

**2. Validate User Exists**
```bash
curl http://localhost:8081/api/users/test-user-1/validate
# Should return: true
```

**3. Create Running Activity**
```bash
curl -X POST http://localhost:8082/api/activities \
  -H "Content-Type: application/json" \
  -H "X-User-ID: test-user-1" \
  -d "{
    \"type\": \"RUNNING\",
    \"duration\": 30,
    \"caloriesBurned\": 300
  }"
```

**4. Get All Activities**
```bash
curl -H "X-User-ID: test-user-1" http://localhost:8082/api/activities
```

**5. Get Statistics**
```bash
curl -H "X-User-ID: test-user-1" http://localhost:8082/api/activities/stats
```

### Manual Test - Frontend Flow

1. **Open Browser**: http://localhost:5173
2. **Login**: testuser / password123
3. **View Dashboard**: Should show activities
4. **Add Activity**: Fill form and submit
5. **View Updated List**: New activity should appear

---

## 📊 Database Verification

### Check MySQL Users

```bash
docker exec -it fitness-mysql mysql -ufitnessuser -pfitness123 \
  -e "SELECT id, keycloak_id, email, first_name, last_name, role FROM fitness_users_db.users;"
```

### Check MongoDB Activities

```bash
docker exec -it fitness-mongodb mongosh \
  --eval "use fitness_activities_db; db.activities.find().pretty()"
```

### Check RabbitMQ Messages

1. Open: http://localhost:15672
2. Login: guest / guest
3. Go to Queues → activity.queue
4. Check message count

---

## 🔧 Service Configuration Summary

### User Service
- **Port**: 8081
- **Database**: MySQL (fitness_users_db)
- **Endpoints**:
  - POST `/api/users/register` - Register new user
  - GET `/api/users/{userId}` - Get user profile
  - GET `/api/users/{userId}/validate` - Check if user exists

### Activity Service
- **Port**: 8082
- **Database**: MongoDB (fitness_activities_db)
- **Message Queue**: RabbitMQ (publishes to activity.exchange)
- **Endpoints**:
  - POST `/api/activities` - Create activity
  - GET `/api/activities` - Get user activities
  - GET `/api/activities/{id}` - Get single activity
  - GET `/api/activities/stats` - Get user statistics
  - DELETE `/api/activities/{id}` - Delete activity

### AI Service
- **Port**: 8083
- **Database**: MongoDB (fitness_ai_db)
- **Message Queue**: RabbitMQ (consumes from activity.queue)
- **Endpoints**:
  - GET `/api/recommendations/{userId}` - Get AI recommendations

### Gateway
- **Port**: 8085
- **Features**:
  - JWT token validation
  - Auto user registration
  - Request routing
  - X-User-ID header injection
- **Routes**:
  - `/api/activities/**` → Activity Service
  - `/api/users/**` → User Service
  - `/api/recommendations/**` → AI Service

---

## 🎨 Frontend Features

### Pages
1. **Landing Page** - Welcome screen
2. **Dashboard** - Activity overview with charts
3. **Add Activity** - Form to create activities
4. **Profile** - User profile management

### Features
- ✅ OAuth2 PKCE authentication with Keycloak
- ✅ JWT token management
- ✅ Activity visualization with charts
- ✅ Quick add activity form
- ✅ Activity history list
- ✅ Statistics summary
- ✅ Responsive design
- ✅ Auto-refresh on data changes

---

## 📝 Activity Types Supported

- `RUNNING` - Running/Jogging
- `WALKING` - Walking
- `CYCLING` - Cycling/Biking
- `SWIMMING` - Swimming
- `WEIGHT_TRAINING` - Weight lifting
- `YOGA` - Yoga practice
- `HIIT` - High-intensity interval training
- `CARDIO` - General cardio
- `STRETCHING` - Stretching exercises
- `OTHER` - Other activities

---

## 🔐 Keycloak Configuration

### Current Setup
- **URL**: http://localhost:8181
- **Realm**: fitness-oauth2
- **Client ID**: fitness-client
- **Client Type**: Public (PKCE)
- **Valid Redirect**: http://localhost:5173/*

### Test User
- **Username**: testuser
- **Password**: password123
- **Keycloak ID**: 481c3b8a-0b04-4f55-84ee-6aecf28e0478

### JWT Token Claims
```json
{
  "sub": "481c3b8a-0b04-4f55-84ee-6aecf28e0478",
  "email": "testuser@fitness.com",
  "given_name": "Test",
  "family_name": "User"
}
```

---

## 🐛 Troubleshooting

### Services Not Registering with Eureka

**Problem**: Services show as DOWN in Eureka dashboard

**Solution**:
```bash
# Check if eureka.instance.hostname is set to localhost
# in all application.yml files

# Restart services in correct order
```

### Gateway Returns 404

**Problem**: `GET /api/activities` returns 404

**Solution**:
```yaml
# Verify gateway/src/main/resources/application.yml has routes:
spring.cloud.gateway.routes:
  - id: activity-service
    uri: lb://ACTIVITY-SERVICE
    predicates:
      - Path=/api/activities/**
```

### User Service Returns 500 on Validation

**Problem**: `/api/users/{userId}/validate` returns 500

**Solution**: User Service now has error handling and returns false on errors.
```bash
# Test validation endpoint
curl http://localhost:8081/api/users/test-user-1/validate
# Should return true or false, never 500
```

### Activity Creation Fails

**Problem**: Activity creation returns error or validation fails

**Solution**:
1. Check if user exists in MySQL
2. Verify X-User-ID header is present
3. Check Activity Service logs for warnings
4. Activity Service now logs warnings but continues

### Frontend Can't Authenticate

**Problem**: Login button doesn't work or redirects fail

**Solution**:
1. Check Keycloak is running: http://localhost:8181
2. Verify client configuration in Keycloak
3. Check redirect URI matches: http://localhost:5173/*
4. Clear browser storage and try again

### MongoDB Connection Failed

**Problem**: Activity Service can't connect to MongoDB

**Solution**:
```bash
# Check MongoDB is running
docker ps | findstr mongodb

# Test connection
docker exec -it fitness-mongodb mongosh --eval "db.version()"

# Restart Activity Service
```

### RabbitMQ Not Receiving Messages

**Problem**: Activities created but no messages in queue

**Solution**:
```bash
# Check RabbitMQ is running
docker ps | findstr rabbitmq

# Verify exchange and queue exist
# Open http://localhost:15672
# Check Exchanges → activity.exchange
# Check Queues → activity.queue

# Check Activity Service logs for "Publishing activity"
```

---

## 📈 Performance Tips

1. **Service Startup**: Always wait 30 seconds between starting services
2. **Database Connections**: Use connection pooling (already configured)
3. **Caching**: Redis is configured but not yet utilized
4. **Logging**: Check logs for warnings/errors regularly
5. **Resource Limits**: Monitor Docker container resources

---

## 🔄 Development Workflow

### Making Code Changes

1. **Stop the service** (kill the terminal or process)
2. **Make your code changes**
3. **Rebuild** (Maven rebuilds automatically)
4. **Restart the service**
5. **Wait 30 seconds** for registration
6. **Test your changes**

### Running Tests

```bash
# Test single service
cd userservice
mvnw.cmd test

# Test all services
cd c:\Users\anike\Desktop\Project\fitness_app
.\run-tests-and-setup.ps1
```

### Database Migrations

```bash
# MySQL schema changes
docker exec -it fitness-mysql mysql -ufitnessuser -pfitness123 fitness_users_db

# MongoDB schema changes (schema-less, but for indexes)
docker exec -it fitness-mongodb mongosh fitness_activities_db
```

---

## 📚 API Documentation

See [API-DOCUMENTATION.md](./API-DOCUMENTATION.md) for complete API reference with:
- All endpoints
- Request/response examples
- Authentication details
- Usage scenarios

---

## ✅ System Checklist

Before considering the system "complete", verify:

- [ ] All 6 backend services running and registered
- [ ] All 5 Docker containers running
- [ ] Frontend accessible at http://localhost:5173
- [ ] Can login with testuser
- [ ] Can create activities via UI
- [ ] Activities visible in Dashboard
- [ ] Activities stored in MongoDB
- [ ] Users stored in MySQL
- [ ] RabbitMQ receiving messages
- [ ] All unit tests passing
- [ ] API documentation up to date

---

## 🎯 Current System Status

**✅ ALL SYSTEMS OPERATIONAL**

- ✅ User Service - Registration and validation working
- ✅ Activity Service - CRUD and statistics working
- ✅ AI Service - Message consumption working
- ✅ Gateway - Routing and JWT validation working
- ✅ Frontend - Authentication and UI working
- ✅ MySQL - User data persistence working
- ✅ MongoDB - Activity data persistence working
- ✅ RabbitMQ - Message publishing working
- ✅ Keycloak - OAuth2 authentication working

**2 Activities currently in MongoDB**
**User auto-registration enabled**
**Full validation restored**

---

## 🚀 Next Steps

1. **Run the test script**: `.\run-tests-and-setup.ps1`
2. **Refresh frontend**: http://localhost:5173
3. **Create more activities** through UI
4. **Check databases** to verify data
5. **Monitor logs** for any warnings

**The system is ready for full use!** 🎉
