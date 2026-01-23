# 🚀 COMPLETE RENDER DEPLOYMENT GUIDE - FitTrack Application

> **🔒 PRODUCTION-READY**: This guide contains actual production credentials. All services are pre-configured and ready to deploy. NO localhost references.

---

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Quick Credentials Reference](#quick-credentials-reference)
3. [Architecture Overview](#architecture-overview)
4. [Deployment Order](#deployment-order)
5. [Service 1: User Service](#service-1-user-service)
6. [Service 2: Admin Service](#service-2-admin-service)
7. [Service 3: Activity Service](#service-3-activity-service)
8. [Service 4: AI Service](#service-4-ai-service)
9. [Service 5: API Gateway](#service-5-api-gateway)
10. [Service 6: Frontend](#service-6-frontend)
11. [Verification Steps](#verification-steps)
12. [Troubleshooting](#troubleshooting)

---

## Quick Credentials Reference

### 🔐 All Production Credentials Summary

**Auth0 (Authentication)**
```
Domain: dev-5s2csl8rpq2phx88.us.auth0.com
Client ID: qnXHlMOmUhSTiQx0ohzneAvZWtTm8IuS
Client Secret: wv8Wrf6rE1vlTR_opo6UGaorBpfuN4tSRvfRkgSdvYNpqNaNE4D3YOSPaSc1WEpi
Audience: fitness_auth
```

**Neon PostgreSQL**
```
Host: ep-small-truth-ahb8e4vi-pooler.c-3.us-east-1.aws.neon.tech
Port: 5432
Username: neondb_owner
Password: npg_CLRh6Z5OFUGm
Databases: user_db, admin_db
```

**MongoDB Atlas**
```
Activity DB: mongodb+srv://activity_db_user:activity_db_user@fitapp.awbcqor.mongodb.net/activity_db?appName=FitApp
AI DB: mongodb+srv://ai_db_user:ai_db_user@fitapp.awbcqor.mongodb.net/ai_db?appName=FitApp
```

**CloudAMQP (RabbitMQ)**
```
URL: amqps://unvzgqsg:6xz8gRL6dG0F8CNxrhWTwoJWN9PqIrVu@leopard.lmq.cloudamqp.com/unvzgqsg
Username: unvzgqsg
Password: 6xz8gRL6dG0F8CNxrhWTwoJWN9PqIrVu
Virtual Host: unvzgqsg
```

**Google Gemini AI**
```
API URL: https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent
API Key: AIzaSyC-Oy1V1FksKMeFT42epVOUlhpjXo6jC18
```

**EmailJS (Optional)**
```
Service ID: fitness_app
Public Key: NXoVXoETzx_Thvzn1
Admin Email Template: template_hpm27gd
User Email Template: template_had0n98
Admin Email: aniketgupta.8727@gmail.com
```

---

## Prerequisites

### ✅ Required Cloud Services Setup

Before deploying to Render, you MUST have these cloud services configured:

#### 1. **Neon PostgreSQL** (For User & Admin Services)
- Website: https://neon.tech
- ✅ **CONFIGURED** - TWO databases ready:
  - `user_db` - For user service
  - `admin_db` - For admin service
- **Credentials**:
  - Host: `ep-small-truth-ahb8e4vi-pooler.c-3.us-east-1.aws.neon.tech`
  - Port: `5432`
  - Username: `neondb_owner`
  - Password: `npg_CLRh6Z5OFUGm`

#### 2. **MongoDB Atlas** (For Activity & AI Services)
- Website: https://www.mongodb.com/cloud/atlas
- ✅ **CONFIGURED** - TWO databases on cluster ready:
  - `activity_db` - For activity service (user: `activity_db_user`)
  - `ai_db` - For AI service (user: `ai_db_user`)
- **Connection Strings**:
  - Activity DB: `mongodb+srv://activity_db_user:activity_db_user@fitapp.awbcqor.mongodb.net/activity_db?appName=FitApp`
  - AI DB: `mongodb+srv://ai_db_user:ai_db_user@fitapp.awbcqor.mongodb.net/ai_db?appName=FitApp`

#### 3. **CloudAMQP** (RabbitMQ Message Broker)
- Website: https://www.cloudamqp.com
- ✅ **CONFIGURED** - Instance ready (Lemur plan)
- **Credentials**:
  - AMQP URL: `amqps://unvzgqsg:6xz8gRL6dG0F8CNxrhWTwoJWN9PqIrVu@leopard.lmq.cloudamqp.com/unvzgqsg`
  - Username: `unvzgqsg`
  - Password: `6xz8gRL6dG0F8CNxrhWTwoJWN9PqIrVu`
  - Virtual Host: `unvzgqsg`
  - Hostname: `leopard.lmq.cloudamqp.com`

#### 4. **Auth0** (Authentication)
- Website: https://auth0.com
- ✅ **CONFIGURED** - Tenant and SPA ready
- **API**: Fitness API (Identifier: `fitness_auth`)
- **Application**: fitness_auth (Single Page Application)
- **Credentials**:
  - Domain: `dev-5s2csl8rpq2phx88.us.auth0.com`
  - Client ID: `qnXHlMOmUhSTiQx0ohzneAvZWtTm8IuS`
  - Client Secret: `wv8Wrf6rE1vlTR_opo6UGaorBpfuN4tSRvfRkgSdvYNpqNaNE4D3YOSPaSc1WEpi`
  - Audience: `fitness_auth`

#### 5. **Google Gemini API** (For AI Service)
- Website: https://makersuite.google.com/app/apikey
- ✅ **CONFIGURED** - API key ready
- **Credentials**:
  - API URL: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`
  - API Key: `AIzaSyC-Oy1V1FksKMeFT42epVOUlhpjXo6jC18`

#### 6. **GitHub Repository**
- Push your code to GitHub
- Render will deploy from your repository

---

## Architecture Overview

```
┌─────────────┐
│   Frontend  │ (Vite/React - Static Site)
│  (Vercel)   │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│ API Gateway │ ← Port 8085 (Render Web Service)
│  (Spring)   │
└──────┬──────┘
       │
       ├────────────┬────────────┬───────────┐
       ↓            ↓            ↓           ↓
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│   User   │ │  Admin   │ │Activity  │ │    AI    │
│ Service  │ │ Service  │ │ Service  │ │ Service  │
│  :8081   │ │  :8082   │ │  :8083   │ │  :8084   │
└────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘
     │            │            │   │         │   │
     ↓            ↓            ↓   │         ↓   │
┌─────────┐  ┌─────────┐  ┌────────┴──┐ ┌───────┴──┐
│  Neon   │  │  Neon   │  │  MongoDB  │ │ RabbitMQ │
│user_db  │  │admin_db │  │  Atlas    │ │CloudAMQP │
└─────────┘  └─────────┘  └───────────┘ └──────────┘
```

---

## Deployment Order

**⚠️ IMPORTANT: Deploy in this exact order!**

1. **User Service** (No dependencies)
2. **Admin Service** (No dependencies)
3. **Activity Service** (Depends on RabbitMQ)
4. **AI Service** (Depends on RabbitMQ, listens to Activity events)
5. **API Gateway** (Depends on all microservices)
6. **Frontend** (Depends on API Gateway)

---

## Service 1: User Service

### 📝 Description
Handles user authentication, registration, profile management.

### 🔧 Render Configuration

#### Basic Settings:
- **Name**: `fittrack-userservice`
- **Region**: Choose closest to your Neon database
- **Branch**: `main`
- **Root Directory**: `backend/userservice`
- **Environment**: `Docker`
- **Dockerfile Path**: `backend/userservice/Dockerfile`
- **Docker Build Context**: `backend/userservice`
- **Instance Type**: `Starter` (Free tier available)

#### Port Configuration:
- **Port**: `8081` (Auto-detected from Dockerfile EXPOSE)

#### Health Check:
- **Path**: `/actuator/health`

### 🔐 Environment Variables

```bash
# ============================================
# SERVICE CONFIGURATION
# ============================================
SPRING_PROFILES_ACTIVE=prod
USER_SERVICE_PORT=8081
PORT=8081

# ============================================
# DATABASE - NEON POSTGRESQL (USER_DB)
# ============================================
SPRING_DATASOURCE_URL=jdbc:postgresql://ep-small-truth-ahb8e4vi-pooler.c-3.us-east-1.aws.neon.tech:5432/user_db?sslmode=require&channel_binding=require
SPRING_DATASOURCE_USERNAME=neondb_owner
SPRING_DATASOURCE_PASSWORD=npg_CLRh6Z5OFUGm

# Database Settings
SPRING_JPA_HIBERNATE_DDL_AUTO=validate
SPRING_JPA_SHOW_SQL=false
SPRING_JPA_PROPERTIES_HIBERNATE_DIALECT=org.hibernate.dialect.PostgreSQLDialect

# ============================================
# AUTH0 CONFIGURATION
# ============================================
AUTH0_ISSUER_URI=https://dev-5s2csl8rpq2phx88.us.auth0.com/
AUTH0_JWK_SET_URI=https://dev-5s2csl8rpq2phx88.us.auth0.com/.well-known/jwks.json
AUTH0_AUDIENCE=fitness_auth

# ============================================
# OPTIONAL: EMAIL SERVICE (EmailJS)
# ============================================
EMAILJS_SERVICE_ID=fitness_app
EMAILJS_TEMPLATE_ID=template_hpm27gd
EMAILJS_PUBLIC_KEY=NXoVXoETzx_Thvzn1
EMAILJS_PRIVATE_KEY=NXoVXoETzx_Thvzn1

# ============================================
# SERVICE DISCOVERY (Disabled for Render)
# ============================================
SPRING_CLOUD_DISCOVERY_ENABLED=false
EUREKA_CLIENT_ENABLED=false
EUREKA_CLIENT_REGISTER_WITH_EUREKA=false
EUREKA_CLIENT_FETCH_REGISTRY=false

# ============================================
# MONITORING
# ============================================
MANAGEMENT_ENDPOINTS_WEB_EXPOSURE_INCLUDE=health,info,metrics
MANAGEMENT_ENDPOINT_HEALTH_SHOW_DETAILS=always
```

### 📋 Step-by-Step Deployment

1. **Login to Render**: https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - Name: `fittrack-userservice`
   - Root Directory: `backend/userservice`
   - Environment: `Docker`
   - Build Command: (Leave empty, Docker handles it)
5. Click **"Advanced"** → Add all environment variables above
6. Click **"Create Web Service"**
7. Wait for deployment (5-10 minutes)
8. Once deployed, note the URL: `https://fittrack-userservice.onrender.com`
9. Test health: `https://fittrack-userservice.onrender.com/actuator/health`

### ✅ Verification
```bash
# Test health endpoint
curl https://fittrack-userservice.onrender.com/actuator/health

# Expected response:
{
  "status": "UP",
  "components": {
    "db": {"status": "UP"},
    "diskSpace": {"status": "UP"},
    "ping": {"status": "UP"}
  }
}
```

---

## Service 2: Admin Service

### 📝 Description
Handles admin operations, user management, system configuration.

### 🔧 Render Configuration

#### Basic Settings:
- **Name**: `fittrack-adminservice`
- **Region**: Choose closest to your Neon database
- **Branch**: `main`
- **Root Directory**: `backend/adminservice`
- **Environment**: `Docker`
- **Dockerfile Path**: `backend/adminservice/Dockerfile`
- **Docker Build Context**: `backend/adminservice`
- **Instance Type**: `Starter`

#### Port Configuration:
- **Port**: `8082`

#### Health Check:
- **Path**: `/actuator/health`

### 🔐 Environment Variables

```bash
# ============================================
# SERVICE CONFIGURATION
# ============================================
SPRING_PROFILES_ACTIVE=prod
ADMIN_SERVICE_PORT=8082
PORT=8082

# ============================================
# DATABASE - NEON POSTGRESQL (ADMIN_DB)
# ============================================
SPRING_DATASOURCE_URL=jdbc:postgresql://ep-small-truth-ahb8e4vi-pooler.c-3.us-east-1.aws.neon.tech:5432/admin_db?sslmode=require&channel_binding=require
SPRING_DATASOURCE_USERNAME=neondb_owner
SPRING_DATASOURCE_PASSWORD=npg_CLRh6Z5OFUGm

# Database Settings
SPRING_JPA_HIBERNATE_DDL_AUTO=validate
SPRING_JPA_SHOW_SQL=false
SPRING_JPA_PROPERTIES_HIBERNATE_DIALECT=org.hibernate.dialect.PostgreSQLDialect

# ============================================
# AUTH0 CONFIGURATION
# ============================================
AUTH0_ISSUER_URI=https://dev-5s2csl8rpq2phx88.us.auth0.com/
AUTH0_JWK_SET_URI=https://dev-5s2csl8rpq2phx88.us.auth0.com/.well-known/jwks.json
AUTH0_AUDIENCE=fitness_auth

# ============================================
# SERVICE DISCOVERY (Disabled for Render)
# ============================================
SPRING_CLOUD_DISCOVERY_ENABLED=false
EUREKA_CLIENT_ENABLED=false
EUREKA_CLIENT_REGISTER_WITH_EUREKA=false
EUREKA_CLIENT_FETCH_REGISTRY=false

# ============================================
# MONITORING
# ============================================
MANAGEMENT_ENDPOINTS_WEB_EXPOSURE_INCLUDE=health,info,metrics
MANAGEMENT_ENDPOINT_HEALTH_SHOW_DETAILS=always
```

### 📋 Step-by-Step Deployment

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository (same as before)
3. Configure:
   - Name: `fittrack-adminservice`
   - Root Directory: `backend/adminservice`
   - Environment: `Docker`
4. Click **"Advanced"** → Add all environment variables above
5. Click **"Create Web Service"**
6. Wait for deployment (5-10 minutes)
7. Once deployed, note the URL: `https://fittrack-adminservice.onrender.com`
8. Test health: `https://fittrack-adminservice.onrender.com/actuator/health`

### ✅ Verification
```bash
# Test health endpoint
curl https://fittrack-adminservice.onrender.com/actuator/health

# Expected response:
{
  "status": "UP",
  "components": {
    "db": {"status": "UP"},
    "ping": {"status": "UP"}
  }
}
```

---

## Service 3: Activity Service

### 📝 Description
Handles activity tracking, workout logging, publishes events to RabbitMQ for AI processing.

### 🔧 Render Configuration

#### Basic Settings:
- **Name**: `fittrack-activityservice`
- **Region**: Choose region
- **Branch**: `main`
- **Root Directory**: `backend/activityservice`
- **Environment**: `Docker`
- **Dockerfile Path**: `backend/activityservice/Dockerfile`
- **Docker Build Context**: `backend/activityservice`
- **Instance Type**: `Starter`

#### Port Configuration:
- **Port**: `8083`

#### Health Check:
- **Path**: `/actuator/health`

### 🔐 Environment Variables

```bash
# ============================================
# SERVICE CONFIGURATION
# ============================================
SPRING_PROFILES_ACTIVE=prod
ACTIVITY_SERVICE_PORT=8083
PORT=8083

# ============================================
# DATABASE - MONGODB ATLAS (ACTIVITY_DB)
# ============================================
SPRING_DATA_MONGODB_URI=mongodb+srv://activity_db_user:activity_db_user@fitapp.awbcqor.mongodb.net/activity_db?retryWrites=true&w=majority&tls=true&appName=FitApp
SPRING_DATA_MONGODB_DATABASE=activity_db

# ============================================
# RABBITMQ - CLOUDAMQP (MESSAGE BROKER)
# ============================================
SPRING_RABBITMQ_ADDRESSES=amqps://unvzgqsg:6xz8gRL6dG0F8CNxrhWTwoJWN9PqIrVu@leopard.lmq.cloudamqp.com/unvzgqsg
SPRING_RABBITMQ_USERNAME=unvzgqsg
SPRING_RABBITMQ_PASSWORD=6xz8gRL6dG0F8CNxrhWTwoJWN9PqIrVu
SPRING_RABBITMQ_VIRTUAL_HOST=unvzgqsg
SPRING_RABBITMQ_SSL_ENABLED=true
SPRING_RABBITMQ_PORT=5671

# RabbitMQ Exchange & Queue Configuration
RABBITMQ_EXCHANGE=activity.exchange
RABBITMQ_QUEUE=activity.queue
RABBITMQ_ROUTING_KEY=activity.tracking

# Dead Letter Queue Configuration
RABBITMQ_DEAD_LETTER_EXCHANGE=activity.dlx
RABBITMQ_DEAD_LETTER_QUEUE=activity.dlq
RABBITMQ_MESSAGE_TTL_MS=300000

# RabbitMQ Retry Configuration
RABBITMQ_RETRY_ENABLED=true
RABBITMQ_RETRY_MAX_ATTEMPTS=3
RABBITMQ_RETRY_INITIAL_INTERVAL=1000
RABBITMQ_RETRY_MAX_INTERVAL=10000
RABBITMQ_RETRY_MULTIPLIER=2.0

# RabbitMQ Listener Configuration
RABBITMQ_LISTENER_AUTO_START=true
RABBITMQ_LISTENER_ACKNOWLEDGE_MODE=auto

# ============================================
# AUTH0 CONFIGURATION
# ============================================
AUTH0_ISSUER_URI=https://dev-5s2csl8rpq2phx88.us.auth0.com/
AUTH0_JWK_SET_URI=https://dev-5s2csl8rpq2phx88.us.auth0.com/.well-known/jwks.json
AUTH0_AUDIENCE=fitness_auth

# ============================================
# SERVICE DISCOVERY (Disabled for Render)
# ============================================
SPRING_CLOUD_DISCOVERY_ENABLED=false
EUREKA_CLIENT_ENABLED=false
EUREKA_CLIENT_REGISTER_WITH_EUREKA=false
EUREKA_CLIENT_FETCH_REGISTRY=false

# ============================================
# MONITORING
# ============================================
MANAGEMENT_ENDPOINTS_WEB_EXPOSURE_INCLUDE=health,info,metrics
MANAGEMENT_ENDPOINT_HEALTH_SHOW_DETAILS=always
```

### 📋 Step-by-Step Deployment

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure:
   - Name: `fittrack-activityservice`
   - Root Directory: `backend/activityservice`
   - Environment: `Docker`
4. Click **"Advanced"** → Add all environment variables above
5. Click **"Create Web Service"**
6. Wait for deployment (5-10 minutes)
7. Once deployed, note the URL: `https://fittrack-activityservice.onrender.com`
8. Test health: `https://fittrack-activityservice.onrender.com/actuator/health`

### ✅ Verification
```bash
# Test health endpoint
curl https://fittrack-activityservice.onrender.com/actuator/health

# Expected response:
{
  "status": "UP",
  "components": {
    "mongo": {"status": "UP"},
    "rabbit": {"status": "UP"},
    "ping": {"status": "UP"}
  }
}
```

---

## Service 4: AI Service

### 📝 Description
Listens to RabbitMQ for activity events, processes with Google Gemini AI, provides recommendations.

### 🔧 Render Configuration

#### Basic Settings:
- **Name**: `fittrack-aiservice`
- **Region**: Choose region
- **Branch**: `main`
- **Root Directory**: `backend/aiservice`
- **Environment**: `Docker`
- **Dockerfile Path**: `backend/aiservice/Dockerfile`
- **Docker Build Context**: `backend/aiservice`
- **Instance Type**: `Starter`

#### Port Configuration:
- **Port**: `8084`

#### Health Check:
- **Path**: `/actuator/health`

### 🔐 Environment Variables

```bash
# ============================================
# SERVICE CONFIGURATION
# ============================================
SPRING_PROFILES_ACTIVE=prod
AI_SERVICE_PORT=8084
PORT=8084

# ============================================
# DATABASE - MONGODB ATLAS (AI_DB)
# ============================================
SPRING_DATA_MONGODB_URI=mongodb+srv://ai_db_user:ai_db_user@fitapp.awbcqor.mongodb.net/ai_db?retryWrites=true&w=majority&tls=true&appName=FitApp
SPRING_DATA_MONGODB_DATABASE=ai_db

# ============================================
# RABBITMQ - CLOUDAMQP (MESSAGE BROKER)
# ============================================
SPRING_RABBITMQ_ADDRESSES=amqps://unvzgqsg:6xz8gRL6dG0F8CNxrhWTwoJWN9PqIrVu@leopard.lmq.cloudamqp.com/unvzgqsg
SPRING_RABBITMQ_USERNAME=unvzgqsg
SPRING_RABBITMQ_PASSWORD=6xz8gRL6dG0F8CNxrhWTwoJWN9PqIrVu
SPRING_RABBITMQ_VIRTUAL_HOST=unvzgqsg
SPRING_RABBITMQ_SSL_ENABLED=true
SPRING_RABBITMQ_PORT=5671

# RabbitMQ Exchange & Queue Configuration
RABBITMQ_EXCHANGE=activity.exchange
RABBITMQ_QUEUE=activity.queue
RABBITMQ_ROUTING_KEY=activity.tracking

# Dead Letter Queue Configuration
RABBITMQ_DEAD_LETTER_EXCHANGE=activity.dlx
RABBITMQ_DEAD_LETTER_QUEUE=activity.dlq
RABBITMQ_MESSAGE_TTL_MS=300000

# RabbitMQ Retry Configuration
RABBITMQ_RETRY_ENABLED=true
RABBITMQ_RETRY_MAX_ATTEMPTS=3
RABBITMQ_RETRY_INITIAL_INTERVAL=1000
RABBITMQ_RETRY_MAX_INTERVAL=10000
RABBITMQ_RETRY_MULTIPLIER=2.0

# RabbitMQ Listener Configuration
RABBITMQ_LISTENER_AUTO_START=true
RABBITMQ_LISTENER_ACKNOWLEDGE_MODE=auto

# ============================================
# GOOGLE GEMINI AI CONFIGURATION
# ============================================
GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent
GEMINI_API_KEY=AIzaSyC-Oy1V1FksKMeFT42epVOUlhpjXo6jC18

# ============================================
# AUTH0 CONFIGURATION
# ============================================
AUTH0_ISSUER_URI=https://dev-5s2csl8rpq2phx88.us.auth0.com/
AUTH0_JWK_SET_URI=https://dev-5s2csl8rpq2phx88.us.auth0.com/.well-known/jwks.json
AUTH0_AUDIENCE=fitness_auth

# ============================================
# SERVICE DISCOVERY (Disabled for Render)
# ============================================
SPRING_CLOUD_DISCOVERY_ENABLED=false
EUREKA_CLIENT_ENABLED=false
EUREKA_CLIENT_REGISTER_WITH_EUREKA=false
EUREKA_CLIENT_FETCH_REGISTRY=false

# ============================================
# MONITORING
# ============================================
MANAGEMENT_ENDPOINTS_WEB_EXPOSURE_INCLUDE=health,info,metrics
MANAGEMENT_ENDPOINT_HEALTH_SHOW_DETAILS=always
```

### 📋 Step-by-Step Deployment

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure:
   - Name: `fittrack-aiservice`
   - Root Directory: `backend/aiservice`
   - Environment: `Docker`
4. Click **"Advanced"** → Add all environment variables above
5. Click **"Create Web Service"**
6. Wait for deployment (5-10 minutes)
7. Once deployed, note the URL: `https://fittrack-aiservice.onrender.com`
8. Test health: `https://fittrack-aiservice.onrender.com/actuator/health`

### ✅ Verification
```bash
# Test health endpoint
curl https://fittrack-aiservice.onrender.com/actuator/health

# Expected response:
{
  "status": "UP",
  "components": {
    "mongo": {"status": "UP"},
    "rabbit": {"status": "UP"},
    "ping": {"status": "UP"}
  }
}
```

---

## Service 5: API Gateway

### 📝 Description
Central entry point, handles routing to all microservices, CORS, authentication.

### 🔧 Render Configuration

#### Basic Settings:
- **Name**: `fittrack-gateway`
- **Region**: Choose region
- **Branch**: `main`
- **Root Directory**: `backend/gateway`
- **Environment**: `Docker`
- **Dockerfile Path**: `backend/gateway/Dockerfile`
- **Docker Build Context**: `backend/gateway`
- **Instance Type**: `Starter`

#### Port Configuration:
- **Port**: `8085`

#### Health Check:
- **Path**: `/actuator/health`

### 🔐 Environment Variables

```bash
# ============================================
# SERVICE CONFIGURATION
# ============================================
SPRING_PROFILES_ACTIVE=prod
GATEWAY_SERVICE_PORT=8085
PORT=8085

# ============================================
# MICROSERVICES URLS (From Previous Deployments)
# ============================================
USER_SERVICE_URL=https://fittrack-userservice.onrender.com
ADMIN_SERVICE_URL=https://fittrack-adminservice.onrender.com
ACTIVITY_SERVICE_URL=https://fittrack-activityservice.onrender.com
AI_SERVICE_URL=https://fittrack-aiservice.onrender.com

# ============================================
# CORS CONFIGURATION
# ============================================
# Production-ready: Update with your actual frontend domain after deployment
CORS_ALLOWED_ORIGINS=https://fittrack-app.vercel.app,https://www.fittrack.com

# ============================================
# AUTH0 CONFIGURATION
# ============================================
AUTH0_ISSUER_URI=https://dev-5s2csl8rpq2phx88.us.auth0.com/
AUTH0_JWK_SET_URI=https://dev-5s2csl8rpq2phx88.us.auth0.com/.well-known/jwks.json
AUTH0_AUDIENCE=fitness_auth

# ============================================
# SERVICE DISCOVERY (Disabled for Render)
# ============================================
SPRING_CLOUD_DISCOVERY_ENABLED=false
EUREKA_CLIENT_ENABLED=false
EUREKA_CLIENT_REGISTER_WITH_EUREKA=false
EUREKA_CLIENT_FETCH_REGISTRY=false

# ============================================
# GATEWAY ROUTES CONFIGURATION
# ============================================
# These routes are configured in application.yml but can be overridden
SPRING_CLOUD_GATEWAY_ROUTES_0_ID=userservice
SPRING_CLOUD_GATEWAY_ROUTES_0_URI=${USER_SERVICE_URL}
SPRING_CLOUD_GATEWAY_ROUTES_0_PREDICATES_0=Path=/api/users/**

SPRING_CLOUD_GATEWAY_ROUTES_1_ID=adminservice
SPRING_CLOUD_GATEWAY_ROUTES_1_URI=${ADMIN_SERVICE_URL}
SPRING_CLOUD_GATEWAY_ROUTES_1_PREDICATES_0=Path=/api/admin/**

SPRING_CLOUD_GATEWAY_ROUTES_2_ID=activityservice
SPRING_CLOUD_GATEWAY_ROUTES_2_URI=${ACTIVITY_SERVICE_URL}
SPRING_CLOUD_GATEWAY_ROUTES_2_PREDICATES_0=Path=/api/activities/**

SPRING_CLOUD_GATEWAY_ROUTES_3_ID=aiservice
SPRING_CLOUD_GATEWAY_ROUTES_3_URI=${AI_SERVICE_URL}
SPRING_CLOUD_GATEWAY_ROUTES_3_PREDICATES_0=Path=/api/ai/**

# ============================================
# MONITORING
# ============================================
MANAGEMENT_ENDPOINTS_WEB_EXPOSURE_INCLUDE=health,info,metrics,gateway
MANAGEMENT_ENDPOINT_HEALTH_SHOW_DETAILS=always
```

### 📋 Step-by-Step Deployment

1. **IMPORTANT**: Deploy this AFTER all microservices are running!
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - Name: `fittrack-gateway`
   - Root Directory: `backend/gateway`
   - Environment: `Docker`
5. Click **"Advanced"** → Add all environment variables above
6. **Replace URLs** in environment variables with your actual service URLs from previous steps
7. Click **"Create Web Service"**
8. Wait for deployment (5-10 minutes)
9. Once deployed, note the URL: `https://fittrack-gateway.onrender.com`
10. Test health: `https://fittrack-gateway.onrender.com/actuator/health`

### ✅ Verification
```bash
# Test health endpoint
curl https://fittrack-gateway.onrender.com/actuator/health

# Expected response:
{
  "status": "UP",
  "components": {
    "ping": {"status": "UP"}
  }
}

# Test gateway routes
curl https://fittrack-gateway.onrender.com/actuator/gateway/routes
```

---

## Service 6: Frontend

### 📝 Description
React + Vite frontend application with Auth0 authentication.

### 🔧 Deployment Options

You have **TWO OPTIONS** for deploying the frontend:

#### **Option A: Vercel (Recommended - Easier)**

1. **Login to Vercel**: https://vercel.com
2. Click **"New Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. **Environment Variables** (Add in Vercel dashboard):

```bash
# ============================================
# API GATEWAY URL (From Previous Step)
# ============================================
VITE_API_BASE_URL=https://fittrack-gateway.onrender.com
VITE_API_URL=https://fittrack-gateway.onrender.com

# ============================================
# AUTH0 CONFIGURATION
# ============================================
VITE_AUTH0_DOMAIN=dev-5s2csl8rpq2phx88.us.auth0.com
VITE_AUTH0_CLIENT_ID=qnXHlMOmUhSTiQx0ohzneAvZWtTm8IuS
VITE_AUTH0_AUDIENCE=fitness_auth

# After deployment, update this with your Vercel URL
VITE_AUTH0_REDIRECT_URI=https://fittrack-app.vercel.app

# ============================================
# OPTIONAL: SOCIAL MEDIA
# ============================================
VITE_SITE_LINKEDIN=https://www.linkedin.com/in/aniket8727
```

6. Click **"Deploy"**
7. Wait for deployment (3-5 minutes)
8. Once deployed, you'll get a URL like: `https://fittrack-app.vercel.app`

9. **IMPORTANT**: Update Auth0 settings:
   - Go to Auth0 Dashboard → Applications → Your SPA
   - Add to **Allowed Callback URLs**: `https://fittrack-app.vercel.app`
   - Add to **Allowed Logout URLs**: `https://fittrack-app.vercel.app`
   - Add to **Allowed Web Origins**: `https://fittrack-app.vercel.app`
   - Save changes

10. **Update Gateway CORS**:
    - Go back to Render → fittrack-gateway → Environment
    - Update `CORS_ALLOWED_ORIGINS` to include: `https://fittrack-app.vercel.app`
    - Save and redeploy

#### **Option B: Render Static Site**

1. Click **"New +"** → **"Static Site"**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `fittrack-frontend`
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

4. **Environment Variables** (Same as Option A above)

5. Click **"Create Static Site"**
6. Wait for deployment (5-10 minutes)
7. Follow steps 8-10 from Option A

### ✅ Verification
1. Visit your frontend URL
2. You should see the FitTrack login page
3. Click "Login" - Auth0 login popup should appear
4. After login, you should see the dashboard
5. Check browser console for any errors

---

## Verification Steps

### 🔍 Complete System Test

#### 1. **Individual Service Health Checks**
```bash
# User Service
curl https://fittrack-userservice.onrender.com/actuator/health

# Admin Service
curl https://fittrack-adminservice.onrender.com/actuator/health

# Activity Service
curl https://fittrack-activityservice.onrender.com/actuator/health

# AI Service
curl https://fittrack-aiservice.onrender.com/actuator/health

# Gateway
curl https://fittrack-gateway.onrender.com/actuator/health
```

All should return `{"status":"UP"}`

#### 2. **Test Gateway Routing**
```bash
# Test user service through gateway
curl https://fittrack-gateway.onrender.com/api/users/health

# Test activity service through gateway
curl https://fittrack-gateway.onrender.com/api/activities/health

# Test AI service through gateway
curl https://fittrack-gateway.onrender.com/api/ai/health

# Test admin service through gateway
curl https://fittrack-gateway.onrender.com/api/admin/health
```

#### 3. **Test Authentication Flow**
1. Open your frontend URL
2. Click "Login"
3. Login with Auth0
4. Check if JWT token is received
5. Try accessing a protected route

#### 4. **Test Activity → AI Flow**
1. Login to frontend
2. Create a new activity
3. Check Activity Service logs (Render dashboard)
4. Check AI Service logs - should show message received
5. Check if AI recommendation is generated

#### 5. **Test Database Connections**
```bash
# Check logs in Render dashboard for each service
# Look for successful database connection messages:
# - "HikariPool-1 - Start completed" (PostgreSQL services)
# - "Opened connection" (MongoDB services)
# - "Successfully connected to RabbitMQ"
```

#### 6. **Test RabbitMQ Integration**
1. Login to CloudAMQP dashboard
2. Check "Queues" tab
3. You should see:
   - `activity.queue` (main queue)
   - `activity.dlq` (dead letter queue)
4. Send a test activity from frontend
5. Queue count should increment then decrement (processed)

---

## Troubleshooting

### 🐛 Common Issues and Solutions

#### Issue 1: Service Won't Start
**Symptoms**: Build fails or service crashes immediately

**Solutions**:
1. Check Render logs for error messages
2. Verify all environment variables are set correctly
3. Check database connection strings (no extra spaces, correct format)
4. Ensure Java 21 is being used (check Dockerfile)

#### Issue 2: Database Connection Failed
**Symptoms**: Error: "Could not connect to database"

**Solutions**:
1. **Neon PostgreSQL**:
   - Check if database exists in Neon dashboard
   - Verify SSL mode: `?sslmode=require&channel_binding=require`
   - Check username and password (no spaces)
   - Ensure database is not paused (Neon auto-pauses after inactivity)

2. **MongoDB Atlas**:
   - Check IP whitelist: Add `0.0.0.0/0` for all IPs
   - Verify database user permissions
   - Check connection string format
   - Ensure database name matches in URI and variable

#### Issue 3: RabbitMQ Connection Failed
**Symptoms**: "Connection refused" or "Authentication failed"

**Solutions**:
1. Check CloudAMQP credentials
2. Verify SSL is enabled: `SPRING_RABBITMQ_SSL_ENABLED=true`
3. Use `amqps://` not `amqp://` in connection URL
4. Check virtual host name matches CloudAMQP

#### Issue 4: CORS Errors in Frontend
**Symptoms**: "Access-Control-Allow-Origin" error in browser console

**Solutions**:
1. Update Gateway `CORS_ALLOWED_ORIGINS` to include your frontend URL
2. Make sure frontend URL is EXACTLY as shown in browser (check https vs http)
3. Redeploy Gateway after updating
4. Clear browser cache and try again

#### Issue 5: Auth0 Login Fails
**Symptoms**: "redirect_uri mismatch" or login popup closes immediately

**Solutions**:
1. Go to Auth0 Dashboard → Applications → Your SPA
2. Check **Allowed Callback URLs** includes your frontend URL
3. Check **Allowed Logout URLs** includes your frontend URL
4. Check **Allowed Web Origins** includes your frontend URL
5. Verify `VITE_AUTH0_REDIRECT_URI` in frontend env matches
6. Clear browser cookies and try again

#### Issue 6: Gateway Can't Reach Services
**Symptoms**: 503 Service Unavailable when calling gateway

**Solutions**:
1. Verify all service URLs in Gateway environment variables
2. Make sure services are running (check Render dashboard)
3. Test direct service URLs first before testing through gateway
4. Check service logs for errors
5. Verify routes configuration in Gateway

#### Issue 7: AI Service Not Processing Messages
**Symptoms**: Activities created but no AI recommendations

**Solutions**:
1. Check AI Service logs - should show "Received message"
2. Verify RabbitMQ listener is enabled: `RABBITMQ_LISTENER_AUTO_START=true`
3. Check Gemini API key is valid
4. Test Gemini API separately:
```bash
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyC-Oy1V1FksKMeFT42epVOUlhpjXo6jC18" \
  -H 'Content-Type: application/json' \
  -d '{"contents":[{"parts":[{"text":"Hello"}]}]}'
```
5. Check CloudAMQP dashboard - messages should be consumed, not stuck

#### Issue 8: Frontend Build Fails
**Symptoms**: Build fails during `npm run build`

**Solutions**:
1. Check Node version (should be 18+)
2. Verify all `VITE_*` environment variables are set
3. Check for syntax errors in code
4. Try building locally first: `npm install && npm run build`
5. Check Vercel/Render build logs for specific error

#### Issue 9: Slow Service Response
**Symptoms**: Requests take 30+ seconds

**Solutions**:
1. Render free tier services sleep after 15 minutes of inactivity
2. First request wakes up the service (takes 30-60 seconds)
3. Solution: Upgrade to paid tier OR use a uptime monitoring service like:
   - UptimeRobot (free): https://uptimerobot.com
   - Ping your services every 14 minutes to keep them awake

#### Issue 10: "Service Unavailable" After Deployment
**Symptoms**: 503 errors even though service shows "Live"

**Solutions**:
1. Check health check endpoint is responding
2. Verify port configuration matches Dockerfile EXPOSE
3. Check if service needs warm-up time (try again after 2 minutes)
4. Review service logs for startup errors
5. Check if all dependencies (DB, RabbitMQ) are accessible

---

## 📊 Cost Estimation

### Free Tier (Render + Cloud Services)

| Service | Provider | Cost |
|---------|----------|------|
| User Service | Render | Free (750 hrs/mo) |
| Admin Service | Render | Free (750 hrs/mo) |
| Activity Service | Render | Free (750 hrs/mo) |
| AI Service | Render | Free (750 hrs/mo) |
| Gateway | Render | Free (750 hrs/mo) |
| Frontend | Vercel | Free |
| PostgreSQL (2 DBs) | Neon | Free (500 hrs/mo) |
| MongoDB (2 DBs) | Atlas | Free (512 MB) |
| RabbitMQ | CloudAMQP | Free (Lemur plan) |
| Gemini AI | Google | Free (60 req/min) |
| Auth0 | Auth0 | Free (7,500 MAU) |
| **Total** | | **$0/month** |

**Limitations of Free Tier**:
- Services sleep after 15 minutes of inactivity
- Limited compute resources
- 750 hours per month per service (not enough to run 24/7)
- Database storage limits

### Recommended Paid Tier (~$35/month)

| Service | Provider | Cost |
|---------|----------|------|
| 5 Web Services | Render | $7 × 5 = $35/mo |
| PostgreSQL | Neon | Free tier sufficient |
| MongoDB | Atlas | Free tier sufficient |
| RabbitMQ | CloudAMQP | Free tier sufficient |
| Frontend | Vercel | Free |
| **Total** | | **$35/month** |

**Benefits**:
- Services run 24/7 (no sleeping)
- Better performance
- No cold start delays
- Professional deployment

---

## 🔗 Quick Reference Links

### Service URLs (Update After Deployment)
```bash
# Backend Services
USER_SERVICE_URL=https://fittrack-userservice.onrender.com
ADMIN_SERVICE_URL=https://fittrack-adminservice.onrender.com
ACTIVITY_SERVICE_URL=https://fittrack-activityservice.onrender.com
AI_SERVICE_URL=https://fittrack-aiservice.onrender.com
GATEWAY_URL=https://fittrack-gateway.onrender.com

# Frontend
FRONTEND_URL=https://fittrack-app.vercel.app
```

### Dashboard URLs
- **Render Dashboard**: https://dashboard.render.com
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Neon Dashboard**: https://console.neon.tech
- **MongoDB Atlas**: https://cloud.mongodb.com
- **CloudAMQP**: https://customer.cloudamqp.com
- **Auth0**: https://manage.auth0.com
- **Gemini API**: https://makersuite.google.com/app/apikey

---

## 📝 Deployment Checklist

Use this checklist to track your deployment progress:

### Pre-Deployment
- [ ] Created Neon PostgreSQL account
- [ ] Created 2 databases: user_db, admin_db
- [ ] Created MongoDB Atlas account
- [ ] Created cluster with 2 databases: activity_db, ai_db
- [ ] Created 2 MongoDB users with proper permissions
- [ ] Created CloudAMQP account and instance
- [ ] Noted RabbitMQ credentials
- [ ] Created Auth0 account and tenant
- [ ] Created Auth0 API (audience: fitness_auth)
- [ ] Created Auth0 SPA application
- [ ] Obtained Gemini API key
- [ ] Pushed code to GitHub
- [ ] Created Render account

### Service Deployment
- [ ] Deployed User Service
- [ ] Verified User Service health endpoint
- [ ] Deployed Admin Service
- [ ] Verified Admin Service health endpoint
- [ ] Deployed Activity Service
- [ ] Verified Activity Service health endpoint
- [ ] Deployed AI Service
- [ ] Verified AI Service health endpoint
- [ ] Updated Gateway environment with service URLs
- [ ] Deployed Gateway
- [ ] Verified Gateway health endpoint
- [ ] Verified Gateway routes
- [ ] Deployed Frontend to Vercel/Render
- [ ] Verified Frontend loads

### Post-Deployment Configuration
- [ ] Updated Auth0 Allowed Callback URLs with frontend URL
- [ ] Updated Auth0 Allowed Logout URLs with frontend URL
- [ ] Updated Auth0 Allowed Web Origins with frontend URL
- [ ] Updated Gateway CORS_ALLOWED_ORIGINS with frontend URL
- [ ] Tested login flow
- [ ] Created test activity
- [ ] Verified AI processing
- [ ] Checked all service logs
- [ ] Verified database connections
- [ ] Verified RabbitMQ message flow
- [ ] Tested all API endpoints through Gateway

### Documentation
- [ ] Documented all service URLs
- [ ] Saved all environment variables securely
- [ ] Created backup of configurations
- [ ] Documented any custom changes made
- [ ] Updated README with deployment URLs

---

## 🎉 Deployment Complete!

After completing all steps and verifications, your FitTrack application should be fully deployed and operational on Render!

### 🚀 Production Ready Summary

**✅ All Credentials Configured:**
- ✓ Auth0 authentication (fitness_auth)
- ✓ Neon PostgreSQL (user_db, admin_db)
- ✓ MongoDB Atlas (activity_db, ai_db)
- ✓ CloudAMQP RabbitMQ (message broker)
- ✓ Google Gemini AI (AIzaSyC-Oy1V1FksKMeFT42epVOUlhpjXo6jC18)
- ✓ EmailJS (fitness_app service)

**📦 6 Services Ready to Deploy:**
1. User Service → Port 8081
2. Admin Service → Port 8082
3. Activity Service → Port 8083
4. AI Service → Port 8084
5. API Gateway → Port 8085
6. Frontend → Vercel/Render Static Site

**🔒 Security Note:**
This file contains real production credentials. Keep it secure and do NOT commit to public repositories.

### Next Steps:
1. Deploy services in order: User → Admin → Activity → AI → Gateway → Frontend
2. Monitor service logs for any errors
3. Set up uptime monitoring (UptimeRobot) - recommended to prevent service sleeping
4. Configure custom domain (optional)
5. SSL certificates are automatic on Render (free)
6. Consider upgrading to paid tier ($7/service/month) for 24/7 uptime

### Support:
- Render Documentation: https://render.com/docs
- Render Community: https://community.render.com
- Your service logs are your best friend for debugging

**Good luck with your deployment! 🚀**

