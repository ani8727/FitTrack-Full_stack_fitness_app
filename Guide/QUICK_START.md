# ✅ SETUP COMPLETE - Quick Reference

## 🎯 What You Need to Do Now

### 1. Create RabbitMQ Queue (5 minutes)
Go to: **http://localhost:15672** (guest/guest)

**Create Exchange:**
- Tab: "Exchanges" → "Add a new exchange"
- Name: `activity.exchange`
- Type: **direct**
- Durability: **Durable**

**Create Queue:**
- Tab: "Queues" → "Add a new queue"
- Name: `activity.queue`
- Durability: **Durable**

**Create Binding:**
- Click `activity.queue`
- From exchange: `activity.exchange`
- Routing key: `activity.tracking`
- Click "Bind"

---

### 2. Setup Keycloak (10 minutes)
Go to: **http://localhost:8181** (admin/admin)

**See full guide:** [KEYCLOAK_SETUP.md](KEYCLOAK_SETUP.md)

**Quick Steps:**
1. Create Realm: `fitness-oauth2`
2. Create Client: `fitness-client` (PKCE enabled)
3. Create User: `testuser` / `password123`

---

### 3. Restart User Service (MySQL now on Docker port 3307)

Find and stop current User Service:
```cmd
netstat -ano | findstr :8081
taskkill /F /PID <PID>
```

Start it again:
```cmd
cd userservice
mvnw.cmd spring-boot:run
```

---

## 📋 Current Status

### ✅ Running Services:
- Eureka Server: http://localhost:8761
- Config Server: http://localhost:8888
- User Service: http://localhost:8081 (needs restart for MySQL)
- Activity Service: http://localhost:8082
- AI Service: Ready to start after RabbitMQ queue created
- Gateway: http://localhost:8085

### ✅ Docker Services:
- MySQL: localhost:3307 (NEW!)
  - Database: `fitness_users_db`
  - User: `fitnessuser`
  - Password: `fitness123`
- MongoDB: localhost:27017
- RabbitMQ: localhost:5672, http://localhost:15672
- Keycloak: http://localhost:8181
- Redis: localhost:6379

---

## 🚀 Start AI Service (After Queue Created)

```cmd
restart-ai-service.bat
```

---

## 🎨 Start Frontend

```cmd
cd fitness-app-frontend
npm run dev
```

Open: http://localhost:5173

---

## 📚 Documentation Files

1. **COMPLETE_STARTUP_GUIDE.md** - Full startup procedure
2. **KEYCLOAK_SETUP.md** - Detailed Keycloak configuration
3. **This file** - Quick reference

---

## 🔧 Useful Scripts

| Script | Purpose |
|--------|---------|
| `restart-rabbitmq-services.bat` | Restart Activity + AI Services |
| `restart-ai-service.bat` | Restart only AI Service |
| `start-services-manual.bat` | Start all Spring Boot services |
| `stop-all.ps1` | Stop all services |
| `check-prerequisites.ps1` | Verify environment |

---

## 🧪 Testing Checklist

After completing setup:

- [ ] RabbitMQ queue created (`activity.queue`)
- [ ] Keycloak realm created (`fitness-oauth2`)
- [ ] Keycloak client created (`fitness-client`)
- [ ] Test user created (`testuser` / `password123`)
- [ ] User Service restarted (using Docker MySQL)
- [ ] AI Service started successfully
- [ ] Frontend running on port 5173
- [ ] Login with Keycloak works
- [ ] Activity tracking works
- [ ] AI recommendations work

---

## 🆘 Quick Troubleshooting

**AI Service won't start:**
→ Create RabbitMQ queue first (Step 1 above)

**User Service database errors:**
→ Restart User Service to use new Docker MySQL (Step 3 above)

**Keycloak login fails:**
→ Check realm name is `fitness-oauth2` and client ID is `fitness-client`

**Can't access services:**
→ Check Eureka dashboard: http://localhost:8761

---

## 📞 Service URLs Cheat Sheet

```
Frontend:    http://localhost:5173
Gateway:     http://localhost:8085
Eureka:      http://localhost:8761
Keycloak:    http://localhost:8181 (admin/admin)
RabbitMQ:    http://localhost:15672 (guest/guest)
MySQL:       localhost:3307 (fitnessuser/fitness123)
```

---

## ⏭️ Next: Complete Steps 1, 2, 3 Above!

Then test your application 🎉
