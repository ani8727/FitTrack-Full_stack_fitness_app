# check-prerequisites.ps1
# Validates prerequisites before starting FitTrack services

Write-Host "`n=== FitTrack Prerequisites Check ===" -ForegroundColor Cyan -BackgroundColor Black
Write-Host ""

$allGood = $true

# Check Java version
Write-Host "1. Checking Java..." -ForegroundColor Yellow
try {
    $javaVersionOutput = java -version 2>&1
    $javaVersionLine = $javaVersionOutput | Select-Object -First 1
    if ($javaVersionLine -match 'version "(\d+)') {
        $javaVersion = [int]$matches[1]
        if ($javaVersion -ge 21) {
            Write-Host "   ✓ Java $javaVersion detected" -ForegroundColor Green
        } else {
            Write-Host "   ✗ Java $javaVersion found, but Java 21+ required" -ForegroundColor Red
            Write-Host "     Update JAVA_HOME to JDK 21: C:\Program Files\Java\jdk-21" -ForegroundColor White
            $allGood = $false
        }
    }
} catch {
    Write-Host "   ✗ Java not found in PATH" -ForegroundColor Red
    Write-Host "     Install JDK 21 from: https://www.oracle.com/java/technologies/downloads/#java21" -ForegroundColor White
    $allGood = $false
}

# Check Node.js
Write-Host "`n2. Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "   ✓ Node.js $nodeVersion detected" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Node.js not found" -ForegroundColor Red
    Write-Host "     Install from: https://nodejs.org/" -ForegroundColor White
    $allGood = $false
}

# Check npm
Write-Host "`n3. Checking npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "   ✓ npm $npmVersion detected" -ForegroundColor Green
} catch {
    Write-Host "   ✗ npm not found" -ForegroundColor Red
    $allGood = $false
}

# Check MongoDB (optional but recommended)
Write-Host "`n4. Checking MongoDB..." -ForegroundColor Yellow
$mongoRunning = netstat -ano | findstr ":27017.*LISTENING"
if ($mongoRunning) {
    Write-Host "   ✓ MongoDB running on port 27017" -ForegroundColor Green
} else {
    Write-Host "   ⚠ MongoDB not running (port 27017)" -ForegroundColor Yellow
    Write-Host "     ActivityService requires MongoDB" -ForegroundColor White
    Write-Host "     Install: https://www.mongodb.com/try/download/community" -ForegroundColor White
}

# Check port availability
Write-Host "`n5. Checking port availability..." -ForegroundColor Yellow
$requiredPorts = @(8761, 8888, 8080, 8081, 8082, 8083, 5173)
$portsInUse = @()
foreach ($port in $requiredPorts) {
    $inUse = netstat -ano | findstr ":$port.*LISTENING"
    if ($inUse) {
        $portsInUse += $port
    }
}
if ($portsInUse.Count -eq 0) {
    Write-Host "   ✓ All required ports available" -ForegroundColor Green
} else {
    Write-Host "   ⚠ Ports already in use: $($portsInUse -join ', ')" -ForegroundColor Yellow
    Write-Host "     Services may already be running or ports are occupied" -ForegroundColor White
}

# Check if services are already running
Write-Host "`n6. Checking existing services..." -ForegroundColor Yellow
$javaProcs = (Get-Process java -ErrorAction SilentlyContinue | Measure-Object).Count
if ($javaProcs -gt 0) {
    Write-Host "   ⚠ $javaProcs Java process(es) already running" -ForegroundColor Yellow
    Write-Host "     You may need to stop existing services first" -ForegroundColor White
} else {
    Write-Host "   ✓ No existing Java processes" -ForegroundColor Green
}

# Summary
Write-Host "`n=== Summary ===" -ForegroundColor Cyan
if ($allGood) {
    Write-Host "✓ All critical prerequisites met!" -ForegroundColor Green
    Write-Host "`nYou can now run: .\run-all.ps1" -ForegroundColor White
    return 0
} else {
    Write-Host "✗ Some prerequisites are missing" -ForegroundColor Red
    Write-Host "`nFix the issues above before running services" -ForegroundColor White
    return 1
}
