# check-services.ps1
# Diagnostic script to check service health

Write-Host "`n=== FITTRACK SERVICE DIAGNOSTICS ===" -ForegroundColor Cyan

# Check Java
Write-Host "`n1. Java Installation:" -ForegroundColor Yellow
try {
    $javaVersion = java -version 2>&1 | Select-Object -First 1
    Write-Host "  ✓ $javaVersion" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Java not found in PATH" -ForegroundColor Red
}

# Check running Java processes
Write-Host "`n2. Java Processes:" -ForegroundColor Yellow
$javaProcs = Get-Process java -ErrorAction SilentlyContinue
if ($javaProcs) {
    Write-Host "  Running: $($javaProcs.Count) Java process(es)" -ForegroundColor Green
} else {
    Write-Host "  ✗ No Java processes running" -ForegroundColor Red
}

# Check ports
Write-Host "`n3. Service Ports:" -ForegroundColor Yellow
$ports = @{
    8761 = 'Eureka'
    8888 = 'ConfigServer'
    8080 = 'Gateway'
    8081 = 'ActivityService'
    8082 = 'UserService'
    8083 = 'AIService'
    5173 = 'Frontend'
}

foreach ($port in $ports.Keys | Sort-Object) {
    $listening = netstat -ano | findstr ":$port.*LISTENING"
    if ($listening) {
        Write-Host "  ✓ Port $port ($($ports[$port])): LISTENING" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Port $port ($($ports[$port])): NOT LISTENING" -ForegroundColor Red
    }
}

# Check MongoDB
Write-Host "`n4. MongoDB Connection:" -ForegroundColor Yellow
$mongoPort = netstat -ano | findstr ":27017.*LISTENING"
if ($mongoPort) {
    Write-Host "  ✓ MongoDB port 27017: LISTENING" -ForegroundColor Green
} else {
    Write-Host "  ✗ MongoDB port 27017: NOT LISTENING" -ForegroundColor Yellow
    Write-Host "    ActivityService needs MongoDB to run" -ForegroundColor White
}

# Test Eureka
Write-Host "`n5. Eureka Server:" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri http://localhost:8761 -UseBasicParsing -TimeoutSec 3
    Write-Host "  ✓ Eureka responding (Status: $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Eureka not responding" -ForegroundColor Red
}

# Test Gateway
Write-Host "`n6. Gateway:" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri http://localhost:8080 -UseBasicParsing -TimeoutSec 3
    Write-Host "  ✓ Gateway responding (Status: $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Gateway not responding" -ForegroundColor Red
}

Write-Host "`n=== RECOMMENDATIONS ===" -ForegroundColor Cyan
Write-Host "• Check PowerShell windows for service startup errors"
Write-Host "• Ensure JDK 21 is installed and in PATH"
Write-Host "• Install/start MongoDB if using ActivityService"
Write-Host "• Wait 2-3 minutes on first run (Maven downloads dependencies)"
Write-Host ""
