# FitTrack User Guide

Complete guide to using and developing the FitTrack fitness tracking application.

---

## 🚀 Quick Start

### First Time Setup

```powershell
# 1. Start Docker infrastructure
docker-compose up -d

# 2. Start all microservices
.\run-all.ps1

# 3. Configure Keycloak (one-time)
# Open <http://localhost:8181> and follow Keycloak setup below

# 4. Open the app
# <http://localhost:5173>
```

### Daily Use

```powershell
# Start everything
docker-compose up -d
.\run-all.ps1

# Stop everything
.\stop-all.ps1
docker-compose down
```

---

## 💻 System Requirements

### Required Software

| Tool | Version | Purpose |
|------|---------|---------|
| **Java JDK** | 21 or higher | Backend microservices |
| **Node.js** | 18+ | Frontend development |
| **Docker Desktop** | Latest | Infrastructure (MongoDB, RabbitMQ, etc.) |
| **Maven** | 3.6+ (included via wrapper) | Build tool |

### Required Ports

| Port | Service | Access |
|------|---------|--------|
| 8761 | Eureka | <http://localhost:8761> |
| 8888 | Config Server | <http://localhost:8888> |
| 8080 | API Gateway | <http://localhost:8080> |
| 8081 | Activity Service | Internal |
| 8082 | User Service | Internal |
| 8083 | AI Service | Internal |
| 5173 | Frontend (Vite) | <http://localhost:5173> |
| 8181 | Keycloak | <http://localhost:8181> |
| 27017 | MongoDB | localhost:27017 |
| 5672 | RabbitMQ | localhost:5672 |
| 15672 | RabbitMQ UI | <http://localhost:15672> |
| 3307 | MySQL | localhost:3307 |
| 6379 | Redis | localhost:6379 |

---

## 🛠️ Installation & Setup

### Step 1: Install Prerequisites

**Java JDK 21:**

- Download: <https://www.oracle.com/java/technologies/downloads/#java21>
- Set JAVA_HOME: `C:\Program Files\Java\jdk-21`

**Node.js:**

- Download: <https://nodejs.org/>
- Install LTS version

**Docker Desktop:**

- Download: <https://www.docker.com/products/docker-desktop>
- Start Docker Desktop

### Step 2: Verify Installation

```powershell
.\check-prerequisites.ps1
```

This checks:

- Java version (must be 21+)
- Node.js and npm
- MongoDB availability
- Port availability
- Existing processes

### Step 3: Start Infrastructure

```powershell
# Start Docker containers
docker-compose up -d

# Check status
docker ps
```

**What starts:**

- MongoDB (database for activities)
- RabbitMQ (messaging for AI service)
- MySQL (database for users)
- Redis (caching)
- Keycloak (authentication)

### Step 4: Start Microservices

```powershell
.\run-all.ps1
```

This opens 7 PowerShell windows for:

1. Config Server (8888)
2. Eureka Server (8761)
3. User Service (8082)
4. Activity Service (8081)
5. AI Service (8083)
6. API Gateway (8080)
7. Frontend (5173)

**Wait 30-60 seconds** for all services to start.

---

## 🔐 Keycloak Authentication Setup

### One-Time Configuration

#### 1. Access Keycloak Admin Console

- URL: <http://localhost:8181>
- Username: `admin`
- Password: `admin`

#### 2. Create Realm

1. Click **"master"** dropdown (top-left)
2. Click **"Create Realm"**
3. Realm name: `fitness-oauth2`
4. Click **"Create"**

#### 3. Create OAuth Client

1. Navigate to **Clients** → **Create client**
2. **General Settings:**
   - Client ID: `oauth2-user1-client`
   - Client type: OpenID Connect
   - Click **"Next"**

3. **Capability config:**
   - Client authentication: **OFF**
   - Standard flow: **ON**
   - Direct access grants: **ON**
   - Click **"Next"**

4. **Login settings:**
   - Valid redirect URIs: `<http://localhost:5173/*>`
   - Valid post logout redirect URIs: `<http://localhost:5173/*>`
   - Web origins: `<http://localhost:5173>`
   - Click **"Save"**

#### 4. Create Test User

1. Navigate to **Users** → **Create new user**
2. Fill in:
   - Username: `testuser`
   - Email: `test@fitness.com`
   - Email verified: **ON**
3. Click **"Create"**
4. Go to **Credentials** tab
5. Click **"Set password"**
   - Password: `test123`
   - Temporary: **OFF**
6. Click **"Save"**

---

## 🎯 Using the Application

### Access the App

<http://localhost:5173>

### Login

- **Username:** `testuser`
- **Password:** `test123`

### Features

#### 1. Track Activities

- Add new fitness activities
- Specify type (running, cycling, swimming, etc.)
- Record duration, distance, calories
- Add notes

#### 2. View Activity History

- See all your logged activities
- Filter by date or type
- View detailed statistics

#### 3. AI Recommendations

- Get personalized fitness insights
- View activity-specific recommendations
- Track progress over time

#### 4. User Profile

- Update personal information
- View account settings
- Manage preferences

---

## 🐳 Docker Infrastructure

### Services Overview

#### MongoDB

```yaml
Port: 27017
Connection: mongodb://localhost:27017
Admin: admin / admin123
Used by: Activity Service, AI Service
```

#### RabbitMQ

```yaml
AMQP Port: 5672
Management UI: <http://localhost:15672>
Credentials: guest / guest
Used by: AI Service (event-driven processing)
```

#### MySQL

```yaml
Port: 3307
Connection: jdbc:mysql://localhost:3307/fitness_users
Credentials: fitness / fitness123
Used by: User Service (optional)
```

#### Redis

```yaml
Port: 6379
Connection: redis://localhost:6379
Used by: Caching (optional)
```

#### Keycloak

```yaml
Port: 8181
Admin Console: <http://localhost:8181>
Credentials: admin / admin
Used by: OAuth2 authentication
```

### Docker Commands

```powershell
# Start all infrastructure
docker-compose up -d

# Stop all infrastructure
docker-compose down

# Stop and remove data
docker-compose down -v

# View logs
docker-compose logs -f mongodb
docker-compose logs -f rabbitmq
docker-compose logs -f keycloak

# Restart specific service
docker-compose restart mongodb

# Check status
docker ps
```

---

## 🛠️ Developer Tools

### Eureka Dashboard

**URL:** <http://localhost:8761>

**Purpose:** Service discovery and registration

**View:**

- All registered microservices
- Service health status
- Instance information
- Replica details

### RabbitMQ Management

**URL:** <http://localhost:15672>
**Login:** guest / guest

**Features:**

- View message queues
- Monitor message flow
- Check exchange bindings
- View connection status

### Keycloak Admin Console

**URL:** <http://localhost:8181>
**Login:** admin / admin

**Manage:**

- User accounts
- OAuth2 clients
- Realms and roles
- Session management

### API Gateway

**URL:** <http://localhost:8080>

**Routes:**

- `/api/activities` → Activity Service
- `/api/recommendations` → AI Service
- `/api/users` → User Service

**Testing:**

```powershell
# Test gateway health
curl http://localhost:8080/actuator/health

# Test with authentication
curl http://localhost:8080/api/activities -H "Authorization: Bearer <token>"
```

---

## 🔧 Scripts Reference

### check-prerequisites.ps1

**Purpose:** Verify system requirements

**Checks:**

- Java version (≥21)
- Node.js and npm
- MongoDB connection
- Port availability
- Existing processes

**Usage:**

```powershell
.\check-prerequisites.ps1
```

### run-all.ps1

**Purpose:** Start all microservices

**Features:**

- Opens each service in separate PowerShell window
- Sets correct JAVA_HOME
- Installs frontend dependencies
- Starts services in correct order

**Usage:**

```powershell
.\run-all.ps1
```

### stop-all.ps1

**Purpose:** Stop all running services

**Actions:**

- Stops all Java processes
- Stops all Node.js processes
- Clean shutdown

**Usage:**

```powershell
.\stop-all.ps1
```

### start-infrastructure.ps1

**Purpose:** Start Docker containers

**Usage:**

```powershell
.\start-infrastructure.ps1
```

### stop-infrastructure.ps1

**Purpose:** Stop Docker containers

**Usage:**

```powershell
.\stop-infrastructure.ps1
```

---

## 🐛 Troubleshooting

### Service Won't Start

**Java Version Error:**

```text
UnsupportedClassVersionError: class file version 65.0
```

**Solution:**

```powershell
# Check Java version
java -version

# Set JAVA_HOME to JDK 21
$env:JAVA_HOME = "C:\Program Files\Java\jdk-21"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"
```

### Port Already in Use

**Error:**

```text
Port 8080 is already in use
```

**Solution:**

```powershell
# Find process using port
netstat -ano | findstr :8080

# Kill process (replace PID)
Stop-Process -Id <PID> -Force
```

### MongoDB Connection Failed

**Check MongoDB:**

```powershell
# Verify MongoDB is running
docker ps | findstr mongodb

# View MongoDB logs
docker logs fitness-mongodb

# Restart MongoDB
docker-compose restart mongodb
```

### RabbitMQ Connection Issues

**Verify RabbitMQ:**

```powershell
# Check RabbitMQ status
docker ps | findstr rabbitmq

# Access management UI
start http://localhost:15672

# Restart RabbitMQ
docker-compose restart rabbitmq
```

### Keycloak "Realm Not Found"

**Solution:**

1. Open <http://localhost:8181>
2. Verify realm name is exactly `fitness-oauth2`
3. Check client ID is `oauth2-user1-client`
4. Verify redirect URIs include `http://localhost:5173/*`

### Frontend "Connection Refused"

**Possible causes:**

1. Gateway not running → Start with `.\run-all.ps1`
2. Keycloak not configured → Follow Keycloak setup
3. CORS issue → Check Gateway SecurityConfig.java

### Services Keep Crashing

**Check logs in PowerShell windows for:**

- Compilation errors
- Missing dependencies
- Configuration issues
- Port conflicts

**Common fixes:**

```powershell
# Clean restart
.\stop-all.ps1
docker-compose down
docker-compose up -d
.\run-all.ps1
```

---

## 📚 Additional Resources

### Project Structure

See [README.md](README.md) for complete architecture overview

### Development Guide

See [DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md) for coding guidelines

### Docker Details

See [README-DOCKER.md](README-DOCKER.md) for infrastructure management

---

## 🎓 Learning Resources

### Spring Boot & Microservices

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Cloud Netflix](https://spring.io/projects/spring-cloud-netflix)
- [Spring Cloud Gateway](https://spring.io/projects/spring-cloud-gateway)

### OAuth2 & Keycloak

- [Keycloak Documentation](https://www.keycloak.org/documentation)
- [OAuth 2.0 Guide](https://oauth.net/2/)

### Docker & Containers

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Guide](https://docs.docker.com/compose/)

### Frontend (React + Vite)

- [React Documentation](https://react.dev/)
- [Vite Guide](https://vitejs.dev/guide/)

---

## 💡 Tips & Best Practices

### Daily Development

1. Always start Docker first: `docker-compose up -d`
2. Wait for infrastructure to be healthy
3. Then start microservices: `.\run-all.ps1`
4. Check Eureka to verify all services registered

### Before Committing Code

1. Run tests: `.\mvnw.cmd test`
2. Check for errors: `.\check-prerequisites.ps1`
3. Verify all services still work
4. Update documentation if needed

### Performance Tips

1. Keep Docker Desktop running in background
2. Allocate sufficient memory to Docker (4GB+)
3. Close unnecessary PowerShell windows
4. Monitor resource usage in Task Manager

### Security Notes

- Change default passwords in production
- Use environment variables for secrets
- Enable HTTPS/TLS for production
- Regularly update dependencies

---

## 📞 Support

### Common Commands Summary

```powershell
# Complete startup
docker-compose up -d && .\run-all.ps1

# Complete shutdown
.\stop-all.ps1 && docker-compose down

# Check everything
.\check-prerequisites.ps1

# Restart single service (example: gateway)
# Just close its PowerShell window and reopen manually
cd gateway
.\mvnw.cmd spring-boot:run

# View service logs
# Check the PowerShell window for each service
```

**For issues, check the PowerShell windows where services are running - they show detailed error messages.**

---

**Version:** 1.0  
**Last Updated:** December 2025
