# FitTrack Production Deployment Guide

## 🎯 Overview
This guide covers deploying FitTrack microservices to production with managed cloud services.

## 📋 Prerequisites

### Required Services
- [x] MongoDB Atlas cluster (provided)
- [x] Neon PostgreSQL database (provided)
- [x] CloudAMQP RabbitMQ instance (provided)
- [ ] Keycloak instance (Docker/Cloud/VPS)
- [ ] Docker & Docker Compose installed
- [ ] Domain names configured (Cloudflare DNS)
- [ ] SSL certificates (Let's Encrypt)

### GitHub Secrets Configuration
Add these secrets to your GitHub repository (Settings → Secrets → Actions):

```
MONGO_URI
POSTGRES_URL
POSTGRES_USER
POSTGRES_PASSWORD
RABBITMQ_HOST
RABBITMQ_PORT
RABBITMQ_USERNAME
RABBITMQ_PASSWORD
VITE_API_BASE_URL
VITE_KEYCLOAK_BASE_URL
VITE_KEYCLOAK_REALM
VITE_KEYCLOAK_CLIENT_ID
VITE_REDIRECT_URI
DOCKER_USERNAME
DOCKER_PASSWORD
SENTRY_DSN (optional)
```

## 🚀 Deployment Steps

### 1. Configure Environment Variables

Copy the production template:
```bash
cp .env.prod .env
```

Edit `.env` with your actual values (credentials already filled from your provided data).

### 2. Build Services Locally

```bash
# Build all backend services
mvn clean package -DskipTests -f configserver/pom.xml
mvn clean package -DskipTests -f eureka/pom.xml
mvn clean package -DskipTests -f gateway/pom.xml
mvn clean package -DskipTests -f userservice/pom.xml
mvn clean package -DskipTests -f adminservice/pom.xml
mvn clean package -DskipTests -f activityservice/pom.xml
mvn clean package -DskipTests -f aiservice/pom.xml
```

### 3. Run with Docker Compose

#### Option A: Using .env file
```bash
docker compose -f docker-compose.prod.yml up -d --build
```

#### Option B: Inline environment variables (Windows CMD)
```cmd
set MONGO_URI=mongodb+srv://fitness_db:fitness123@fitapp.awbcqor.mongodb.net/fitness_db?retryWrites=true^&w=majority
set POSTGRES_URL=jdbc:postgresql://ep-misty-sound-aeorpzzo-pooler.c-2.us-east-2.aws.neon.tech/fitness_db?sslmode=require
set POSTGRES_USER=neondb_owner
set POSTGRES_PASSWORD=npg_nf9xjhB0ZUgM
set RABBITMQ_HOST=leopard.lmq.cloudamqp.com
set RABBITMQ_PORT=5672
set RABBITMQ_USERNAME=unvzgqsg
set RABBITMQ_PASSWORD=6xz8gRL6dG0F8CNxrhWTwoJWN9PqIrVu

docker compose -f docker-compose.prod.yml up -d --build
```

#### Option C: PowerShell
```powershell
$env:MONGO_URI="mongodb+srv://fitness_db:fitness123@fitapp.awbcqor.mongodb.net/fitness_db?retryWrites=true&w=majority"
$env:POSTGRES_URL="jdbc:postgresql://ep-misty-sound-aeorpzzo-pooler.c-2.us-east-2.aws.neon.tech/fitness_db?sslmode=require"
$env:POSTGRES_USER="neondb_owner"
$env:POSTGRES_PASSWORD="npg_nf9xjhB0ZUgM"
$env:RABBITMQ_HOST="leopard.lmq.cloudamqp.com"
$env:RABBITMQ_PORT="5672"
$env:RABBITMQ_USERNAME="unvzgqsg"
$env:RABBITMQ_PASSWORD="6xz8gRL6dG0F8CNxrhWTwoJWN9PqIrVu"

docker compose -f docker-compose.prod.yml up -d --build
```

### 4. Verify Services

Check all services are running:
```bash
docker compose -f docker-compose.prod.yml ps
```

Check service health:
```bash
curl http://localhost:8761  # Eureka
curl http://localhost:8888/actuator/health  # Config Server
curl http://localhost:8085/actuator/health  # Gateway
curl http://localhost:8081/actuator/health  # User Service
curl http://localhost:8083/actuator/health  # Admin Service
curl http://localhost:8082/actuator/health  # Activity Service
curl http://localhost:8084/actuator/health  # AI Service
```

### 5. Keycloak Setup

Access Keycloak:
```
http://localhost:8181
Admin credentials: admin / [KEYCLOAK_ADMIN_PASSWORD from .env]
```

Configure realm and clients:
1. Import realm: `keycloak/realm-export/fitness-oauth2-realm.json`
2. Update redirect URIs to match your production domains
3. Create client roles: `ADMIN`, `USER`
4. Assign roles to test users

### 6. Frontend Deployment (Vercel/Netlify)

#### Vercel
```bash
cd fitness-app-frontend
vercel --prod
```

Set environment variables in Vercel dashboard:
- `VITE_API_BASE_URL`: Your Gateway URL (e.g., `https://api.yourapp.com/api`)
- `VITE_KEYCLOAK_BASE_URL`: Your Keycloak URL
- `VITE_KEYCLOAK_REALM`: `fitness-oauth2`
- `VITE_KEYCLOAK_CLIENT_ID`: `fitness-client`
- `VITE_REDIRECT_URI`: Your frontend URL

#### Netlify
```bash
cd fitness-app-frontend
netlify deploy --prod
```

## 📊 Monitoring

### Sentry Error Tracking
1. Create project at https://sentry.io
2. Copy DSN
3. Add to environment:
   ```bash
   SENTRY_DSN=https://...@sentry.io/...
   ```

### Grafana Cloud (Optional)
1. Sign up at https://grafana.com
2. Configure Spring Boot Actuator metrics export
3. Set up dashboards for JVM, HTTP requests, database connections

## 🔒 Security Checklist

- [x] No secrets in repository
- [x] Database connections use TLS/SSL
- [x] RabbitMQ uses AMQPS
- [x] JWT validation at Gateway
- [ ] Configure firewall rules (limit to Gateway only)
- [ ] Enable HTTPS with valid certificates
- [ ] Set up rate limiting
- [ ] Configure CORS for production domains

## 🏗️ Architecture

```
Frontend (Vercel/Netlify)
    ↓ HTTPS
Gateway (Docker)
    ↓ Internal
┌─────────────┬──────────┬──────────┬──────────┐
User Service  Admin     Activity   AI Service
              Service   Service
    ↓            ↓         ↓           ↓
PostgreSQL    PostgreSQL MongoDB   MongoDB
(Neon)        (Neon)    (Atlas)   (Atlas)
                          ↓           ↓
                       RabbitMQ (CloudAMQP)
```

## 📝 Service Ports

| Service | Port |
|---------|------|
| Gateway | 8085 |
| User Service | 8081 |
| Admin Service | 8083 |
| Activity Service | 8082 |
| AI Service | 8084 |
| Eureka | 8761 |
| Config Server | 8888 |
| Keycloak | 8181 |
| Frontend | 80 (Docker) / Custom (Vercel) |

## 🐛 Troubleshooting

### Services not starting
```bash
docker compose -f docker-compose.prod.yml logs [service-name]
```

### Database connection errors
- Verify credentials in `.env`
- Check network connectivity
- Ensure SSL/TLS is configured correctly

### Authentication errors
- Verify Keycloak is accessible
- Check JWT issuer URI matches
- Confirm client IDs and realm names

### RabbitMQ connection issues
- Verify CloudAMQP credentials
- Check firewall allows outbound connections
- Ensure SSL is enabled

## 📚 Additional Resources

- [Spring Cloud Gateway Docs](https://spring.io/projects/spring-cloud-gateway)
- [Keycloak Admin Console](https://www.keycloak.org/docs/latest/server_admin/)
- [MongoDB Atlas Setup](https://www.mongodb.com/docs/atlas/)
- [Neon PostgreSQL Docs](https://neon.tech/docs/introduction)
- [CloudAMQP Dashboard](https://www.cloudamqp.com/docs/)

## 🔄 CI/CD Pipeline

The GitHub Actions workflow automatically:
1. Builds all services on push to `main`
2. Runs unit tests
3. Builds Docker images
4. Pushes to Docker Hub (if configured)

To enable automatic deployment:
1. Configure Docker Hub credentials in GitHub Secrets
2. Set up deployment hooks (webhook/SSH to your server)
3. Pull and restart containers on deployment

## 📧 Support

For issues or questions:
- GitHub Issues: [Your Repository]
- Email: [Your Email]
- Documentation: [Your Docs Site]
