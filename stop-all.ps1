# stop-all.ps1
# Stops all FitTrack services by closing their PowerShell windows

Write-Host "`nStopping FitTrack services..." -ForegroundColor Yellow

# Find and stop Java processes (backend services)
$javaProcs = Get-Process java -ErrorAction SilentlyContinue
if ($javaProcs) {
    Write-Host "Stopping $($javaProcs.Count) Java service(s)..." -ForegroundColor Cyan
    $javaProcs | Stop-Process -Force
    Write-Host "  ✓ Backend services stopped" -ForegroundColor Green
} else {
    Write-Host "  No Java services running" -ForegroundColor Gray
}

# Find and stop Node processes (frontend)
$nodeProcs = Get-Process node -ErrorAction SilentlyContinue
if ($nodeProcs) {
    Write-Host "Stopping Node.js (frontend)..." -ForegroundColor Cyan
    $nodeProcs | Stop-Process -Force
    Write-Host "  ✓ Frontend stopped" -ForegroundColor Green
} else {
    Write-Host "  No frontend running" -ForegroundColor Gray
}

Write-Host "`n✓ All services stopped" -ForegroundColor Green
Write-Host ""
