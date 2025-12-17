# FitTrack - Fitness Tracking Microservices Application

A cloud-native fitness tracking application built with Spring Boot microservices, React frontend, and OAuth2 authentication.

---

## 🎯 Overview

FitTrack is a complete fitness tracking platform that allows users to:

- Track fitness activities (running, cycling, swimming, etc.)
- View activity history and statistics
- Get AI-powered fitness recommendations
- Manage user profiles with secure authentication

### Architecture

- **Microservices Architecture** - Independent, scalable services
- **Service Discovery** - Eureka for dynamic service registration
- **API Gateway** - Centralized routing and security
- **OAuth2 Authentication** - Keycloak for secure user management
- **Event-Driven** - RabbitMQ for async communication
- **Containerized** - Docker for infrastructure

---

## 📁 Project Structure

```text
fitness_app/
│
├── activityservice/          # Activity CRUD operations
│   ├── src/main/java/com/fitness/activityservice/
│   ├── src/main/resources/
│   ├── pom.xml
│   └── HELP.md              # Service documentation
│
├── aiservice/                # AI recommendations & analytics
│   ├── src/main/java/com/fitness/aiservice/
│   ├── src/main/resources/
│   ├── pom.xml
│   └── HELP.md
│
├── userservice/              # User management
│   ├── src/main/java/com/fitness/userservice/
│   ├── src/main/resources/
│   ├── pom.xml
│   └── HELP.md
│
├── gateway/                  # API Gateway & routing
│   ├── src/main/java/com/fitness/gateway/
│   ├── src/main/resources/
│   ├── pom.xml
│   └── HELP.md
│
├── eureka/                   # Service discovery
│   ├── src/main/java/
│   ├── src/main/resources/
│   ├── pom.xml
│   └── HELP.md
│
├── configserver/             # Centralized configuration
│   ├── src/main/java/
│   ├── src/main/resources/
│   ├── pom.xml
│   └── HELP.md
│
├── fitness-app-frontend/     # React + Vite frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/        # API services
│   │   ├── store/           # Redux store
│   │   └── App.jsx
│   ├── package.json
│   └── README.md
│
├── docker-compose.yml        # Infrastructure services
├── run-all.ps1              # Start all services
├── stop-all.ps1             # Stop all services
├── check-prerequisites.ps1   # System validation
│
└── Documentation/
    ├── USER_GUIDE.md        # Complete user guide
    ├── DEVELOPMENT_GUIDE.md # Developer guide
    ├── README-DOCKER.md     # Docker infrastructure
    └── KEYCLOAK-SETUP.md    # Authentication setup
```

---

## 🔧 Microservices

### Platform Services

| Service | Port | Description |
|---------|------|-------------|
| **Eureka Server** | 8761 | Service discovery and registration |
| **Config Server** | 8888 | Centralized configuration management |
| **API Gateway** | 8080 | Single entry point, routing, security |

### Business Services

| Service | Port | Database | Description |
|---------|------|----------|-------------|
| **User Service** | 8082 | MySQL | User account management |
| **Activity Service** | 8081 | MongoDB | Activity CRUD operations |
| **AI Service** | 8083 | MongoDB | Fitness recommendations |

### Frontend

| Application | Port | Description |
|------------|------|-------------|
| **React Frontend** | 5173 | User interface (Vite dev server) |

### Infrastructure (Docker)

| Service | Port | Access | Credentials |
|---------|------|--------|-------------|
| **MongoDB** | 27017 | localhost:27017 | admin / admin123 |
| **RabbitMQ** | 5672, 15672 | <http://localhost:15672> | guest / guest |
| **MySQL** | 3307 | localhost:3307 | fitness / fitness123 |
| **Redis** | 6379 | localhost:6379 | - |
| **Keycloak** | 8181 | <http://localhost:8181> | admin / admin |

---

## 💻 Technology Stack

### Backend

- **Java 21** - Programming language
- **Spring Boot 3.5.5** - Application framework
- **Spring Cloud 2025.0.0** - Microservices framework
  - Spring Cloud Gateway - API routing
  - Spring Cloud Netflix Eureka - Service discovery
  - Spring Cloud Config - Configuration management
- **Spring Security OAuth2** - Authentication & authorization
- **Maven** - Build tool

### Frontend Technologies

- **React 18** - UI framework
- **Vite 7** - Build tool and dev server
- **Redux Toolkit** - State management
- **Axios** - HTTP client

### Databases

- **MongoDB 7.0** - Activity data storage
- **MySQL 8.0** - User data storage
- **Redis 7.2** - Caching

### Messaging

- **RabbitMQ 3.13** - Event-driven communication

### Security

- **Keycloak 23.0** - OAuth2 / OpenID Connect

### DevOps

- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

---

## 🚀 Quick Start

### Prerequisites

- Java JDK 21+
- Node.js 18+
- Docker Desktop
- Windows PowerShell

### Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd fitness_app
   ```

2. **Start Docker infrastructure**

   ```powershell
   docker-compose up -d
   ```

3. **Configure Keycloak** (one-time setup)

   - Open <http://localhost:8181> (admin/admin)
   - Create realm: `fitness-oauth2`
   - Create client: `oauth2-user1-client`
   - Create user: `testuser` / `test123`
   - See [KEYCLOAK-SETUP.md](KEYCLOAK-SETUP.md) for detailed steps

4. **Start all microservices**

   ```powershell
   .\run-all.ps1
   ```

5. **Access the application**

   - Frontend: <http://localhost:5173>
   - Login: testuser / test123

### Stop Services

```powershell
.\stop-all.ps1
docker-compose down
```

---

## 📚 Documentation

- **[USER_GUIDE.md](USER_GUIDE.md)** - Complete user and setup guide with all tools
- **[DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md)** - Developer guidelines and workflows
- **[KEYCLOAK-SETUP.md](KEYCLOAK-SETUP.md)** - Step-by-step authentication setup
- **[README-DOCKER.md](README-DOCKER.md)** - Docker infrastructure management

### Service Documentation

Each service folder contains a `HELP.md` file with:

- Service purpose and features
- Run/build instructions
- Configuration details
- API endpoints

---

## 🎯 Key Features

### User Features

- ✅ Secure OAuth2 authentication
- ✅ Activity tracking (running, cycling, swimming, etc.)
- ✅ Activity history and statistics
- ✅ AI-powered fitness recommendations
- ✅ User profile management

### Technical Features

- ✅ Microservices architecture
- ✅ Service discovery (Eureka)
- ✅ API Gateway with security
- ✅ Centralized configuration
- ✅ Event-driven communication (RabbitMQ)
- ✅ OAuth2 authentication (Keycloak)
- ✅ Containerized infrastructure (Docker)
- ✅ RESTful APIs
- ✅ Reactive programming (WebFlux)

---

## 🔒 Security

- **OAuth2 / OpenID Connect** - Industry-standard authentication
- **JWT tokens** - Stateless authentication
- **CORS configured** - Secure cross-origin requests
- **Gateway security** - Centralized security enforcement

---

## 🛠️ Development

### Build single service

```powershell
cd <service-name>
.\mvnw.cmd clean package
```

### Run single service

```powershell
cd <service-name>
.\mvnw.cmd spring-boot:run
```

### Run tests

```powershell
.\mvnw.cmd test
```

---

## 📊 Monitoring & Admin

- **Eureka Dashboard**: <http://localhost:8761> - View registered services
- **RabbitMQ Management**: <http://localhost:15672> - Monitor message queues
- **Keycloak Admin**: <http://localhost:8181> - Manage users and authentication

---

## 🐛 Troubleshooting

### Services won't start

```powershell
# Check prerequisites
.\check-prerequisites.ps1

# Verify Java version (must be 21+)
java -version

# Check if ports are available
netstat -ano | findstr "8080 8761 8888"
```

### Docker issues

```powershell
# Check Docker status
docker ps

# Restart infrastructure
docker-compose down
docker-compose up -d
```

### Authentication fails

- Verify Keycloak realm is `fitness-oauth2`
- Check client ID is `oauth2-user1-client`
- Ensure redirect URI includes `http://localhost:5173/*`

**For detailed troubleshooting, see [USER_GUIDE.md](USER_GUIDE.md)**

---

## 📝 Scripts

| Script | Purpose |
|--------|---------|
| `run-all.ps1` | Start all services in separate windows |
| `stop-all.ps1` | Stop all running services |
| `check-prerequisites.ps1` | Validate system requirements |
| `start-infrastructure.ps1` | Start Docker containers |
| `stop-infrastructure.ps1` | Stop Docker containers |

---

## 🤝 Contributing

1. Create a new branch
2. Make your changes
3. Test thoroughly
4. Update documentation
5. Submit a pull request

---

## 📧 Support

For issues or questions:

1. Check the [USER_GUIDE.md](USER_GUIDE.md)
2. Review service `HELP.md` files
3. Check PowerShell windows for error logs
4. Verify infrastructure is running: `docker ps`

---

**For complete setup and usage instructions, see [USER_GUIDE.md](USER_GUIDE.md)**

---

**Version:** 1.0  
**Last Updated:** December 2025
