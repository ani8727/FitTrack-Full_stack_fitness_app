# 🔐 RENDER ENVIRONMENT VARIABLES - QUICK COPY-PASTE REFERENCE

> **⚠️ IMPORTANT**: This file contains actual production credentials. Keep secure. DO NOT commit to public repositories.
> 
> **✅ FIXED**: Config server dependency removed. All services now deploy without CONFIG_SERVER_URL.

---

## 📋 Service 1: User Service (Port 8081)

**COPY-PASTE THESE EXACT VALUES INTO RENDER:**

```bash
SPRING_PROFILES_ACTIVE=prod
USER_SERVICE_PORT=8081
PORT=8081

# Database - Neon PostgreSQL (REQUIRED)
SPRING_DATASOURCE_URL=jdbc:postgresql://ep-small-truth-ahb8e4vi-pooler.c-3.us-east-1.aws.neon.tech:5432/user_db?sslmode=require&channel_binding=require
SPRING_DATASOURCE_USERNAME=neondb_owner
SPRING_DATASOURCE_PASSWORD=npg_CLRh6Z5OFUGm
SPRING_JPA_HIBERNATE_DDL_AUTO=validate
SPRING_JPA_SHOW_SQL=false
SPRING_JPA_PROPERTIES_HIBERNATE_DIALECT=org.hibernate.dialect.PostgreSQLDialect

# Auth0 (REQUIRED)
AUTH0_ISSUER_URI=https://dev-5s2csl8rpq2phx88.us.auth0.com/
AUTH0_JWK_SET_URI=https://dev-5s2csl8rpq2phx88.us.auth0.com/.well-known/jwks.json
AUTH0_AUDIENCE=fitness_auth

# EmailJS (Optional)
EMAILJS_SERVICE_ID=fitness_app
EMAILJS_TEMPLATE_ID=template_hpm27gd
EMAILJS_PUBLIC_KEY=NXoVXoETzx_Thvzn1
EMAILJS_PRIVATE_KEY=NXoVXoETzx_Thvzn1

# Service Discovery (Disabled for Render - DO NOT CHANGE)
SPRING_CLOUD_DISCOVERY_ENABLED=false
EUREKA_CLIENT_ENABLED=false
EUREKA_CLIENT_REGISTER_WITH_EUREKA=false
EUREKA_CLIENT_FETCH_REGISTRY=false

# Monitoring
MANAGEMENT_ENDPOINTS_WEB_EXPOSURE_INCLUDE=health,info,metrics
MANAGEMENT_ENDPOINT_HEALTH_SHOW_DETAILS=always
```

---

## 📋 Service 2: Admin Service (Port 8082)

**COPY-PASTE THESE EXACT VALUES INTO RENDER:**

```bash
SPRING_PROFILES_ACTIVE=prod
ADMIN_SERVICE_PORT=8082
PORT=8082

# Database - Neon PostgreSQL (REQUIRED)
SPRING_DATASOURCE_URL=jdbc:postgresql://ep-small-truth-ahb8e4vi-pooler.c-3.us-east-1.aws.neon.tech:5432/admin_db?sslmode=require&channel_binding=require
SPRING_DATASOURCE_USERNAME=neondb_owner
SPRING_DATASOURCE_PASSWORD=npg_CLRh6Z5OFUGm
SPRING_JPA_HIBERNATE_DDL_AUTO=validate
SPRING_JPA_SHOW_SQL=false
SPRING_JPA_PROPERTIES_HIBERNATE_DIALECT=org.hibernate.dialect.PostgreSQLDialect

# Auth0 (REQUIRED)
AUTH0_ISSUER_URI=https://dev-5s2csl8rpq2phx88.us.auth0.com/
AUTH0_JWK_SET_URI=https://dev-5s2csl8rpq2phx88.us.auth0.com/.well-known/jwks.json
AUTH0_AUDIENCE=fitness_auth

# Service Discovery (Disabled for Render - DO NOT CHANGE)
SPRING_CLOUD_DISCOVERY_ENABLED=false
EUREKA_CLIENT_ENABLED=false
EUREKA_CLIENT_REGISTER_WITH_EUREKA=false
EUREKA_CLIENT_FETCH_REGISTRY=false

# Monitoring
MANAGEMENT_ENDPOINTS_WEB_EXPOSURE_INCLUDE=health,info,metrics
MANAGEMENT_ENDPOINT_HEALTH_SHOW_DETAILS=always
```

---

## 📋 Service 3: Activity Service (Port 8083)

**COPY-PASTE THESE EXACT VALUES INTO RENDER:**

```bash
SPRING_PROFILES_ACTIVE=prod
ACTIVITY_SERVICE_PORT=8083
PORT=8083

# Database - MongoDB Atlas (REQUIRED)
SPRING_DATA_MONGODB_URI=mongodb+srv://activity_db_user:activity_db_user@fitapp.awbcqor.mongodb.net/activity_db?retryWrites=true&w=majority&tls=true&appName=FitApp
SPRING_DATA_MONGODB_DATABASE=activity_db

# RabbitMQ - CloudAMQP (REQUIRED)
SPRING_RABBITMQ_ADDRESSES=amqps://unvzgqsg:6xz8gRL6dG0F8CNxrhWTwoJWN9PqIrVu@leopard.lmq.cloudamqp.com/unvzgqsg
SPRING_RABBITMQ_USERNAME=unvzgqsg
SPRING_RABBITMQ_PASSWORD=6xz8gRL6dG0F8CNxrhWTwoJWN9PqIrVu
SPRING_RABBITMQ_VIRTUAL_HOST=unvzgqsg
SPRING_RABBITMQ_SSL_ENABLED=true
SPRING_RABBITMQ_PORT=5671

# RabbitMQ Configuration
RABBITMQ_EXCHANGE=activity.exchange
RABBITMQ_QUEUE=activity.queue
RABBITMQ_ROUTING_KEY=activity.tracking
RABBITMQ_DEAD_LETTER_EXCHANGE=activity.dlx
RABBITMQ_DEAD_LETTER_QUEUE=activity.dlq
RABBITMQ_MESSAGE_TTL_MS=300000
RABBITMQ_RETRY_ENABLED=true
RABBITMQ_RETRY_MAX_ATTEMPTS=3
RABBITMQ_RETRY_INITIAL_INTERVAL=1000
RABBITMQ_RETRY_MAX_INTERVAL=10000
RABBITMQ_RETRY_MULTIPLIER=2.0
RABBITMQ_LISTENER_AUTO_START=true
RABBITMQ_LISTENER_ACKNOWLEDGE_MODE=auto

# Auth0 (REQUIRED)
AUTH0_ISSUER_URI=https://dev-5s2csl8rpq2phx88.us.auth0.com/
AUTH0_JWK_SET_URI=https://dev-5s2csl8rpq2phx88.us.auth0.com/.well-known/jwks.json
AUTH0_AUDIENCE=fitness_auth

# Service Discovery (Disabled for Render - DO NOT CHANGE)
SPRING_CLOUD_DISCOVERY_ENABLED=false
EUREKA_CLIENT_ENABLED=false
EUREKA_CLIENT_REGISTER_WITH_EUREKA=false
EUREKA_CLIENT_FETCH_REGISTRY=false

# Monitoring
MANAGEMENT_ENDPOINTS_WEB_EXPOSURE_INCLUDE=health,info,metrics
MANAGEMENT_ENDPOINT_HEALTH_SHOW_DETAILS=always
```

---

## 📋 Service 4: AI Service (Port 8084)

**COPY-PASTE THESE EXACT VALUES INTO RENDER:**

```bash
SPRING_PROFILES_ACTIVE=prod
AI_SERVICE_PORT=8084
PORT=8084

# Database - MongoDB Atlas (REQUIRED)
SPRING_DATA_MONGODB_URI=mongodb+srv://ai_db_user:ai_db_user@fitapp.awbcqor.mongodb.net/ai_db?retryWrites=true&w=majority&tls=true&appName=FitApp
SPRING_DATA_MONGODB_DATABASE=ai_db

# RabbitMQ - CloudAMQP (REQUIRED)
SPRING_RABBITMQ_ADDRESSES=amqps://unvzgqsg:6xz8gRL6dG0F8CNxrhWTwoJWN9PqIrVu@leopard.lmq.cloudamqp.com/unvzgqsg
SPRING_RABBITMQ_USERNAME=unvzgqsg
SPRING_RABBITMQ_PASSWORD=6xz8gRL6dG0F8CNxrhWTwoJWN9PqIrVu
SPRING_RABBITMQ_VIRTUAL_HOST=unvzgqsg
SPRING_RABBITMQ_SSL_ENABLED=true
SPRING_RABBITMQ_PORT=5671

# RabbitMQ Configuration
RABBITMQ_EXCHANGE=activity.exchange
RABBITMQ_QUEUE=activity.queue
RABBITMQ_ROUTING_KEY=activity.tracking
RABBITMQ_DEAD_LETTER_EXCHANGE=activity.dlx
RABBITMQ_DEAD_LETTER_QUEUE=activity.dlq
RABBITMQ_MESSAGE_TTL_MS=300000
RABBITMQ_RETRY_ENABLED=true
RABBITMQ_RETRY_MAX_ATTEMPTS=3
RABBITMQ_RETRY_INITIAL_INTERVAL=1000
RABBITMQ_RETRY_MAX_INTERVAL=10000
RABBITMQ_RETRY_MULTIPLIER=2.0
RABBITMQ_LISTENER_AUTO_START=true
RABBITMQ_LISTENER_ACKNOWLEDGE_MODE=auto

# Google Gemini AI (REQUIRED)
GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent
GEMINI_API_KEY=AIzaSyC-Oy1V1FksKMeFT42epVOUlhpjXo6jC18

# Auth0 (REQUIRED)
AUTH0_ISSUER_URI=https://dev-5s2csl8rpq2phx88.us.auth0.com/
AUTH0_JWK_SET_URI=https://dev-5s2csl8rpq2phx88.us.auth0.com/.well-known/jwks.json
AUTH0_AUDIENCE=fitness_auth

# Service Discovery (Disabled for Render - DO NOT CHANGE)
SPRING_CLOUD_DISCOVERY_ENABLED=false
EUREKA_CLIENT_ENABLED=false
EUREKA_CLIENT_REGISTER_WITH_EUREKA=false
EUREKA_CLIENT_FETCH_REGISTRY=false

# Monitoring
MANAGEMENT_ENDPOINTS_WEB_EXPOSURE_INCLUDE=health,info,metrics
MANAGEMENT_ENDPOINT_HEALTH_SHOW_DETAILS=always
```

---

## 📋 Service 5: API Gateway (Port 8085)

**⚠️ IMPORTANT**: Deploy this ONLY AFTER all other services are running. Update the service URLs below with your actual Render URLs.

**COPY-PASTE THESE EXACT VALUES INTO RENDER:**

```bash
SPRING_PROFILES_ACTIVE=prod
GATEWAY_SERVICE_PORT=8085
PORT=8085

# Microservices URLs (REQUIRED - UPDATE WITH YOUR ACTUAL RENDER URLs)
USER_SERVICE_URL=https://fittrack-userservice.onrender.com
ADMIN_SERVICE_URL=https://fittrack-adminservice.onrender.com
ACTIVITY_SERVICE_URL=https://fittrack-activityservice.onrender.com
AI_SERVICE_URL=https://fittrack-aiservice.onrender.com

# CORS (REQUIRED - Update with your actual frontend URL)
CORS_ALLOWED_ORIGINS=https://fittrack-app.vercel.app,https://www.fittrack.com

# Auth0 (REQUIRED)
AUTH0_ISSUER_URI=https://dev-5s2csl8rpq2phx88.us.auth0.com/
AUTH0_JWK_SET_URI=https://dev-5s2csl8rpq2phx88.us.auth0.com/.well-known/jwks.json
AUTH0_AUDIENCE=fitness_auth

# Service Discovery (Disabled for Render - DO NOT CHANGE)
SPRING_CLOUD_DISCOVERY_ENABLED=false
EUREKA_CLIENT_ENABLED=false
EUREKA_CLIENT_REGISTER_WITH_EUREKA=false
EUREKA_CLIENT_FETCH_REGISTRY=false

# Gateway Routes (Optional - Already configured in application.yml)
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

# Monitoring
MANAGEMENT_ENDPOINTS_WEB_EXPOSURE_INCLUDE=health,info,metrics,gateway
MANAGEMENT_ENDPOINT_HEALTH_SHOW_DETAILS=always
```

---

## 📋 Service 6: Frontend (Vercel or Render)

**⚠️ IMPORTANT**: Deploy this ONLY AFTER Gateway is running. Update redirect URI in Auth0 dashboard after deployment.

**COPY-PASTE THESE EXACT VALUES INTO VERCEL/RENDER:**

```bash
# API Gateway URL (REQUIRED - UPDATE WITH YOUR ACTUAL GATEWAY URL)
VITE_API_BASE_URL=https://fittrack-gateway.onrender.com
VITE_API_URL=https://fittrack-gateway.onrender.com

# Auth0 (REQUIRED)
VITE_AUTH0_DOMAIN=dev-5s2csl8rpq2phx88.us.auth0.com
VITE_AUTH0_CLIENT_ID=qnXHlMOmUhSTiQx0ohzneAvZWtTm8IuS
VITE_AUTH0_AUDIENCE=fitness_auth

# Redirect URI (REQUIRED - UPDATE WITH YOUR ACTUAL FRONTEND URL)
VITE_AUTH0_REDIRECT_URI=https://fittrack-app.vercel.app

# Optional
VITE_SITE_LINKEDIN=https://www.linkedin.com/in/aniket8727
```

---

## 🔄 Deployment Order

**CRITICAL**: Deploy in this exact order:

1. **User Service** → Copy-paste env vars above → Deploy → Get URL → `https://fittrack-userservice.onrender.com`
2. **Admin Service** → Copy-paste env vars above → Deploy → Get URL → `https://fittrack-adminservice.onrender.com`
3. **Activity Service** → Copy-paste env vars above → Deploy → Get URL → `https://fittrack-activityservice.onrender.com`
4. **AI Service** → Copy-paste env vars above → Deploy → Get URL → `https://fittrack-aiservice.onrender.com`
5. **API Gateway** → Update service URLs → Copy-paste env vars → Deploy → Get URL → `https://fittrack-gateway.onrender.com`
6. **Frontend** → Update Gateway URL → Copy-paste env vars → Deploy → Get URL → `https://fittrack-app.vercel.app`

---

## 🚀 Quick Deployment Instructions

### Step 1: Deploy Backend Services (User, Admin, Activity, AI)

For each service (1-4):

1. Go to Render Dashboard → **New +** → **Web Service**
2. Connect GitHub repository
3. Configure:
   - **Name**: `fittrack-[servicename]` (e.g., `fittrack-userservice`)
   - **Root Directory**: `backend/[servicename]` (e.g., `backend/userservice`)
   - **Environment**: `Docker`
   - **Instance Type**: `Starter` (Free tier)
4. Click **Advanced** → Scroll to **Environment Variables**
5. **COPY-PASTE** the entire env block from this file (sections above)
6. Click **Create Web Service**
7. Wait 5-10 minutes for deployment
8. **Note the URL** for use in Gateway configuration

### Step 2: Deploy Gateway

1. Complete Step 1 for all 4 services first
2. Update Gateway env vars with actual service URLs from Step 1
3. Deploy Gateway using same process
4. Note Gateway URL for frontend

### Step 3: Deploy Frontend

1. Go to Vercel → **New Project** → Import from GitHub
2. Configure:
   - **Framework**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Output Directory**: `dist`
3. Add environment variables (copy-paste from Service 6 section above)
4. Update `VITE_API_BASE_URL` with your Gateway URL
5. Click **Deploy**
6. Note frontend URL

### Step 4: Update Auth0

1. Go to https://manage.auth0.com → Applications → fitness_auth
2. Add frontend URL to:
   - Allowed Callback URLs
   - Allowed Logout URLs
   - Allowed Web Origins
3. Save

### Step 5: Update Gateway CORS

1. Go to Render → fittrack-gateway → Environment
2. Update `CORS_ALLOWED_ORIGINS` with frontend URL
3. Save and redeploy

---

## ✅ Verification Checklist

After deployment, verify each service:

```bash
# Test each health endpoint (should return {"status":"UP"})
curl https://fittrack-userservice.onrender.com/actuator/health
curl https://fittrack-adminservice.onrender.com/actuator/health
curl https://fittrack-activityservice.onrender.com/actuator/health
curl https://fittrack-aiservice.onrender.com/actuator/health
curl https://fittrack-gateway.onrender.com/actuator/health
```

Visit frontend URL → Login → Check dashboard loads

---

## 🔧 Troubleshooting

### Issue: Service won't start - "NullPointerException" or "CONFIG_SERVER_URL"
**Solution**: This is FIXED. Make sure you:
- Pulled latest code from GitHub (includes config fix)
- Redeploy the service on Render (trigger manual deploy)
- DO NOT add CONFIG_SERVER_URL environment variable

### Issue: Database connection failed
**Solution**: 
- For PostgreSQL: Check Neon database is not paused
- For MongoDB: Check IP whitelist includes `0.0.0.0/0`
- Verify credentials are exact (no extra spaces)

### Issue: CORS errors
**Solution**:
- Update Gateway `CORS_ALLOWED_ORIGINS` with exact frontend URL
- Update Auth0 callback URLs with exact frontend URL
- Redeploy Gateway after changes

---

## ✅ Post-Deployment Checklist

After deploying frontend, update Auth0:

1. Go to: https://manage.auth0.com
2. Navigate to: Applications → fitness_auth
3. Add your frontend URL to:
   - **Allowed Callback URLs**: `https://fittrack-app.vercel.app`
   - **Allowed Logout URLs**: `https://fittrack-app.vercel.app`
   - **Allowed Web Origins**: `https://fittrack-app.vercel.app`
4. Save changes

Then update Gateway:
1. Go to Render Dashboard → fittrack-gateway → Environment
2. Update `CORS_ALLOWED_ORIGINS` to include: `https://fittrack-app.vercel.app`
3. Save and trigger manual redeploy

---

## 📊 Service Health Check URLs

After deployment, verify all services:

```bash
# User Service
https://fittrack-userservice.onrender.com/actuator/health

# Admin Service
https://fittrack-adminservice.onrender.com/actuator/health

# Activity Service
https://fittrack-activityservice.onrender.com/actuator/health

# AI Service
https://fittrack-aiservice.onrender.com/actuator/health

# API Gateway
https://fittrack-gateway.onrender.com/actuator/health

# Frontend
https://fittrack-app.vercel.app
```

All health endpoints should return: `{"status":"UP"}`

---

## 🔒 Security Reminder

**This file contains production credentials. Keep secure:**
- ✅ Do NOT commit to public repositories
- ✅ Do NOT share on public forums
- ✅ Keep backup in secure password manager
- ✅ Rotate credentials if exposed

---

## 📝 Change Log

**Latest Update (Jan 23, 2026):**
- ✅ Fixed CONFIG_SERVER_URL NullPointerException
- ✅ Removed config server dependency from all services
- ✅ Set discovery disabled by default (Render compatible)
- ✅ All environment variables now work with simple copy-paste
- ✅ No manual configuration changes needed in application.yml
- ✅ Ready for immediate deployment to Render

**Good luck with your deployment! 🚀**
