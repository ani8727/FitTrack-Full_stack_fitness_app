# 🏋️ FitTrack - Full Stack Fitness Tracking Application

A production-ready, enterprise-grade microservices-based fitness tracking application featuring a modern React frontend with OAuth2 authentication, Spring Boot microservices backend, and AI-powered activity recommendations.

[![Java](https://img.shields.io/badge/Java-17+-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2+-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
[![License](https://img.shields.io/badge/License-Private-red.svg)](LICENSE)

## 🎯 About The Project

FitTrack is a comprehensive fitness tracking platform designed with modern microservices architecture. It enables users to track workouts, monitor progress, receive AI-powered recommendations, and manage fitness goals through an intuitive web interface. The application demonstrates enterprise-level software engineering practices including service discovery, API gateway, centralized configuration, OAuth2 security, and event-driven architecture.

### Key Highlights
- 🔐 **Secure Authentication** - OAuth2/OIDC with Keycloak
- 🎨 **Modern UI/UX** - React 19 + Tailwind CSS with dark/light themes
- 🚀 **Scalable Architecture** - Microservices with Spring Cloud
- 📊 **Real-time Analytics** - Activity tracking and statistics
- 🤖 **AI Recommendations** - Intelligent workout suggestions
- 👨‍💼 **Admin Portal** - Complete user management system

## 📁 Project Architecture & Structure

```
fitness_app/
│
├── 🔧 Infrastructure Services
│   ├── configserver/          # Centralized Configuration (Port: 8888)
│   ├── eureka/                # Service Discovery & Registry (Port: 8761)
│   └── gateway/               # API Gateway & Load Balancer (Port: 8085)
│
├── 🎯 Business Services
│   ├── userservice/           # User Management & Authentication (Port: 8081)
│   ├── activityservice/       # Activity Tracking & CRUD (Port: 8082)
│   ├── adminservice/          # Admin Dashboard & User Management (Port: 8083)
│   └── aiservice/             # AI-Powered Recommendations (Port: 8084)
│
├── 💻 Frontend Application
│   └── fitness-app-frontend/  # React SPA with Vite (Port: 5173)
│
└── 🐳 Infrastructure
    ├── docker-compose.yml     # MySQL & MongoDB Containers
    └── start-all.bat          # Quick Start Script (Windows)
```

## 🏗️ System Architecture

### Microservices Design Pattern

```
┌─────────────────────────────────────────────────────────────┐
│                      Keycloak (8181)                        │
│                   OAuth2/OIDC Provider                      │
└─────────────────────────────────────────────────────────────┘
                            ▲
                            │ JWT Validation
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              React Frontend (5173)                          │
│   React 19 + Vite + Tailwind CSS + React Router           │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼ REST API
┌─────────────────────────────────────────────────────────────┐
│                API Gateway (8085)                           │
│      Spring Cloud Gateway + Load Balancing + CORS          │
└─────────────────────────────────────────────────────────────┘
                            │
              ┌─────────────┼─────────────┐
              ▼             ▼             ▼
    ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
    │ User Service │ │Activity Svc  │ │ Admin Svc    │
    │   (8081)     │ │   (8082)     │ │   (8083)     │
    │  MySQL DB    │ │  MongoDB     │ │  MySQL DB    │
    └──────────────┘ └──────────────┘ └──────────────┘
                            │
                            ▼ Events
                    ┌──────────────┐
                    │  AI Service  │
                    │   (8084)     │
                    │  MongoDB     │
                    └──────────────┘
                            ▲
                            │
    ┌──────────────────────────────────────────┐
    │   Config Server (8888)                   │
    │   Centralized Configuration              │
    └──────────────────────────────────────────┘
                            ▲
    ┌──────────────────────────────────────────┐
    │   Eureka Server (8761)                   │
    │   Service Discovery & Registration       │
    └──────────────────────────────────────────┘
```

## 🚀 Quick Start Guide

### Prerequisites

| Technology | Version | Purpose |
|-----------|---------|---------|
| Java | 17+ | Backend Runtime |
| Maven | 3.8+ | Build Tool |
| Node.js | 18+ | Frontend Runtime |
| Docker Desktop | Latest | Database Containers |
| Git | Latest | Version Control |

### Installation Steps

#### 1️⃣ Clone Repository
```bash
git clone https://github.com/ani8727/FitTrack-Full_stack_fitness_app.git
cd fitness_app
```

#### 2️⃣ Start Database Infrastructure
```bash
docker-compose up -d
```
This starts MySQL (3307) and MongoDB (27017)

#### 3️⃣ Start Backend Services (In Order)
```bash
# Terminal 1 - Configuration Server
cd configserver && mvn spring-boot:run

# Terminal 2 - Service Discovery
cd eureka && mvn spring-boot:run

# Terminal 3 - API Gateway
cd gateway && mvn spring-boot:run

# Terminal 4 - User Service
cd userservice && mvn spring-boot:run

# Terminal 5 - Activity Service
cd activityservice && mvn spring-boot:run

# Terminal 6 - Admin Service
cd adminservice && mvn spring-boot:run

# Terminal 7 - AI Service
cd aiservice && mvn spring-boot:run
```

#### 4️⃣ Start Frontend Application
```bash
cd fitness-app-frontend
npm install
npm run dev
```

#### 5️⃣ Access Application
- 🌐 **Frontend**: http://localhost:5173
- 📊 **Eureka Dashboard**: http://localhost:8761
- 🚪 **API Gateway**: http://localhost:8085
- 🔐 **Keycloak** (if configured): http://localhost:8181

## 📦 Microservices Modules

### 🔧 Infrastructure Services

#### Config Server (Port: 8888)
- **Purpose**: Centralized configuration management for all microservices
- **Technology**: Spring Cloud Config Server
- **Features**:
  - YAML-based configuration files
  - Environment-specific properties
  - Dynamic configuration refresh
  - Git-backed configuration store
- **Configuration Files**:
  - `application.yml` - Default configuration
  - `user-service.yml` - User service config
  - `activity-service.yml` - Activity service config
  - `ai-service.yml` - AI service config

#### Eureka Server (Port: 8761)
- **Purpose**: Service discovery and registration
- **Technology**: Spring Cloud Netflix Eureka
- **Features**:
  - Automatic service registration
  - Health check monitoring
  - Load balancing support
  - Service instance management
- **Dashboard**: http://localhost:8761

#### API Gateway (Port: 8085)
- **Purpose**: Single entry point for all client requests
- **Technology**: Spring Cloud Gateway
- **Features**:
  - Request routing and load balancing
  - CORS configuration
  - JWT token validation
  - Rate limiting support
  - Circuit breaker patterns
- **Routes**:
  - `/api/users/**` → User Service
  - `/api/activities/**` → Activity Service
  - `/api/admin/**` → Admin Service
  - `/api/recommendations/**` → AI Service

### 🎯 Business Services

#### User Service (Port: 8081)
- **Purpose**: User management and authentication
- **Database**: MySQL (fitness_users_db)
- **Technology**: Spring Boot + JPA + MySQL
- **Features**:
  - User registration and authentication
  - Profile management
  - OAuth2 integration with Keycloak
  - Role-based access control (USER, ADMIN)
  - Password encryption (BCrypt)
- **Endpoints**:
  - `POST /api/users/register` - Register new user
  - `GET /api/users/{id}` - Get user profile
  - `PUT /api/users/{id}` - Update user profile
  - `GET /api/users/{id}/validate` - Validate user credentials

#### Activity Service (Port: 8082)
- **Purpose**: Fitness activity tracking and management
- **Database**: MongoDB (fitness_activities)
- **Technology**: Spring Boot + Spring Data MongoDB
- **Features**:
  - Activity CRUD operations
  - Activity statistics and analytics
  - Real-time activity tracking
  - Activity history management
  - Event publishing for AI recommendations
- **Endpoints**:
  - `GET /api/activities` - Get user activities (with pagination)
  - `POST /api/activities` - Create new activity
  - `GET /api/activities/{id}` - Get activity by ID
  - `PUT /api/activities/{id}` - Update activity
  - `DELETE /api/activities/{id}` - Delete activity
  - `GET /api/activities/stats` - Get user statistics

#### Admin Service (Port: 8083)
- **Purpose**: Administrative operations and user management
- **Database**: MySQL (fitness_users_db)
- **Technology**: Spring Boot + JPA + MySQL
- **Features**:
  - User management dashboard
  - System statistics
  - User role management
  - User account control (activate/deactivate)
- **Endpoints** (Admin Only 🔒):
  - `GET /api/admin/dashboard/stats` - Dashboard statistics
  - `GET /api/admin/users` - Get all users
  - `GET /api/admin/users/{id}` - Get user by ID
  - `PUT /api/admin/users/{id}/role` - Update user role
  - `DELETE /api/admin/users/{id}` - Delete user account

#### AI Service (Port: 8084)
- **Purpose**: AI-powered activity recommendations
- **Database**: MongoDB (fitness_activities)
- **Technology**: Spring Boot + Spring Data MongoDB + Event-Driven
- **Features**:
  - Activity pattern analysis
  - Personalized workout recommendations
  - Machine learning-based suggestions
  - Event-driven architecture
  - Activity history analysis
- **Endpoints**:
  - `GET /api/recommendations/{userId}` - Get AI recommendations

### 💻 Frontend Application (Port: 5173)
- **Purpose**: User-facing web application
- **Technology**: React 19 + Vite 7 + Tailwind CSS
- **Features**:
  - Modern, responsive UI with dark/light themes
  - OAuth2 PKCE authentication flow
  - Real-time activity tracking
  - Interactive dashboards
  - Admin portal
  - Profile management
- **Pages**:
  - Home - Landing page
  - Dashboard - User statistics and activity overview
  - Activities - Activity list with CRUD operations
  - Recommendations - AI-powered suggestions
  - Profile - User profile management
  - Admin Dashboard - System statistics (Admin only)
  - Admin Users - User management (Admin only)

## �️ Technology Stack

### Backend Technologies
| Technology | Version | Purpose |
|-----------|---------|---------|
| Java | 17+ | Programming Language |
| Spring Boot | 3.2+ | Application Framework |
| Spring Cloud | 2023.0+ | Microservices Framework |
| Spring Security | 6.2+ | Security & OAuth2 |
| Spring Data JPA | 3.2+ | Database ORM |
| Spring Data MongoDB | 4.2+ | MongoDB Integration |
| MySQL | 8.0+ | Relational Database |
| MongoDB | 7.0+ | NoSQL Database |
| Maven | 3.8+ | Build Tool |
| Lombok | 1.18+ | Code Generation |
| Keycloak | 23+ | Identity & Access Management |

### Frontend Technologies
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19 | UI Framework |
| Vite | 7 | Build Tool & Dev Server |
| Tailwind CSS | 3.4+ | Styling Framework |
| React Router | 6.23+ | Navigation |
| Axios | 1.6+ | HTTP Client |
| Lucide React | 0.344+ | Icon Library |

### Infrastructure & DevOps
| Technology | Version | Purpose |
|-----------|---------|---------|
| Docker | Latest | Containerization |
| Docker Compose | Latest | Multi-container Management |
| Git | Latest | Version Control |

## 📊 Database Design

### MySQL - User Database (fitness_users_db)

```sql
CREATE DATABASE fitness_users_db;

CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('USER', 'ADMIN') DEFAULT 'USER',
    keycloak_id VARCHAR(255) UNIQUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_keycloak_id (keycloak_id)
);
```

### MongoDB - Activity Database (fitness_activities)

```javascript
// Collection: activities
{
    "_id": ObjectId,
    "userId": String,           // Reference to User ID
    "type": String,             // "running", "cycling", "swimming", etc.
    "duration": Number,         // Duration in minutes
    "caloriesBurned": Number,   // Calories burned
    "startTime": ISODate,       // Activity start time
    "additionalMetrics": {      // Additional activity-specific data
        "distance": Number,
        "avgHeartRate": Number,
        "maxHeartRate": Number,
        "pace": Number
    },
    "createdAt": ISODate,
    "updatedAt": ISODate
}

// Indexes
db.activities.createIndex({ "userId": 1 })
db.activities.createIndex({ "startTime": -1 })
db.activities.createIndex({ "type": 1 })
```

## 🔐 Security Architecture

### OAuth2 / OpenID Connect Flow
1. **Frontend** → User clicks login
2. **Keycloak** → Redirects to login page
3. **User** → Enters credentials
4. **Keycloak** → Returns JWT token
5. **Frontend** → Stores token, includes in API requests
6. **Gateway** → Validates JWT signature
7. **Services** → Extract user info from JWT

### Security Features
- ✅ JWT-based authentication
- ✅ OAuth2 Resource Server configuration
- ✅ PKCE flow for public clients
- ✅ Role-based access control (RBAC)
- ✅ BCrypt password encryption
- ✅ CORS protection
- ✅ CSRF protection
- ✅ Stateless authentication

### User Roles
- **USER**: Access to personal activities, dashboard, profile
- **ADMIN**: Full access including user management and system statistics

## 📡 API Reference

### User Service Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/users/register` | Register new user | Public |
| GET | `/api/users/{id}` | Get user profile | USER |
| PUT | `/api/users/{id}` | Update user profile | USER |
| GET | `/api/users/{id}/validate` | Validate user | USER |

### Activity Service Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/activities` | Get user activities | USER |
| POST | `/api/activities` | Create new activity | USER |
| GET | `/api/activities/{id}` | Get activity by ID | USER |
| PUT | `/api/activities/{id}` | Update activity | USER |
| DELETE | `/api/activities/{id}` | Delete activity | USER |
| GET | `/api/activities/stats` | Get user statistics | USER |

### Admin Service Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/admin/dashboard/stats` | Get dashboard stats | ADMIN |
| GET | `/api/admin/users` | List all users | ADMIN |
| GET | `/api/admin/users/{id}` | Get user by ID | ADMIN |
| PUT | `/api/admin/users/{id}/role` | Update user role | ADMIN |
| DELETE | `/api/admin/users/{id}` | Delete user | ADMIN |

### AI Service Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/recommendations/{userId}` | Get AI recommendations | USER |

## 🎨 Frontend Design System

### Color Palette
```css
Primary: Sky Blue (#38bdf8 / sky-400)
Secondary: Emerald Green (#10b981 / emerald-500)
Accent: Orange (#f97316 / orange-500)
Background Light: White (#ffffff)
Background Dark: Slate (#0f172a / slate-900)
```

### Design Features
- 🎨 Light/Dark theme toggle
- 📱 Fully responsive design
- ✨ Glass morphism effects
- 🎭 Smooth animations and transitions
- 🖼️ Modern card-based layouts
- 🎯 Intuitive navigation with sidebar
- 📊 Interactive charts and statistics
- 🔔 Toast notifications

### UI Components
- Navbar with theme toggle
- Responsive sidebar navigation
- Activity cards with action buttons
- Statistics dashboard widgets
- Form components with validation
- Modal dialogs
- Loading states and skeletons
- Error boundaries

## 🛠️ Development Guide

### Project Setup
```bash
# Clone repository
git clone https://github.com/ani8727/FitTrack-Full_stack_fitness_app.git
cd fitness_app

# Install dependencies for all services
mvn clean install -DskipTests

# Install frontend dependencies
cd fitness-app-frontend
npm install
```

### Build Commands

#### Backend Services
```bash
# Build all services
mvn clean package -DskipTests

# Build specific service
cd userservice
mvn clean package -DskipTests

# Run tests
mvn test

# Clean build artifacts
mvn clean
```

#### Frontend
```bash
cd fitness-app-frontend

# Development mode
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Environment Configuration

#### Backend (application.yml)
```yaml
server:
  port: ${PORT}

spring:
  application:
    name: ${SERVICE_NAME}
  config:
    import: optional:configserver:http://localhost:8888
  
eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:8085
VITE_KEYCLOAK_URL=http://localhost:8181
VITE_KEYCLOAK_REALM=fitness-realm
VITE_KEYCLOAK_CLIENT_ID=fitness-app
```

## � Docker Configuration

### Docker Compose Services
```yaml
services:
  mysql:
    image: mysql:8.0
    ports:
      - "3307:3306"
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: fitness_users_db
      MYSQL_USER: fitnessuser
      MYSQL_PASSWORD: fitness123

  mongodb:
    image: mongo:7.0
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: admin123
      MONGO_INITDB_DATABASE: fitness_activities
```

### Docker Commands
```bash
# Start all containers
docker-compose up -d

# Stop all containers
docker-compose down

# View logs
docker-compose logs -f

# Restart containers
docker-compose restart

# Check container status
docker ps
```

## 🔍 Service Discovery & Load Balancing

### Eureka Dashboard
Access the Eureka dashboard to monitor all registered services:
- URL: http://localhost:8761
- View service health status
- Check instance count
- Monitor registration/deregistration

### Registered Services
- **API-GATEWAY** (8085)
- **USER-SERVICE** (8081)
- **ACTIVITY-SERVICE** (8082)
- **ADMINSERVICE** (8083)
- **AI-SERVICE** (8084)

## 🌐 API Gateway Routes

| Route | Target Service | Port |
|-------|---------------|------|
| `/api/users/**` | USER-SERVICE | 8081 |
| `/api/activities/**` | ACTIVITY-SERVICE | 8082 |
| `/api/admin/**` | ADMINSERVICE | 8083 |
| `/api/recommendations/**` | AI-SERVICE | 8084 |

## 📈 Features Overview

### User Features
- ✅ User registration and authentication
- ✅ Profile management
- ✅ Activity tracking (create, read, update, delete)
- ✅ Activity statistics and analytics
- ✅ AI-powered workout recommendations
- ✅ Dark/Light theme toggle
- ✅ Responsive design for all devices

### Admin Features
- ✅ User management dashboard
- ✅ System statistics overview
- ✅ User role management
- ✅ User account activation/deactivation
- ✅ Complete user CRUD operations

### Technical Features
- ✅ Microservices architecture
- ✅ Service discovery with Eureka
- ✅ Centralized configuration
- ✅ API Gateway with load balancing
- ✅ OAuth2/OIDC authentication
- ✅ JWT token-based security
- ✅ Event-driven architecture
- ✅ RESTful API design
- ✅ MySQL for relational data
- ✅ MongoDB for document data

## 🐛 Troubleshooting Guide

### Common Issues

#### Service Won't Start
**Problem**: Service fails to start or throws port binding error
**Solutions**:
```bash
# Check if port is already in use
netstat -ano | findstr :8081

# Kill process using the port (Windows)
taskkill /PID <process_id> /F

# Verify all prerequisites are running
# 1. Config Server should be running first
# 2. Eureka Server should be running second
# 3. Then start other services
```

#### Database Connection Failed
**Problem**: Cannot connect to MySQL or MongoDB
**Solutions**:
```bash
# Check if Docker containers are running
docker ps

# Restart Docker containers
docker-compose restart

# Check database credentials in application.yml
# MySQL: port 3307, user: fitnessuser, password: fitness123
# MongoDB: port 27017, user: admin, password: admin123

# Test MySQL connection
mysql -h localhost -P 3307 -u fitnessuser -p

# Test MongoDB connection
mongosh --port 27017 -u admin -p admin123
```

#### Frontend Can't Connect to Backend
**Problem**: API calls failing from frontend
**Solutions**:
```bash
# Verify Gateway is running
curl http://localhost:8085/actuator/health

# Check Eureka dashboard
http://localhost:8761

# Verify CORS configuration in Gateway
# Allow origin: http://localhost:5173

# Check browser console for CORS errors
# Check Network tab for failed requests
```

#### OAuth2 Authentication Issues
**Problem**: Cannot login or JWT validation fails
**Solutions**:
- Verify Keycloak is running on port 8181
- Check realm name matches in configuration
- Verify client ID and secret
- Check JWT token expiration time
- Clear browser cookies and local storage
- Verify security configuration in Gateway

#### Service Not Registering with Eureka
**Problem**: Service doesn't appear in Eureka dashboard
**Solutions**:
```yaml
# Check eureka configuration
eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/
    register-with-eureka: true
    fetch-registry: true
  instance:
    prefer-ip-address: true
```

#### Build Failures
**Problem**: Maven build fails
**Solutions**:
```bash
# Clean and rebuild
mvn clean install -DskipTests

# Update dependencies
mvn dependency:purge-local-repository

# Check Java version
java -version  # Should be 17+

# Check Maven version
mvn -version  # Should be 3.8+
```

## 📚 Additional Resources

### Documentation Files
All detailed documentation is available in the project root:
- Complete setup and configuration guides
- API documentation and examples
- User guides and tutorials
- Keycloak integration guide
- Development best practices

### Useful Links
- **Spring Boot**: https://spring.io/projects/spring-boot
- **Spring Cloud**: https://spring.io/projects/spring-cloud
- **React**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com
- **Keycloak**: https://www.keycloak.org
- **Docker**: https://www.docker.com

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
```bash
git clone https://github.com/ani8727/FitTrack-Full_stack_fitness_app.git
```

2. **Create a feature branch**
```bash
git checkout -b feature/your-feature-name
```

3. **Make your changes**
- Follow code style guidelines
- Add tests for new features
- Update documentation

4. **Commit your changes**
```bash
git commit -m "Add: your feature description"
```

5. **Push to your branch**
```bash
git push origin feature/your-feature-name
```

6. **Create a Pull Request**
- Provide clear description of changes
- Reference any related issues
- Wait for code review

### Code Style Guidelines
- Use meaningful variable and method names
- Follow Java naming conventions
- Add comments for complex logic
- Write unit tests for new features
- Keep methods small and focused
- Follow SOLID principles

## 📝 Project Status

### Current Version: 1.0.0

### Completed Features
- ✅ Microservices architecture implementation
- ✅ User authentication and authorization
- ✅ Activity tracking system
- ✅ Admin dashboard
- ✅ AI recommendations service
- ✅ Responsive frontend design
- ✅ OAuth2 integration
- ✅ Docker containerization

### Planned Features
- 🔄 Real-time notifications
- 🔄 Social features (friend connections, activity sharing)
- 🔄 Advanced analytics and reporting
- 🔄 Mobile app (React Native)
- 🔄 Kubernetes deployment
- 🔄 CI/CD pipeline
- 🔄 Performance monitoring
- 🔄 Automated testing suite

## 📄 License

This project is private and intended for educational and portfolio purposes.

## 👤 Author & Contact

**Aniket**
- 🌐 LinkedIn: [linkedin.com/in/aniket8727](http://www.linkedin.com/in/aniket8727)
- 📧 Email: Contact through LinkedIn
- 💼 GitHub: [github.com/ani8727](https://github.com/ani8727)

## 🙏 Acknowledgments

- Spring Boot and Spring Cloud communities
- React and Vite communities
- All open-source contributors
- Various online tutorials and documentation

---

<div align="center">

### ⭐ If you find this project helpful, please give it a star! ⭐

**Made with ❤️ by Aniket**

**Tech Stack**: Java 17 • Spring Boot 3.2 • Spring Cloud • React 19 • Vite 7 • Tailwind CSS • MySQL • MongoDB • OAuth2 • Docker

</div>
