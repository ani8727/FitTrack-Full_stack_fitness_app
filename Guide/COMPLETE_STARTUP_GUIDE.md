# Complete Startup Guide - FitTrack Application

This guide provides the complete steps to start the FitTrack application with all services.

---

## Step 1: Start Docker Services (MySQL, MongoDB, RabbitMQ, Keycloak, Redis)

```cmd
cd c:\Users\anike\Desktop\Project\fitness_app
docker-compose up -d
```

**Wait 30 seconds for all services to be healthy.**

Verify services are running:
```cmd
docker-compose ps
```

You should see:
- ✅ fitness-mysql (port 3307)
- ✅ fitness-mongodb (port 27017)
- ✅ fitness-rabbitmq (ports 5672, 15672)
- ✅ fitness-keycloak (port 8181)
- ✅ fitness-redis (port 6379)

---

## Step 2: Create RabbitMQ Queue

### Option A: Manual Creation (Recommended)

1. **Open RabbitMQ Management Console:**
   - URL: http://localhost:15672
   - Login: `guest` / `guest`

2. **Create Exchange:**
   - Click **"Exchanges"** tab
   - Click **"Add a new exchange"**
   - Name: `activity.exchange`
   - Type: **direct**
   - Durability: **Durable**
   - Click **"Add exchange"**

3. **Create Queue:**
   - Click **"Queues"** tab
   - Click **"Add a new queue"**
   - Name: `activity.queue`
   - Durability: **Durable**
   - Click **"Add queue"**

4. **Create Binding:**
   - Click on `activity.queue`
   - Scroll to **"Bindings"**
   - From exchange: `activity.exchange`
   - Routing key: `activity.tracking`
   - Click **"Bind"**

### Option B: Automatic (via Activity Service startup)

Activity Service will create the queue automatically when it starts, but you need to ensure it starts before AI Service.

---

## Step 3: Start Spring Boot Microservices

### Option A: Manual Startup (Recommended for First Time)

**Start services in this exact order:**

1. **Eureka Server (Registry):**
```cmd
cd eureka
start cmd /k "mvnw.cmd spring-boot:run"
cd ..
```
Wait 20 seconds for "Started EurekaApplication"

2. **Config Server:**
```cmd
cd configserver
start cmd /k "mvnw.cmd spring-boot:run"
cd ..
```
Wait 20 seconds for "Started ConfigserverApplication"

3. **User Service:**
```cmd
cd userservice
start cmd /k "mvnw.cmd spring-boot:run"
cd ..
```
Wait 15 seconds for "Started UserserviceApplication"

4. **Activity Service (Creates RabbitMQ Queue):**
```cmd
cd activityservice
start cmd /k "mvnw.cmd spring-boot:run"
cd ..
```
Wait 20 seconds for "Started ActivityserviceApplication"

5. **AI Service (Consumes from Queue):**
```cmd
cd aiservice
start cmd /k "mvnw.cmd spring-boot:run"
cd ..
```
Wait 15 seconds for "Started AiserviceApplication"

6. **Gateway:**
```cmd
cd gateway
start cmd /k "mvnw.cmd spring-boot:run"
cd ..
```
Wait 20 seconds for "Started GatewayApplication"

### Option B: Automated Startup Script

```cmd
start-services-manual.bat
```

This will start all services automatically with proper timing.

---

## Step 4: Verify All Services Are Running

Check Eureka Dashboard:
- Open: http://localhost:8761
- You should see 5 registered instances:
  - API-GATEWAY
  - USER-SERVICE
  - ACTIVITY-SERVICE
  - AI-SERVICE

Check service health:
```cmd
netstat -ano | findstr "8761 8888 8081 8082 8083 8085"
```

All 6 ports should be LISTENING.

---

## Step 5: Configure Keycloak

Follow the detailed guide: [KEYCLOAK_SETUP.md](KEYCLOAK_SETUP.md)

**Quick Summary:**
1. Open http://localhost:8181
2. Login: `admin` / `admin`
3. Create realm: `fitness-oauth2`
4. Create client: `fitness-client`
5. Create user: `testuser` / `password123`

---

## Step 6: Start Frontend

```cmd
cd fitness-app-frontend
npm run dev
```

Frontend will start on: http://localhost:5173

---

## Step 7: Test the Application

### Test 1: User Registration
1. Open http://localhost:5173
2. Click "Sign Up" or navigate to registration
3. Fill in user details
4. Submit form
5. Verify user created in database

### Test 2: Login with Keycloak
1. Click "Login" button
2. Redirected to Keycloak: http://localhost:8181
3. Enter credentials: `testuser` / `password123`
4. Click "Sign In"
5. Redirected back to app (authenticated)

### Test 3: Activity Tracking
1. Login as testuser
2. Navigate to "Track Activity"
3. Add new activity:
   - Type: Running
   - Duration: 30 minutes
   - Distance: 5 km
4. Submit activity
5. Verify activity saved to MongoDB
6. Check RabbitMQ queue for message

### Test 4: AI Recommendations
1. After adding activity, AI Service processes the message
2. Navigate to "Recommendations" page
3. View AI-generated workout suggestions
4. Verify recommendations stored in MongoDB

---

## Service URLs Summary

| Service | URL | Credentials |
|---------|-----|-------------|
| Frontend | http://localhost:5173 | - |
| Gateway | http://localhost:8085 | - |
| Eureka Dashboard | http://localhost:8761 | - |
| Config Server | http://localhost:8888 | - |
| User Service | http://localhost:8081 | - |
| Activity Service | http://localhost:8082 | - |
| AI Service | http://localhost:8083 | - |
| Keycloak Admin | http://localhost:8181 | admin / admin |
| RabbitMQ Management | http://localhost:15672 | guest / guest |
| MySQL | localhost:3307 | fitnessuser / fitness123 |
| MongoDB | localhost:27017 | root / @ani.8727M |
| Redis | localhost:6379 | - |

---

## Troubleshooting

### Issue: AI Service fails with "queue not found"
**Solution:** 
1. Ensure Activity Service started successfully
2. Check RabbitMQ console for `activity.queue`
3. Manually create queue (see Step 2)
4. Restart AI Service: `restart-ai-service.bat`

### Issue: User Service can't connect to MySQL
**Solution:**
1. Verify Docker MySQL is running: `docker ps | findstr mysql`
2. Check port 3307 is available: `netstat -ano | findstr :3307`
3. Test connection: `docker exec -it fitness-mysql mysql -u fitnessuser -pfitness123 -e "SHOW DATABASES;"`
4. If needed, stop local MySQL to free port 3306

### Issue: Services can't reach Eureka
**Solution:**
1. Ensure Eureka started first
2. Check port 8761: `netstat -ano | findstr :8761`
3. Verify Eureka dashboard loads: http://localhost:8761
4. Restart services after Eureka is up

### Issue: Config Server warnings in logs
**Solution:** 
- Config warnings are normal if no Git repo configured
- Services fall back to local application.yml files

### Issue: Frontend CORS errors
**Solution:**
1. Ensure Gateway is running
2. Check Gateway logs for CORS configuration
3. Verify frontend uses Gateway URL for API calls

---

## Stop All Services

### Stop Spring Boot Services:
```cmd
stop-all.ps1
```

Or manually close all CMD windows.

### Stop Docker Services:
```cmd
docker-compose down
```

To also remove data volumes:
```cmd
docker-compose down -v
```

---

## Quick Start (After First Setup)

Once everything is configured:

```cmd
# 1. Start Docker
docker-compose up -d

# 2. Wait 30 seconds, then start Spring Boot services
start-services-manual.bat

# 3. Wait 2 minutes, then start frontend
cd fitness-app-frontend
npm run dev
```

**Total startup time: ~3-4 minutes**

---

## Development Tips

### Restart Individual Service:
```cmd
# Find PID
netstat -ano | findstr :8083

# Kill process
taskkill /F /PID <PID>

# Restart
cd aiservice
mvnw.cmd spring-boot:run
```

### View Logs:
- Spring Boot: Check individual CMD windows
- Docker: `docker-compose logs -f <service-name>`
- Example: `docker-compose logs -f rabbitmq`

### Check RabbitMQ Queue Messages:
1. Open http://localhost:15672
2. Click "Queues" tab
3. Click `activity.queue`
4. See message count and rate

### Check MongoDB Data:
```cmd
docker exec -it fitness-mongodb mongosh -u root -p '@ani.8727M'
use fitness_activities
db.activities.find().pretty()
db.recommendations.find().pretty()
```

### Check MySQL Data:
```cmd
docker exec -it fitness-mysql mysql -u fitnessuser -pfitness123 fitness_users_db
SELECT * FROM users;
```

---

## Next Steps

1. ✅ Complete Keycloak setup (KEYCLOAK_SETUP.md)
2. ✅ Test user registration and authentication
3. ✅ Test activity tracking and AI recommendations
4. Configure email notifications (optional)
5. Set up production deployment (optional)

---

## Support

For issues, check:
- Service logs in CMD windows
- Docker logs: `docker-compose logs`
- Eureka dashboard: http://localhost:8761
- RabbitMQ console: http://localhost:15672

Common log locations:
- Spring Boot: Console output in CMD windows
- Docker: `docker-compose logs <service-name>`
