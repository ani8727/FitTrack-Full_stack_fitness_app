# Prerequisites (Run/Deploy)

**Last Updated:** January 2026

Minimal list to get the stack running locally. All infrastructure services are cloud-hosted for simplified setup.

## Core Development Tools
- **Java 21** (JDK 21 - required for Spring Boot 3.5.9)
- **Maven 3.9+** (for building Spring Boot microservices)
- **Node.js 20+** and **npm** (for React 19 frontend)
- **Git** (for version control)

## Cloud-Hosted Infrastructure Services

All infrastructure services are hosted in the cloud and accessed via environment variables:

### 1. Auth0 (Authentication)
- **Purpose:** OAuth2/OIDC identity provider with JWT token issuance
- **Required Configuration:**
  - `AUTH0_ISSUER_URI` - Your Auth0 tenant URL (e.g., `https://your-tenant.auth0.com/`)
  - `AUTH0_JWK_SET_URI` - JWK endpoint for JWT validation
  - `AUTH0_AUDIENCE` - API identifier configured in Auth0
- **Setup:** Create Auth0 account at https://auth0.com
- **Roles:** Configure USER and ADMIN roles in Auth0

### 2. Neon PostgreSQL (Relational Database)
- **Purpose:** Separate databases for User and Admin services
- **Required Configuration:**
  - User Service: `USER_DB_URL`, `USER_DB_USER`, `USER_DB_PASSWORD`
  - Admin Service: `ADMIN_DB_URL`, `ADMIN_DB_USER`, `ADMIN_DB_PASSWORD`
- **Schema Structure:**
  - `user_db` with schema `user_schema`
  - `admin_db` with schema `admin_schema`
- **Setup:** Create free account at https://neon.tech

### 3. MongoDB Atlas (Document Database)
- **Purpose:** Activity and AI service data storage
- **Required Configuration:**
  - `MONGO_URI` - Connection string with credentials
- **Setup:** Create free cluster at https://www.mongodb.com/cloud/atlas

### 4. CloudAMQP (RabbitMQ Message Broker)
- **Purpose:** Asynchronous event-driven communication
- **Required Configuration:**
  - `RABBITMQ_URI` - AMQP connection string
  - `RABBITMQ_USERNAME`, `RABBITMQ_PASSWORD`
  - `RABBITMQ_VIRTUAL_HOST`
- **Setup:** Create free instance at https://www.cloudamqp.com

### 5. Google Gemini API (AI Service)
- **Purpose:** AI-powered fitness insights and recommendations
- **Required Configuration:**
  - `GEMINI_API_KEY` - API key from Google Cloud
  - `GEMINI_API_URL` - API endpoint
- **Setup:** Get API key from https://ai.google.dev

## Service Startup Order

When running locally, services must be started in this order:

1. **Config Server** (port 8888)
   ```bash
   cd backend/configserver
   mvn spring-boot:run
   ```

2. **Eureka Server** (port 8761)
   ```bash
   cd backend/eureka
   mvn spring-boot:run
   ```

3. **Business Services** (any order)
   - User Service (port 8081)
   - Admin Service (port 8082)
   - Activity Service (port 8083)
   - AI Service (port 8084)

4. **API Gateway** (port 8085)
   ```bash
   cd backend/gateway
   mvn spring-boot:run
   ```

5. **Frontend** (port 5173)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Environment Configuration

1. Copy `.env.example` to `.env` in the `backend/` folder
2. Fill in all cloud service credentials
3. Load environment variables before starting services:
   - **Windows:** Run `backend/load-env.ps1`
   - **Linux/Mac:** Use `source` or `export` commands

## Required Ports

Ensure these ports are available on your local machine:
- 8888 - Config Server
- 8761 - Eureka Server
- 8081 - User Service
- 8082 - Admin Service
- 8083 - Activity Service
- 8084 - AI Service
- 8085 - API Gateway
- 5173 - Frontend (Vite dev server)

## Notes

- **No Docker Compose:** This project currently runs all services locally
- **Cloud-First:** All infrastructure (DB, auth, messaging) is cloud-hosted
- **Keep secrets secure:** Never commit `.env` file to git (it's already in `.gitignore`)
- **For detailed setup:** See [COMPLETE_STARTUP_GUIDE.md](Guide/COMPLETE_STARTUP_GUIDE.md)
