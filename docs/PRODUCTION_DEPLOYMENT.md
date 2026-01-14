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
set MONGO_URI=<your-mongodb-uri>
set POSTGRES_URL=jdbc:postgresql://<your-neon-host>/<db>?sslmode=require
set POSTGRES_USER=<your-neon-user>
set POSTGRES_PASSWORD=<your-neon-password>
set RABBITMQ_HOST=<your-cloudamqp-host>
set RABBITMQ_PORT=5672
set RABBITMQ_USERNAME=<your-cloudamqp-username>
set RABBITMQ_PASSWORD=<your-cloudamqp-password>

docker compose -f docker-compose.prod.yml up -d --build
```

#### Option C: PowerShell
```powershell
$env:MONGO_URI="<your-mongodb-uri>"
$env:POSTGRES_URL="jdbc:postgresql://<your-neon-host>/<db>?sslmode=require"
$env:POSTGRES_USER="<your-neon-user>"
$env:POSTGRES_PASSWORD="<your-neon-password>"
$env:RABBITMQ_HOST="<your-cloudamqp-host>"
$env:RABBITMQ_PORT="5672"
$env:RABBITMQ_USERNAME="<your-cloudamqp-username>"
$env:RABBITMQ_PASSWORD="<your-cloudamqp-password>"

docker compose -f docker-compose.prod.yml up -d --build
```

### 4. Verify Services

Check all services are running:
```bash
docker compose -f docker-compose.prod.yml ps
```

Check service health:
```bash
curl https://eureka.fittrack.com/eureka/  # Eureka (prod)
curl https://config.fittrack.com/actuator/health  # Config Server (prod)
curl https://api.fittrack.com/actuator/health  # Gateway (prod)
curl https://users.api.fittrack.com/actuator/health  # User Service (prod)
curl https://admin.api.fittrack.com/actuator/health  # Admin Service (prod)
curl https://activity.api.fittrack.com/actuator/health  # Activity Service (prod)
curl https://ai.api.fittrack.com/actuator/health  # AI Service (prod)
```

### 5. Keycloak (managed Cloud-IAM)

Use the managed Cloud-IAM Keycloak instance for authentication.
Access Cloud-IAM:
```
https://lemur-10.cloud-iam.com
```

Configuration notes:
1. Use the `fitness-auth` realm on Cloud-IAM (managed) and create the `fittrack-frontend` client.
2. Update redirect URIs to match your production domains.
3. Create client roles: `ADMIN`, `USER`.
4. Assign roles to test users.

### 6. Frontend Deployment (Vercel/Netlify)

#### Vercel
```bash
cd fitness-app-frontend
vercel --prod
```

Set environment variables in Vercel dashboard:
- `VITE_API_BASE_URL`: Your Gateway URL (e.g., `https://api.yourapp.com/api`)
- `VITE_KEYCLOAK_BASE_URL`: `https://lemur-10.cloud-iam.com`
- `VITE_KEYCLOAK_REALM`: `fitness-auth`
- `VITE_KEYCLOAK_CLIENT_ID`: `fittrack-frontend`
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
