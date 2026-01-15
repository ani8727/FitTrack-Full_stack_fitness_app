# Load Environment Variables for FitTrack Backend Services
# Usage: Run this in each terminal before starting any service
#        . .\load-env.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Loading FitTrack Environment Variables" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$envFile = Join-Path $PSScriptRoot ".env"

if (-Not (Test-Path $envFile)) {
    Write-Host ""
    Write-Host "ERROR: .env file not found at: $envFile" -ForegroundColor Red
    Write-Host "Please make sure .env file exists in the backend folder" -ForegroundColor Yellow
    Write-Host ""
    exit 1
}

# Read and set environment variables
$count = 0
Get-Content $envFile | ForEach-Object {
    # Skip comments and empty lines
    if ($_ -match '^\s*#' -or $_ -match '^\s*$') {
        return
    }
    
    # Parse KEY=VALUE
    if ($_ -match '^([^=]+)=(.*)$') {
        $name = $matches[1].Trim()
        $value = $matches[2].Trim()
        
        # Set environment variable for current process
        [Environment]::SetEnvironmentVariable($name, $value, "Process")
        $count++
    }
}

Write-Host ""
Write-Host "Loaded $count environment variables" -ForegroundColor Green
Write-Host ""
Write-Host "You can now start services:" -ForegroundColor Yellow
Write-Host "  cd configserver  ; .\mvnw spring-boot:run" -ForegroundColor White
Write-Host "  cd eureka        ; .\mvnw spring-boot:run" -ForegroundColor White
Write-Host "  cd userservice   ; .\mvnw spring-boot:run" -ForegroundColor White
Write-Host "  cd adminservice  ; .\mvnw spring-boot:run" -ForegroundColor White
Write-Host "  cd activityservice ; .\mvnw spring-boot:run" -ForegroundColor White
Write-Host "  cd aiservice     ; .\mvnw spring-boot:run" -ForegroundColor White
Write-Host "  cd gateway       ; .\mvnw spring-boot:run" -ForegroundColor White
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
