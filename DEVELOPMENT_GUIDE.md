# FitTrack — Development Guide

This document describes the technologies used, how to set up a development environment, how to run and test the system locally, and a step‑by‑step developer workflow for making changes.

## 1. Project overview

The repository contains a small microservice ecosystem and a React frontend:

- `configserver` — Spring Cloud Config (centralized configuration)
- `eureka` — Eureka server (service discovery)
- `userservice` — user account/profile microservice
- `activityservice` — activity/workout CRUD microservice
- `aiservice` — analytics / AI insights microservice
- `gateway` — Spring Cloud Gateway (API routing)
- `fitness-app-frontend` — React frontend (Vite)

Each Java service is a Spring Boot application built with Maven. The frontend uses Node.js and Vite.

## 2. Key technologies & tools

- Java 21 (the `activityservice` POM specifies `<java.version>21</java.version>`)
- Spring Boot 3.5.x and Spring Cloud 2025.x
- Spring Cloud Config, Eureka, Spring Cloud Gateway
- Spring Web / WebFlux, Spring Data MongoDB
- Maven (use project wrapper `mvnw` / `mvnw.cmd`)
- Node.js (for the frontend) and `npm` or `pnpm`
- MongoDB (local or hosted) for activity data (check `application.yml` in `activityservice`)
- Recommended IDEs: IntelliJ IDEA (preferred for Spring), VS Code (with Java & Spring extensions)

## 3. Local prerequisites (install these first)

**Critical:** These must be installed and configured correctly:

- **JDK 21** (REQUIRED - match `<java.version>` in POMs)
  - Download: <https://www.oracle.com/java/technologies/downloads/#java21>
  - Verify: `java -version` should show "21.x.x"
  - Set `JAVA_HOME` to JDK 21 path (e.g., `C:\Program Files\Java\jdk-21`)
- Git
- Maven (optional if using the included `mvnw` wrapper)
- Node.js 18+ and `npm` (for the frontend)
- **MongoDB** (REQUIRED for ActivityService)
  - Download: <https://www.mongodb.com/try/download/community>
  - Should run on default port 27017
- (Optional) Docker & Docker Compose for containerized testing

## 4. Getting the repo and opening the project

1. Clone the repo:

   ```powershell
   git clone <repo-url>
   cd fitness_app
   ```

2. Check prerequisites before starting:

   ```powershell
   .\check-prerequisites.ps1
   ```

   This validates Java 21, Node.js, and other requirements.

3. Open the repository folder in your IDE (IntelliJ or VS Code). Let the IDE import the Maven projects and download dependencies.

## 5. Environment and configuration

- Each service has `src/main/resources/application.yml`. This file contains defaults (ports, data sources, Eureka, config server URIs).
- For local runs, set the following environment variables (examples):
  - `SPRING_CLOUD_CONFIG_URI` — if you want services to fetch config from the `configserver` (or ensure `configserver` is running locally)
  - `SPRING_DATA_MONGODB_URI` — MongoDB connection (e.g., `mongodb://localhost:27017/fittrack`)

You can also edit the `application.yml` directly for quick local testing.

## 6. Run order (recommended)

**Quick start (recommended):**

```powershell
.\run-all.ps1
```

This opens each service in a separate PowerShell window for easy monitoring.

**To stop all services:**

```powershell
.\stop-all.ps1
```

**Manual start order** (if you prefer individual control):

Start platform services first, then the backends, then the gateway and frontend.

1. Start `configserver` (if used):

   ```powershell
   cd configserver
   mvnw.cmd spring-boot:run
   ```

2. Start Eureka:

   ```powershell
   cd ../eureka
   mvnw.cmd spring-boot:run
   ```

3. Start backend services (any order after Eureka is running):

   ```powershell
   cd ../userservice
   mvnw.cmd spring-boot:run

   cd ../activityservice
   mvnw.cmd spring-boot:run

   cd ../aiservice
   mvnw.cmd spring-boot:run
   ```

4. Start the gateway:

   ```powershell
   cd ../gateway
   mvnw.cmd spring-boot:run
   ```

5. Start the frontend:

   ```powershell
   cd ../fitness-app-frontend
   npm install
   npm run dev
   ```

Notes:

- The Eureka dashboard is usually at `http://localhost:8761` (check `eureka/src/main/resources/application.yml`).
- If services are not registering, check `eureka.client.service-url.defaultZone` in the services' `application.yml`.

## 7. Build and test

- Build a service (skip tests during quick builds):

```powershell
cd activityservice
mvnw.cmd -DskipTests package
```

- Run unit tests:

```powershell
mvnw.cmd test
```

- Frontend build:

```powershell
cd fitness-app-frontend
npm run build
```

## 8. Common developer tasks — step by step

A. Add a new REST endpoint to `activityservice` (example)

1. Open `activityservice/src/main/java` and locate the controller (likely under `com.fitness`).
2. Add a new method annotated with `@GetMapping`/`@PostMapping`.
3. Update the service and repository layers as needed.
4. Add unit tests under `src/test/java`.
5. Run `mvnw.cmd test` and `mvnw.cmd -DskipTests package`.
6. Start the service and exercise the endpoint via `curl` or the frontend.

B. Update configuration for a service

1. Edit `src/main/resources/application.yml` or set environment variables.
2. If using `configserver`, add/modify the config source and restart the config server.
3. Restart the service to pick up new properties.

C. Debugging locally

- Run the service from your IDE in debug mode (attach debugger to remote port or use the IDE run configuration).
- Inspect logs in console; logs are printed by Spring Boot at startup.
- For routing issues, check gateway routes and Eureka registrations.

D. Frontend changes

1. Modify React files under `fitness-app-frontend/src`.
2. Run `npm run dev` for hot reload.
3. Lint or format as needed (add ESLint or Prettier if desired).

## 9. Commit, branch, and pull request workflow

A suggested Git workflow:

1. Create a branch for your work:

   ```powershell
   git checkout -b feat/<short-description>
   ```

2. Make small, focused commits with clear messages.
3. Run tests locally before pushing:

   ```powershell
   mvnw.cmd test
   npm run build (for frontend changes)
   ```

4. Push and open a pull request. Include description, testing notes, and related issue.

## 10. Helpful commands & examples

- Check service logs in terminal (they print to stdout by default). Use `--debug` for more Spring logs:

```powershell
mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=local
```

- Quick curl example to test activity list (replace port/path if changed):

```powershell
curl http://localhost:8081/api/activities
```

## 11. Troubleshooting

**Services won't start - Java version error:**

```text
UnsupportedClassVersionError: class file version 65.0
```

Solution: You have Java 17 but need Java 21. Update JAVA_HOME:

```powershell
$env:JAVA_HOME = "C:\Program Files\Java\jdk-21"
$env:PATH = "C:\Program Files\Java\jdk-21\bin;" + $env:PATH
```

Make this permanent via Windows Environment Variables.

**ActivityService fails to start:**

- Ensure MongoDB is running on port 27017
- Check connection string in `activityservice/src/main/resources/application.yml`

**Port already in use:**

- Check if services are already running: `.\stop-all.ps1`
- Or manually check: `netstat -ano | findstr "8761 8080 8081"`

**Services not registering with Eureka:**

- Ensure Eureka started first (wait 30-60 seconds)
- Check `eureka.client.service-url.defaultZone` in each service's `application.yml`

## 12. Suggested improvements & next steps

- ✅ `run-all.ps1` - starts all services (included)
- ✅ `stop-all.ps1` - stops all services (included)
- ✅ `check-prerequisites.ps1` - validates environment (included)
- Add a `docker-compose.yml` to run the entire stack locally
- Add health-check endpoints and readiness/liveness probes for containers
- Add CI pipeline to run `mvnw test` and `npm run build` on PRs

## 13. Where to find things in this repo

- Service configs: `*/src/main/resources/application.yml`
- Java code: `*/src/main/java` (controllers, services, repositories)
- Tests: `*/src/test/java`
- Frontend: `fitness-app-frontend/src`, `fitness-app-frontend/package.json`
- Service docs: each service has a `HELP.md` (e.g., `gateway/HELP.md`)

---

## Quick Reference Commands

**Check prerequisites:**

```powershell
.\check-prerequisites.ps1
```

**Start all services:**

```powershell
.\run-all.ps1
```

**Stop all services:**

```powershell
.\stop-all.ps1
```

**Check service status:**

```powershell
netstat -ano | findstr "8761 8080 8081 8082 8083 5173"
```

**View Eureka dashboard:**
<http://localhost:8761/>

**Access frontend:**
<http://localhost:5173/>
