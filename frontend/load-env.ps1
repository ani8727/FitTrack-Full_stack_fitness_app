# FitTrack Frontend Environment Setup Script
# This script helps set up and validate your frontend environment
# Usage in PowerShell: . .\load-env.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  FitTrack Frontend Environment Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Get script directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$envFile = Join-Path $scriptDir ".env.local"

# Check if .env.local exists
if (-Not (Test-Path $envFile)) {
    Write-Host "ERROR: .env.local not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Create .env.local with the following content:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "VITE_API_BASE_URL=http://localhost:8085/api" -ForegroundColor Gray
    Write-Host "VITE_AUTH0_DOMAIN=dev-5s2csl8rpq2phx88.us.auth0.com" -ForegroundColor Gray
    Write-Host "VITE_AUTH0_CLIENT_ID=qnXHlMOmUhSTiQx0ohzneAvZWtTm8IuS" -ForegroundColor Gray
    Write-Host "VITE_AUTH0_AUDIENCE=fitness_auth" -ForegroundColor Gray
    Write-Host "VITE_AUTH0_REDIRECT_URI=http://localhost:5173" -ForegroundColor Gray
    Write-Host ""
    exit 1
}

Write-Host "Loaded .env.local successfully" -ForegroundColor Green
Write-Host ""
Write-Host "Prerequisites:" -ForegroundColor Yellow
Write-Host "  1. Config Server running on port 8888" -ForegroundColor Gray
Write-Host "  2. Eureka running on port 8761" -ForegroundColor Gray
Write-Host "  3. API Gateway running on port 8085" -ForegroundColor Gray
Write-Host ""
Write-Host "Next: npm run dev" -ForegroundColor Green
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan

