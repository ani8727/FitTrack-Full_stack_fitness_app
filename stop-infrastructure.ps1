#!/usr/bin/env pwsh

Write-Host "=======================================" -ForegroundColor Yellow
Write-Host "  Stopping Infrastructure Services" -ForegroundColor Yellow
Write-Host "=======================================" -ForegroundColor Yellow
Write-Host ""

# Stop and remove containers
Write-Host "Stopping Docker containers..." -ForegroundColor Yellow
docker-compose down

Write-Host ""
Write-Host "✓ Infrastructure stopped!" -ForegroundColor Green
Write-Host ""
Write-Host "Note: Data volumes are preserved." -ForegroundColor Cyan
Write-Host "To remove data volumes as well, run:" -ForegroundColor Cyan
Write-Host "  docker-compose down -v" -ForegroundColor White
Write-Host ""
