@echo off
echo Starting FitTrack Microservices...
echo.

echo [1/8] Starting ConfigServer (8888)...
cd "%~dp0configserver"
start "ConfigServer" cmd /k "mvn spring-boot:run"
timeout /t 15 /nobreak >nul

echo [2/8] Starting Eureka Server (8761)...
cd "%~dp0eureka"
start "Eureka" cmd /k "mvn spring-boot:run"
timeout /t 20 /nobreak >nul

echo [3/8] Starting API Gateway (8085)...
cd "%~dp0gateway"
start "Gateway" cmd /k "mvn spring-boot:run"
timeout /t 20 /nobreak >nul

echo [4/8] Starting User Service (8081)...
cd "%~dp0userservice"
start "UserService" cmd /k "mvn spring-boot:run"

echo [5/8] Starting Activity Service (8082)...
cd "%~dp0activityservice"
start "ActivityService" cmd /k "mvn spring-boot:run"

echo [6/8] Starting Admin Service (8083)...
cd "%~dp0adminservice"
start "AdminService" cmd /k "mvn spring-boot:run"

echo [7/8] Starting AI Service (8084)...
cd "%~dp0aiservice"
start "AIService" cmd /k "mvn spring-boot:run"

timeout /t 5 /nobreak >nul

echo [8/8] Starting Frontend (5173)...
cd "%~dp0fitness-app-frontend"
start "Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo All services are starting!
echo ========================================
echo.
echo Services:
echo   ConfigServer:     http://localhost:8888
echo   Eureka:           http://localhost:8761
echo   Gateway:          http://localhost:8085
echo   User Service:     http://localhost:8081
echo   Activity Service: http://localhost:8082
echo   Admin Service:    http://localhost:8083
echo   AI Service:       http://localhost:8084
echo   Frontend:         http://localhost:5173
echo.
echo Wait 30-60 seconds for all services to be ready.
echo.
pause
