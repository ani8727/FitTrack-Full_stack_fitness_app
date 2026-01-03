# 🐳 Docker & Docker Compose Complete Guide for Fitness App

## Table of Contents
- [What is Docker?](#what-is-docker)
- [Why Docker?](#why-docker)
- [What is Docker Compose?](#what-is-docker-compose)
- [Architecture Overview](#architecture-overview)
- [Services Running in Our Application](#services-running-in-our-application)
- [Understanding docker-compose.yml](#understanding-docker-composeyml)
- [Installation Guide](#installation-guide)
- [How to Build and Run](#how-to-build-and-run)
- [Managing Containers](#managing-containers)
- [Networking](#networking)
- [Data Persistence (Volumes)](#data-persistence-volumes)
- [Health Checks](#health-checks)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)
- [Common Commands Reference](#common-commands-reference)

---

## What is Docker?

**Docker** is a platform that allows you to package, distribute, and run applications in isolated environments called **containers**.

### Key Concepts:

1. **Container**: A lightweight, standalone, executable package that includes everything needed to run a piece of software (code, runtime, system tools, libraries, and settings).

2. **Image**: A read-only template used to create containers. Think of it as a blueprint.

3. **Dockerfile**: A text file containing instructions to build a Docker image.

4. **Docker Engine**: The core service that creates and runs containers.

### How Docker Works:
```
Application Code + Dependencies → Dockerfile → Docker Image → Container (Running Application)
```

---

## Why Docker?

### Problems Docker Solves:

1. **"It Works on My Machine" Problem**
   - Docker ensures your application runs the same way everywhere (dev, testing, production)

2. **Environment Consistency**
   - Same environment for all developers
   - No dependency conflicts

3. **Easy Setup**
   - New team members can start working in minutes
   - No manual installation of MySQL, MongoDB, RabbitMQ, etc.

4. **Resource Efficiency**
   - Containers are lightweight compared to Virtual Machines
   - Multiple containers can run on the same host

5. **Microservices Architecture**
   - Perfect for running multiple independent services
   - Easy to scale individual services

6. **Isolation**
   - Each service runs in its own container
   - No conflicts between different versions of software

### Benefits for Our Fitness App:

✅ **Quick Setup**: One command starts all services  
✅ **Consistency**: Same database versions for everyone  
✅ **Easy Testing**: Can reset everything quickly  
✅ **Production Ready**: Same setup works in production  
✅ **Team Collaboration**: Everyone uses identical environment  

---

## What is Docker Compose?

**Docker Compose** is a tool for defining and running multi-container Docker applications.

### Why Docker Compose?

Without Docker Compose, you would need to:
1. Manually run each container with long `docker run` commands
2. Manually create networks
3. Manually create volumes
4. Manually manage container dependencies

**With Docker Compose:**
- Define all services in one `docker-compose.yml` file
- Start everything with one command: `docker-compose up`
- Automatically handles networking, volumes, and dependencies

### Docker vs Docker Compose:

| Feature | Docker | Docker Compose |
|---------|--------|----------------|
| Single container | ✅ Easy | ⚠️ Overkill |
| Multiple containers | ❌ Complex | ✅ Easy |
| Configuration | Command line | YAML file |
| Networking | Manual | Automatic |
| Best for | Simple apps | Multi-service apps |

---

## Architecture Overview

Our fitness app uses a **microservices architecture** with the following components:

```
┌─────────────────────────────────────────────────────────────────┐
│                        FITNESS APP                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │
│  │   Config    │  │   Eureka    │  │   Gateway   │           │
│  │   Server    │  │   Server    │  │             │           │
│  │   :8888     │  │   :8761     │  │   :8080     │           │
│  └─────────────┘  └─────────────┘  └─────────────┘           │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │
│  │    User     │  │  Activity   │  │     AI      │           │
│  │  Service    │  │  Service    │  │  Service    │           │
│  │   :8081     │  │   :8082     │  │   :8083     │           │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘           │
│         │                │                 │                   │
├─────────┼────────────────┼─────────────────┼───────────────────┤
│         │                │                 │                   │
│  ┌──────▼──────┐  ┌──────▼──────┐  ┌──────▼──────┐           │
│  │    MySQL    │  │   MongoDB   │  │   MongoDB   │           │
│  │   :3307     │  │   :27017    │  │   :27017    │           │
│  └─────────────┘  └─────────────┘  └─────────────┘           │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │
│  │  Keycloak   │  │  RabbitMQ   │  │    Redis    │           │
│  │  (OAuth2)   │  │ (Messages)  │  │  (Cache)    │           │
│  │   :8181     │  │  :5672      │  │   :6379     │           │
│  └─────────────┘  │  :15672 UI  │  └─────────────┘           │
│                   └─────────────┘                              │
└─────────────────────────────────────────────────────────────────┘
                    fitness-network (Docker Bridge)
```

---

## Services Running in Our Application

### 1. **MySQL Database** 🗄️
- **Image**: `mysql:8.0`
- **Purpose**: Stores user service data (user profiles, authentication details)
- **Port**: `3307:3306` (External:Internal)
- **Credentials**:
  - Root Password: `root123`
  - Database: `fitness_users_db`
  - User: `fitnessuser`
  - Password: `fitness123`

**Why**: Relational database perfect for structured user data

### 2. **MongoDB** 🍃
- **Image**: `mongo:7.0`
- **Purpose**: Stores activity data, workout logs, and AI-generated content
- **Port**: `27017:27017`
- **Credentials**:
  - Username: `root`
  - Password: `@ani.8727M`

**Why**: NoSQL database ideal for flexible, document-based activity data

### 3. **RabbitMQ** 🐰
- **Image**: `rabbitmq:3.13-management`
- **Purpose**: Message broker for asynchronous communication between microservices
- **Ports**:
  - `5672`: AMQP protocol (service communication)
  - `15672`: Management UI (web interface)
- **Credentials**:
  - Username: `guest`
  - Password: `guest`
- **UI Access**: http://localhost:15672

**Why**: Enables reliable, asynchronous messaging between services (e.g., when activity is logged, notify AI service)

### 4. **Keycloak** 🔐
- **Image**: `quay.io/keycloak/keycloak:23.0`
- **Purpose**: OAuth2/OpenID Connect authentication and authorization
- **Port**: `8181:8181`
- **Credentials**:
  - Admin: `admin`
  - Password: `admin`
- **Admin Console**: http://localhost:8181

**Why**: Enterprise-grade identity and access management (SSO, OAuth2, user management)

### 5. **Redis** 💨
- **Image**: `redis:7.2-alpine`
- **Purpose**: In-memory cache for fast data access
- **Port**: `6379:6379`

**Why**: Caches frequently accessed data, reduces database load, improves performance

---

## Understanding docker-compose.yml

Let's break down the `docker-compose.yml` file section by section:

### Basic Structure:
```yaml
services:        # Defines all containers
  service-name:  # Name of the service
    image:       # Docker image to use
    ports:       # Port mapping
    environment: # Environment variables
    volumes:     # Data persistence
    networks:    # Network connection
    healthcheck: # Health monitoring

volumes:         # Named volumes for data persistence
networks:        # Network definitions
```

### Service Configuration Example (MySQL):

```yaml
mysql:
  image: mysql:8.0                    # Use MySQL version 8.0
  container_name: fitness-mysql       # Custom container name
  restart: unless-stopped             # Auto-restart policy
  ports:
    - "3307:3306"                     # Host:Container port mapping
  environment:                        # Configuration variables
    MYSQL_ROOT_PASSWORD: root123
    MYSQL_DATABASE: fitness_users_db
  volumes:                            # Persist data
    - mysql_data:/var/lib/mysql       # Named volume
  networks:                           # Connect to network
    - fitness-network
  healthcheck:                        # Check if service is healthy
    test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
    interval: 10s                     # Check every 10 seconds
    timeout: 5s                       # Wait 5 seconds for response
    retries: 5                        # Try 5 times before marking unhealthy
```

### Port Mapping Explained:
```yaml
ports:
  - "HOST_PORT:CONTAINER_PORT"
```

Example: `"3307:3306"`
- **3307**: Port on your computer (localhost:3307)
- **3306**: Port inside the container
- **Why different**: Avoids conflicts with local MySQL on port 3306

### Environment Variables:
Used to configure containers without rebuilding images:
```yaml
environment:
  MYSQL_ROOT_PASSWORD: root123    # Sets root password
  MYSQL_DATABASE: fitness_users_db # Creates database on startup
```

### Volumes (Data Persistence):
Without volumes, all data is lost when container stops!

```yaml
volumes:
  - mysql_data:/var/lib/mysql     # Named volume
```

**How it works:**
1. `mysql_data`: Volume name (defined at bottom of file)
2. `/var/lib/mysql`: Path inside container where MySQL stores data
3. Data persists even if container is deleted

### Networks:
All services connect to `fitness-network`:
- Services can communicate using service names
- Example: MySQL is accessible at `mysql:3306` from other containers
- Isolated from other Docker networks

### Health Checks:
Monitors if service is running correctly:
```yaml
healthcheck:
  test: ["CMD", "mysqladmin", "ping"]  # Command to check health
  interval: 10s                         # How often to check
  timeout: 5s                           # Max wait time
  retries: 5                            # Failures before "unhealthy"
```

**Benefits:**
- Docker knows when service is ready
- Can restart unhealthy containers
- Dependencies can wait for healthy services

---

## Installation Guide

### Prerequisites:

#### 1. Install Docker Desktop

**Windows:**
1. Download Docker Desktop from: https://www.docker.com/products/docker-desktop
2. Run installer (requires Windows 10/11 Pro, Enterprise, or Education)
3. Enable WSL 2 (Windows Subsystem for Linux)
4. Restart computer
5. Open Docker Desktop and complete setup

**Mac:**
1. Download Docker Desktop for Mac
2. Drag Docker.app to Applications
3. Launch Docker Desktop
4. Complete setup wizard

**Linux:**
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install docker.io docker-compose
sudo systemctl start docker
sudo systemctl enable docker

# Add user to docker group
sudo usermod -aG docker $USER
```

#### 2. Verify Installation:
```bash
docker --version
# Output: Docker version 24.x.x

docker-compose --version
# Output: Docker Compose version v2.x.x
```

#### 3. Check Docker is Running:
```bash
docker ps
# Should show empty list (no errors)
```

### System Requirements:
- **RAM**: Minimum 8GB (16GB recommended)
- **Disk**: At least 20GB free space
- **CPU**: 64-bit processor with virtualization support

---

## How to Build and Run

### Quick Start (Recommended):

#### 1. **Start All Services:**
```bash
cd c:\Users\anike\Desktop\Project\fitness_app
docker-compose up -d
```

**What happens:**
1. Downloads all required images (first time only)
2. Creates network `fitness-network`
3. Creates volumes for data persistence
4. Starts all 5 containers in background (`-d` = detached mode)

**Expected output:**
```
Creating network "fitness_app_fitness-network" with driver "bridge"
Creating volume "fitness_app_mysql_data"
Creating volume "fitness_app_mongodb_data"
...
Creating fitness-mysql ... done
Creating fitness-mongodb ... done
Creating fitness-rabbitmq ... done
Creating fitness-keycloak ... done
Creating fitness-redis ... done
```

#### 2. **Verify Services are Running:**
```bash
docker-compose ps
```

**Healthy output:**
```
NAME                STATUS              PORTS
fitness-mysql       Up 2 minutes        0.0.0.0:3307->3306/tcp
fitness-mongodb     Up 2 minutes        0.0.0.0:27017->27017/tcp
fitness-rabbitmq    Up 2 minutes        0.0.0.0:5672->5672/tcp, 0.0.0.0:15672->15672/tcp
fitness-keycloak    Up 2 minutes        0.0.0.0:8181->8181/tcp
fitness-redis       Up 2 minutes        0.0.0.0:6379->6379/tcp
```

#### 3. **Check Service Health:**
```bash
docker-compose ps | grep "healthy"
```

#### 4. **View Logs:**
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs mysql

# Follow logs in real-time
docker-compose logs -f rabbitmq

# Last 100 lines
docker-compose logs --tail=100
```

### Alternative: Step-by-Step Start

Start services one by one to monitor startup:

```bash
# 1. Start databases first
docker-compose up -d mysql mongodb redis

# 2. Wait for databases to be healthy (30-60 seconds)
docker-compose ps

# 3. Start supporting services
docker-compose up -d rabbitmq keycloak

# 4. Verify all healthy
docker-compose ps
```

### First Time Setup Checklist:

After starting containers:

- [ ] MySQL is healthy: `docker-compose ps mysql`
- [ ] MongoDB is healthy: `docker-compose ps mongodb`
- [ ] RabbitMQ UI accessible: http://localhost:15672
- [ ] Keycloak Admin Console accessible: http://localhost:8181
- [ ] Redis responding: `docker exec fitness-redis redis-cli ping` (returns PONG)

---

## Managing Containers

### Starting Services:

```bash
# Start all services
docker-compose up -d

# Start specific service
docker-compose up -d mysql

# Start multiple services
docker-compose up -d mysql mongodb

# Start in foreground (see logs)
docker-compose up
```

### Stopping Services:

```bash
# Stop all services (keeps containers)
docker-compose stop

# Stop specific service
docker-compose stop mysql

# Stop and remove containers (keeps data volumes)
docker-compose down

# Stop, remove containers AND volumes (⚠️ DELETES ALL DATA)
docker-compose down -v
```

### Restarting Services:

```bash
# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart mysql

# Force restart (stop then start)
docker-compose stop mysql && docker-compose start mysql
```

### Viewing Status:

```bash
# List running containers
docker-compose ps

# Show all containers (including stopped)
docker-compose ps -a

# Show resource usage
docker stats

# Show detailed info
docker-compose ps --services
```

### Accessing Containers:

```bash
# Execute command in container
docker exec fitness-mysql mysql -uroot -proot123 -e "SHOW DATABASES;"

# Interactive shell (MySQL)
docker exec -it fitness-mysql mysql -uroot -proot123

# Interactive bash shell
docker exec -it fitness-mysql bash

# MongoDB shell
docker exec -it fitness-mongodb mongosh -u root -p '@ani.8727M'

# Redis CLI
docker exec -it fitness-redis redis-cli
```

### Updating Services:

```bash
# Pull latest images
docker-compose pull

# Rebuild and restart
docker-compose up -d --build

# Recreate containers
docker-compose up -d --force-recreate
```

---

## Networking

### Network Details:

Our application uses a **bridge network** named `fitness-network`.

```yaml
networks:
  fitness-network:
    driver: bridge
```

### How It Works:

1. **Internal Communication:**
   - Services communicate using **service names**
   - Example: User Service connects to MySQL at `mysql:3306`
   - No need for localhost or IP addresses

2. **External Access:**
   - Services are accessible from host via port mappings
   - Example: MySQL accessible at `localhost:3307`

### Service Discovery:

```java
// Spring Boot application.yml
spring:
  datasource:
    url: jdbc:mysql://mysql:3306/fitness_users_db  # Uses service name!
```

### Network Commands:

```bash
# List networks
docker network ls

# Inspect network
docker network inspect fitness_app_fitness-network

# See which containers are connected
docker network inspect fitness_app_fitness-network | grep Name
```

### Connection Examples:

**From Application to MySQL:**
```
Host: mysql
Port: 3306
```

**From Your Computer to MySQL:**
```
Host: localhost (or 127.0.0.1)
Port: 3307
```

**From Application to MongoDB:**
```
mongodb://root:@ani.8727M@mongodb:27017
```

**From Application to RabbitMQ:**
```
spring.rabbitmq.host=rabbitmq
spring.rabbitmq.port=5672
```

---

## Data Persistence (Volumes)

### Why Volumes?

**Without volumes:**
```
Start Container → Store Data → Stop Container → ❌ DATA LOST
```

**With volumes:**
```
Start Container → Store Data → Stop Container → ✅ DATA PERSISTS
Start Container Again → ✅ DATA STILL THERE
```

### Volume Configuration:

```yaml
volumes:
  mysql_data:       # Stores MySQL database files
  mongodb_data:     # Stores MongoDB collections
  rabbitmq_data:    # Stores RabbitMQ queues and messages
  keycloak_data:    # Stores Keycloak users and realms
  redis_data:       # Stores Redis cached data
```

### Volume Commands:

```bash
# List volumes
docker volume ls

# Inspect volume
docker volume inspect fitness_app_mysql_data

# See volume location on host
docker volume inspect fitness_app_mysql_data | grep Mountpoint

# Check volume size
docker system df -v
```

### Backup and Restore:

#### Backup MySQL:
```bash
# Backup
docker exec fitness-mysql mysqldump -uroot -proot123 fitness_users_db > backup.sql

# Restore
docker exec -i fitness-mysql mysql -uroot -proot123 fitness_users_db < backup.sql
```

#### Backup MongoDB:
```bash
# Backup
docker exec fitness-mongodb mongodump --uri="mongodb://root:@ani.8727M@localhost:27017" --out=/tmp/backup

# Copy to host
docker cp fitness-mongodb:/tmp/backup ./mongodb_backup

# Restore
docker exec fitness-mongodb mongorestore --uri="mongodb://root:@ani.8727M@localhost:27017" /tmp/backup
```

### Delete Volumes (⚠️ Caution):

```bash
# Remove all unused volumes
docker volume prune

# Remove specific volume (must stop container first)
docker-compose down
docker volume rm fitness_app_mysql_data

# Remove everything including volumes
docker-compose down -v
```

---

## Health Checks

Health checks ensure services are ready before connecting to them.

### Configuration:

```yaml
healthcheck:
  test: ["CMD", "command", "to", "test"]  # Health check command
  interval: 10s                            # Check every 10 seconds
  timeout: 5s                              # Maximum wait time
  retries: 5                               # Attempts before "unhealthy"
  start_period: 40s                        # Grace period on startup
```

### Our Health Checks:

**MySQL:**
```yaml
test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-u", "root", "-proot123"]
```
Checks if MySQL responds to ping command.

**MongoDB:**
```yaml
test: echo 'db.runCommand("ping").ok' | mongosh localhost:27017/test --quiet
```
Runs MongoDB ping command via shell.

**RabbitMQ:**
```yaml
test: rabbitmq-diagnostics -q ping
```
Uses RabbitMQ's diagnostic tool.

**Keycloak:**
```yaml
test: ["CMD", "curl", "-f", "http://localhost:8181/health/ready"]
```
Checks Keycloak's health endpoint.

**Redis:**
```yaml
test: ["CMD", "redis-cli", "ping"]
```
Expects "PONG" response.

### Monitoring Health:

```bash
# Check health status
docker-compose ps

# Detailed health info
docker inspect fitness-mysql | grep -A 10 Health

# Watch health in real-time
watch -n 2 'docker-compose ps'

# View health check logs
docker inspect fitness-mysql --format='{{json .State.Health}}' | jq
```

### Health States:

- **starting**: Container just started, in grace period
- **healthy**: Health check passed
- **unhealthy**: Health check failed after retries

---

## Troubleshooting

### Common Issues and Solutions:

#### 1. **Port Already in Use**

**Error:**
```
Error: bind: address already in use
```

**Solution:**
```bash
# Find process using port
netstat -ano | findstr :3307

# Kill process (Windows)
taskkill /PID <PID> /F

# Or change port in docker-compose.yml
ports:
  - "3308:3306"  # Changed from 3307
```

#### 2. **Container Keeps Restarting**

**Check logs:**
```bash
docker-compose logs mysql
docker inspect fitness-mysql
```

**Common causes:**
- Wrong credentials
- Insufficient memory
- Port conflict
- Volume corruption

**Solution:**
```bash
# Remove and recreate
docker-compose down
docker volume rm fitness_app_mysql_data
docker-compose up -d mysql
```

#### 3. **Service Unhealthy**

**Check health status:**
```bash
docker inspect fitness-mysql --format='{{json .State.Health}}' | jq
```

**Wait longer:**
Some services take time to start (Keycloak can take 1-2 minutes)

#### 4. **Cannot Connect to Service**

**Verify container is running:**
```bash
docker-compose ps
```

**Test connection:**
```bash
# MySQL
docker exec fitness-mysql mysql -uroot -proot123 -e "SELECT 1;"

# MongoDB
docker exec fitness-mongodb mongosh --eval "db.adminCommand('ping')"

# Redis
docker exec fitness-redis redis-cli ping
```

#### 5. **Out of Disk Space**

**Check usage:**
```bash
docker system df
```

**Clean up:**
```bash
# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Remove everything unused
docker system prune -a --volumes
```

#### 6. **Slow Performance**

**Check resources:**
```bash
docker stats
```

**Increase Docker resources:**
- Docker Desktop → Settings → Resources
- Increase CPU and Memory limits

#### 7. **Network Issues**

**Recreate network:**
```bash
docker-compose down
docker network rm fitness_app_fitness-network
docker-compose up -d
```

#### 8. **Permission Denied (Linux)**

**Add user to docker group:**
```bash
sudo usermod -aG docker $USER
# Logout and login again
```

### Debug Commands:

```bash
# View all container logs
docker-compose logs

# Follow logs in real-time
docker-compose logs -f

# Check container processes
docker-compose top

# Inspect container
docker inspect fitness-mysql

# Check network connectivity
docker exec fitness-mysql ping mongodb

# View environment variables
docker exec fitness-mysql env
```

---

## Best Practices

### 1. **Always Use Named Volumes**
```yaml
volumes:
  - mysql_data:/var/lib/mysql  # ✅ Named volume
  # NOT: ./data:/var/lib/mysql # ❌ Bind mount (can cause permission issues)
```

### 2. **Use Health Checks**
Ensures services are ready before dependencies connect.

### 3. **Don't Expose Unnecessary Ports**
```yaml
# For services only used internally, skip ports:
mongodb:
  # No ports: section if only accessed by other containers
```

### 4. **Use Environment Variables for Secrets**
Better yet, use `.env` file:

```bash
# .env file
MYSQL_ROOT_PASSWORD=root123
MYSQL_DATABASE=fitness_users_db
```

```yaml
# docker-compose.yml
environment:
  MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
```

### 5. **Regular Backups**
```bash
# Weekly backup script
docker exec fitness-mysql mysqldump -uroot -proot123 fitness_users_db > backup_$(date +%Y%m%d).sql
```

### 6. **Monitor Resource Usage**
```bash
docker stats --no-stream
```

### 7. **Keep Images Updated**
```bash
docker-compose pull
docker-compose up -d
```

### 8. **Use Restart Policies**
```yaml
restart: unless-stopped  # Auto-restart on crash
```

### 9. **Clean Up Regularly**
```bash
# Weekly cleanup
docker system prune -f
```

### 10. **Document Custom Configurations**
Keep notes on why certain ports or settings were chosen.

---

## Common Commands Reference

### Docker Compose:

```bash
# Start services
docker-compose up -d                    # Start in background
docker-compose up                       # Start with logs

# Stop services
docker-compose stop                     # Stop (keep containers)
docker-compose down                     # Stop and remove containers
docker-compose down -v                  # Stop and remove volumes

# View status
docker-compose ps                       # List containers
docker-compose logs                     # View all logs
docker-compose logs -f mysql            # Follow MySQL logs
docker-compose top                      # View running processes

# Restart
docker-compose restart                  # Restart all
docker-compose restart mysql            # Restart specific service

# Pull updates
docker-compose pull                     # Pull latest images
docker-compose up -d --force-recreate   # Recreate containers

# Execute commands
docker-compose exec mysql bash          # Shell into container
```

### Docker:

```bash
# Container management
docker ps                               # List running containers
docker ps -a                            # List all containers
docker stop <container>                 # Stop container
docker start <container>                # Start container
docker restart <container>              # Restart container
docker rm <container>                   # Remove container

# Images
docker images                           # List images
docker pull <image>                     # Download image
docker rmi <image>                      # Remove image

# Logs and debugging
docker logs <container>                 # View logs
docker logs -f <container>              # Follow logs
docker exec -it <container> bash        # Interactive shell
docker inspect <container>              # Detailed info

# Cleanup
docker system prune                     # Remove unused data
docker volume prune                     # Remove unused volumes
docker image prune -a                   # Remove unused images

# Resource monitoring
docker stats                            # Live resource usage
docker system df                        # Disk usage
```

### Service-Specific:

```bash
# MySQL
docker exec -it fitness-mysql mysql -uroot -proot123
docker exec fitness-mysql mysqldump -uroot -proot123 database > backup.sql

# MongoDB
docker exec -it fitness-mongodb mongosh -u root -p '@ani.8727M'
docker exec fitness-mongodb mongodump --uri="mongodb://root:@ani.8727M@localhost:27017"

# Redis
docker exec -it fitness-redis redis-cli
docker exec fitness-redis redis-cli FLUSHALL  # Clear all cache

# RabbitMQ
docker exec fitness-rabbitmq rabbitmqctl status
docker exec fitness-rabbitmq rabbitmqctl list_queues
```

---

## Quick Reference Card

### Service Access:

| Service | URL | Credentials |
|---------|-----|-------------|
| MySQL | `localhost:3307` | root/root123 |
| MongoDB | `localhost:27017` | root/@ani.8727M |
| RabbitMQ AMQP | `localhost:5672` | guest/guest |
| RabbitMQ UI | http://localhost:15672 | guest/guest |
| Keycloak | http://localhost:8181 | admin/admin |
| Redis | `localhost:6379` | (no password) |

### Essential Commands:

```bash
# Start everything
docker-compose up -d

# Stop everything
docker-compose down

# View status
docker-compose ps

# View logs
docker-compose logs -f

# Restart service
docker-compose restart mysql

# Shell into container
docker exec -it fitness-mysql bash

# Clean everything
docker-compose down -v
docker system prune -a
```

---

## Next Steps

After setting up Docker:

1. ✅ **Verify all services are healthy**: `docker-compose ps`
2. ✅ **Access management UIs**:
   - RabbitMQ: http://localhost:15672
   - Keycloak: http://localhost:8181
3. ✅ **Configure Keycloak** (see [KEYCLOAK_SETUP.md](KEYCLOAK_SETUP.md))
4. ✅ **Start Spring Boot services** (see [COMPLETE_STARTUP_GUIDE.md](COMPLETE_STARTUP_GUIDE.md))
5. ✅ **Start frontend** (see [DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md))

---

## Additional Resources

- **Docker Official Docs**: https://docs.docker.com
- **Docker Compose Docs**: https://docs.docker.com/compose
- **Spring Boot with Docker**: https://spring.io/guides/gs/spring-boot-docker
- **Docker Best Practices**: https://docs.docker.com/develop/dev-best-practices

---

## Summary

🎯 **Docker** = Platform to run applications in containers  
🎯 **Docker Compose** = Tool to manage multiple containers  
🎯 **Our Setup** = 5 services (MySQL, MongoDB, RabbitMQ, Keycloak, Redis)  
🎯 **One Command** = `docker-compose up -d` starts everything  
🎯 **Data Persists** = Using named volumes  
🎯 **Easy Development** = Same environment for everyone  

**You're now ready to run the fitness app infrastructure! 🚀**
