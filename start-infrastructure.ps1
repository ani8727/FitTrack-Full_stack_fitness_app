#!/usr/bin/env pwsh

Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "  Starting Infrastructure Services" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is running
Write-Host "Checking Docker..." -ForegroundColor Yellow
$dockerRunning = docker info 2>&1 | Select-String "Server Version"
if (-not $dockerRunning) {
    Write-Host "❌ Docker is not running!" -ForegroundColor Red
    Write-Host "Please start Docker Desktop and try again." -ForegroundColor Yellow
    exit 1
}
Write-Host "✓ Docker is running" -ForegroundColor Green
Write-Host ""

# Start infrastructure services
Write-Host "Starting infrastructure services..." -ForegroundColor Yellow
docker-compose up -d

Write-Host ""
Write-Host "Waiting for services to be healthy..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host ""
Write-Host "=======================================" -ForegroundColor Green
Write-Host "  Infrastructure Services Status" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green
Write-Host ""

# Check container status
docker-compose ps

Write-Host ""
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "  Service URLs" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "MongoDB:        mongodb://localhost:27017" -ForegroundColor White
Write-Host "  Admin:        admin / admin123" -ForegroundColor Gray
Write-Host ""
Write-Host "RabbitMQ:       amqp://localhost:5672" -ForegroundColor White
Write-Host "  Management:   http://localhost:15672" -ForegroundColor White
Write-Host "  Credentials:  guest / guest" -ForegroundColor Gray
Write-Host ""
Write-Host "MySQL:          jdbc:mysql://localhost:3306/fitness_users" -ForegroundColor White
Write-Host "  Credentials:  fitness / fitness123" -ForegroundColor Gray
Write-Host ""
Write-Host "Redis:          redis://localhost:6379" -ForegroundColor White
Write-Host ""
Write-Host "=======================================" -ForegroundColor Green
Write-Host ""
Write-Host "✓ Infrastructure is ready!" -ForegroundColor Green
Write-Host "You can now start your microservices with ./run-all.ps1" -ForegroundColor Yellow
Write-Host ""
