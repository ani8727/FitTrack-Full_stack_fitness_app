# Fitness App - Complete API Documentation

## Base URLs
- **Gateway (Recommended)**: `http://localhost:8085`
- **User Service**: `http://localhost:8081`
- **Activity Service**: `http://localhost:8082`
- **AI Service**: `http://localhost:8083`

## Authentication
All Gateway requests require JWT token:
```
Authorization: Bearer <your_jwt_token>
```

Get JWT token by logging in at: http://localhost:5173

---

## 🔐 User Service APIs

### 1. Register New User
```http
POST /api/users/register
Content-Type: application/json

{
  "keycloakId": "481c3b8a-0b04-4f55-84ee-6aecf28e0478",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "password": "password123"
}
```

**Response:**
```json
{
  "id": "uuid",
  "keycloakId": "481c3b8a-0b04-4f55-84ee-6aecf28e0478",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "USER",
  "createAt": "2026-01-01T10:00:00",
  "updateAt": "2026-01-01T10:00:00"
}
```

### 2. Get User Profile
```http
GET /api/users/{userId}
```

**Response:**
```json
{
  "id": "uuid",
  "keycloakId": "481c3b8a-0b04-4f55-84ee-6aecf28e0478",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "USER",
  "createAt": "2026-01-01T10:00:00",
  "updateAt": "2026-01-01T10:00:00"
}
```

### 3. Validate User Exists
```http
GET /api/users/{keycloakId}/validate
```

**Response:**
```json
true  // or false
```

---

## 🏃 Activity Service APIs

### 1. Create Activity
```http
POST /api/activities
X-User-ID: 481c3b8a-0b04-4f55-84ee-6aecf28e0478
Content-Type: application/json

{
  "type": "RUNNING",
  "duration": 30,
  "caloriesBurned": 300,
  "startTime": "2026-01-01T10:00:00",
  "additionalMetrics": {
    "distance": 5.0,
    "avgHeartRate": 150
  }
}
```

**Activity Types:**
- `RUNNING`
- `WALKING`
- `CYCLING`
- `SWIMMING`
- `WEIGHT_TRAINING`
- `YOGA`
- `HIIT`
- `CARDIO`
- `STRETCHING`
- `OTHER`

**Response:**
```json
{
  "id": "695679b01a66b994168f7ca9",
  "userId": "481c3b8a-0b04-4f55-84ee-6aecf28e0478",
  "type": "RUNNING",
  "duration": 30,
  "caloriesBurned": 300,
  "startTime": "2026-01-01T10:00:00",
  "additionalMetrics": {
    "distance": 5.0,
    "avgHeartRate": 150
  },
  "createdAt": "2026-01-01T10:00:00",
  "updatedAt": "2026-01-01T10:00:00"
}
```

### 2. Get All User Activities
```http
GET /api/activities
X-User-ID: 481c3b8a-0b04-4f55-84ee-6aecf28e0478
```

**Response:**
```json
[
  {
    "id": "695679b01a66b994168f7ca9",
    "userId": "481c3b8a-0b04-4f55-84ee-6aecf28e0478",
    "type": "RUNNING",
    "duration": 30,
    "caloriesBurned": 300,
    "startTime": null,
    "additionalMetrics": null,
    "createdAt": "2026-01-01T10:00:00",
    "updatedAt": "2026-01-01T10:00:00"
  }
]
```

### 3. Get Single Activity
```http
GET /api/activities/{activityId}
```

**Response:** Same as Create Activity response

### 4. Get User Statistics
```http
GET /api/activities/stats
X-User-ID: 481c3b8a-0b04-4f55-84ee-6aecf28e0478
```

**Response:**
```json
{
  "count": 5,
  "totalDurationMinutes": 150,
  "totalCaloriesBurned": 1500,
  "avgCaloriesPerActivity": 300.0
}
```

### 5. Delete Activity
```http
DELETE /api/activities/{activityId}
X-User-ID: 481c3b8a-0b04-4f55-84ee-6aecf28e0478
```

**Response:** `200 OK`

---

## 🤖 AI Service APIs

### 1. Get AI Recommendations
```http
GET /api/recommendations/{userId}
```

**Response:**
```json
{
  "userId": "481c3b8a-0b04-4f55-84ee-6aecf28e0478",
  "recommendations": [
    {
      "type": "workout",
      "title": "Increase Cardio",
      "description": "Based on your recent activities, we recommend adding more cardio workouts",
      "priority": "high"
    }
  ],
  "generatedAt": "2026-01-01T10:00:00"
}
```

---

## 🌐 Gateway APIs (All APIs via Gateway)

All the above APIs can be accessed through Gateway at `http://localhost:8085` with JWT authentication.

**Example:**
```http
GET http://localhost:8085/api/activities
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
```

Gateway automatically:
- ✅ Validates JWT token
- ✅ Extracts user ID from token
- ✅ Auto-registers new users
- ✅ Adds `X-User-ID` header to downstream requests
- ✅ Routes to appropriate microservice

---

## 📊 Complete Usage Examples

### Example 1: Create User and Add Activities

```bash
# 1. Register User (via User Service)
curl -X POST http://localhost:8081/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "keycloakId": "481c3b8a-0b04-4f55-84ee-6aecf28e0478",
    "email": "test@fitness.com",
    "firstName": "Test",
    "lastName": "User",
    "password": "password123"
  }'

# 2. Add Running Activity
curl -X POST http://localhost:8082/api/activities \
  -H "Content-Type: application/json" \
  -H "X-User-ID: 481c3b8a-0b04-4f55-84ee-6aecf28e0478" \
  -d '{
    "type": "RUNNING",
    "duration": 30,
    "caloriesBurned": 300
  }'

# 3. Add Cycling Activity
curl -X POST http://localhost:8082/api/activities \
  -H "Content-Type: application/json" \
  -H "X-User-ID: 481c3b8a-0b04-4f55-84ee-6aecf28e0478" \
  -d '{
    "type": "CYCLING",
    "duration": 45,
    "caloriesBurned": 400
  }'

# 4. Get All Activities
curl -H "X-User-ID: 481c3b8a-0b04-4f55-84ee-6aecf28e0478" \
  http://localhost:8082/api/activities

# 5. Get Statistics
curl -H "X-User-ID: 481c3b8a-0b04-4f55-84ee-6aecf28e0478" \
  http://localhost:8082/api/activities/stats
```

### Example 2: Via Gateway with JWT

```bash
# Login to get JWT token
# Go to http://localhost:5173 and login
# Copy JWT token from DevTools > Application > Session Storage

# Use Gateway endpoints with JWT
curl -X POST http://localhost:8085/api/activities \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "type": "SWIMMING",
    "duration": 60,
    "caloriesBurned": 500
  }'

# Get activities via Gateway
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:8085/api/activities
```

### Example 3: Complete Workflow

```bash
# 1. Login to frontend
# Visit: http://localhost:5173
# Login with: testuser / password123

# 2. Frontend automatically gets JWT token

# 3. Add activities through UI or API

# 4. View activities in Dashboard

# 5. Check data in databases:

# MySQL Users
docker exec -it fitness-mysql mysql -ufitnessuser -pfitness123 \
  -e "SELECT * FROM fitness_users_db.users;"

# MongoDB Activities
docker exec -it fitness-mongodb mongosh \
  --eval "use fitness_activities_db; db.activities.find().pretty()"
```

---

## 🔄 RabbitMQ Integration

When an activity is created, it's automatically published to RabbitMQ:

**Exchange:** `activity.exchange`  
**Queue:** `activity.queue`  
**Routing Key:** `activity.tracking`

AI Service consumes these messages for generating recommendations.

**Check RabbitMQ:**
- URL: http://localhost:15672
- User: guest
- Pass: guest

---

## 🗄️ Database Schemas

### MySQL - users table
```sql
CREATE TABLE users (
  id VARCHAR(255) PRIMARY KEY,
  keycloak_id VARCHAR(255) UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  password VARCHAR(255) NOT NULL,
  role ENUM('ADMIN', 'USER'),
  create_at DATETIME(6),
  update_at DATETIME(6)
);
```

### MongoDB - activities collection
```javascript
{
  "_id": ObjectId("695679b01a66b994168f7ca9"),
  "userId": "481c3b8a-0b04-4f55-84ee-6aecf28e0478",
  "type": "RUNNING",
  "duration": 30,
  "caloriesBurned": 300,
  "startTime": ISODate("2026-01-01T10:00:00Z"),
  "additionalMetrics": {
    "distance": 5.0,
    "avgHeartRate": 150
  },
  "createdAt": ISODate("2026-01-01T10:00:00Z"),
  "updatedAt": ISODate("2026-01-01T10:00:00Z")
}
```

---

## ✅ Testing All Endpoints

Use the PowerShell script:
```powershell
.\run-tests-and-setup.ps1
```

This will:
1. Create 3 test users
2. Create 5 test activities
3. Run all unit tests
4. Verify data in databases
5. Show summary report

---

## 🚀 Quick Start Commands

```bash
# Start all Docker containers
docker start fitness-mysql fitness-mongodb fitness-rabbitmq fitness-redis fitness-keycloak

# Start all services (in order, wait 30 sec between each)
cd eureka && start "Eureka" cmd /c "mvnw.cmd spring-boot:run"
cd configserver && start "Config" cmd /c "mvnw.cmd spring-boot:run"
cd userservice && start "User Service" cmd /c "mvnw.cmd spring-boot:run"
cd activityservice && start "Activity Service" cmd /c "mvnw.cmd spring-boot:run"
cd aiservice && start "AI Service" cmd /c "mvnw.cmd spring-boot:run"
cd gateway && start "Gateway" cmd /c "mvnw.cmd spring-boot:run"

# Start frontend
cd fitness-app-frontend && npm run dev
```

Access: **http://localhost:5173**

---

## 📱 Frontend Features

- ✅ User Authentication (Keycloak OAuth2 PKCE)
- ✅ Dashboard with activity summary
- ✅ Activity Chart visualization
- ✅ Quick Add Activity form
- ✅ Activity History list
- ✅ Health Insights
- ✅ JWT token management
- ✅ Responsive design

---

## 🎯 Current System Status

**All services are fully operational:**

✅ **User Service** - Registration, validation, profile management  
✅ **Activity Service** - CRUD operations, statistics, auto-validation  
✅ **AI Service** - Recommendation generation  
✅ **Gateway** - Routing, JWT validation, auto user registration  
✅ **Frontend** - Full UI with all features  
✅ **RabbitMQ** - Message publishing and consumption  
✅ **MongoDB** - Activity data persistence  
✅ **MySQL** - User data persistence  

**All APIs are working and tested!** 🎉
