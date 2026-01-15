# FitTrack - Quick Start Guide

## 🚀 How to Start All Services

### For Each Service (Open Separate Terminals):

**Terminal 1 - Config Server:**
```powershell
cd c:\Users\anike\Desktop\Project\fitness_app\backend
. .\load-env.ps1
cd configserver
.\mvnw spring-boot:run
```

**Terminal 2 - Eureka Server:**
```powershell
cd c:\Users\anike\Desktop\Project\fitness_app\backend
. .\load-env.ps1
cd eureka
.\mvnw spring-boot:run
```

**Terminal 3 - User Service:**
```powershell
cd c:\Users\anike\Desktop\Project\fitness_app\backend
. .\load-env.ps1
cd userservice
.\mvnw spring-boot:run
```

**Terminal 4 - Admin Service:**
```powershell
cd c:\Users\anike\Desktop\Project\fitness_app\backend
. .\load-env.ps1
cd adminservice
.\mvnw spring-boot:run
```

**Terminal 5 - Activity Service:**
```powershell
cd c:\Users\anike\Desktop\Project\fitness_app\backend
. .\load-env.ps1
cd activityservice
.\mvnw spring-boot:run
```

**Terminal 6 - AI Service:**
```powershell
cd c:\Users\anike\Desktop\Project\fitness_app\backend
. .\load-env.ps1
cd aiservice
.\mvnw spring-boot:run
```

**Terminal 7 - Gateway:**
```powershell
cd c:\Users\anike\Desktop\Project\fitness_app\backend
. .\load-env.ps1
cd gateway
.\mvnw spring-boot:run
```

---

## 📋 Important Notes:

1. **Always run `. .\load-env.ps1` first** in each new terminal
2. **The dot before the script is required** - it loads variables into the current session
3. **Start Config Server first**, then Eureka, then others
4. **Wait for each service to fully start** before starting the next one

---

## ✅ Verify Variables Are Loaded:

```powershell
# Check if variables are loaded
echo $env:USER_DB_PASSWORD
# Should output: npg_CLRh6Z5OFUGm

echo $env:MONGO_URI
# Should output: mongodb+srv://...
```

---

## 🔧 Service Ports:

- Config Server: 8888
- Eureka: 8761
- User Service: 8081
- Admin Service: 8082
- Activity Service: 8083
- AI Service: 8084
- Gateway: 8085

---

## 🌐 Access Points:

- Eureka Dashboard: http://localhost:8761
- API Gateway: http://localhost:8085
- Config Server: http://localhost:8888/actuator/health
