# run-all.ps1
# Starts the local FitTrack stack on Windows using Maven wrapper and npm
# Usage: .\run-all.ps1

$root = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $root

$services = @(
    @{ name = 'configserver'; cmd = './mvnw.cmd spring-boot:run' }
    @{ name = 'eureka'; cmd = './mvnw.cmd spring-boot:run' }
    @{ name = 'userservice'; cmd = './mvnw.cmd spring-boot:run' }
    @{ name = 'activityservice'; cmd = './mvnw.cmd spring-boot:run' }
    @{ name = 'aiservice'; cmd = './mvnw.cmd spring-boot:run' }
    @{ name = 'gateway'; cmd = './mvnw.cmd spring-boot:run' }
)

Write-Host "Starting FitTrack services from $root" -ForegroundColor Cyan

foreach ($svc in $services) {
    $svcPath = Join-Path $root $svc.name
    if (Test-Path $svcPath) {
        Write-Host "Starting $($svc.name) in new window..." -ForegroundColor Green
        Start-Process -FilePath powershell -ArgumentList '-NoExit','-Command',"cd '$svcPath'; $($svc.cmd)" -WorkingDirectory $svcPath
        Start-Sleep -Seconds 2
    } else {
        Write-Host "Skipping $($svc.name) - folder not found: $svcPath" -ForegroundColor Yellow
    }
}

$frontendPath = Join-Path $root 'fitness-app-frontend'
if (Test-Path $frontendPath) {
    Write-Host "Installing frontend dependencies..." -ForegroundColor Cyan
    Push-Location $frontendPath
    npm install
    Pop-Location
    Write-Host "Starting frontend in new window..." -ForegroundColor Green
    Start-Process -FilePath powershell -ArgumentList '-NoExit','-Command',"cd '$frontendPath'; npm run dev" -WorkingDirectory $frontendPath
} else {
    Write-Host "Skipping frontend - folder not found: $frontendPath" -ForegroundColor Yellow
}

Write-Host "All start commands issued. Check the newly opened windows for logs." -ForegroundColor Cyan
Write-Host "To stop a service, close its PowerShell window or Ctrl+C in that window." -ForegroundColor Cyan
