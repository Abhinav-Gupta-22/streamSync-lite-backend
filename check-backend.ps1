# Quick Backend Status Check Script
# Run this to verify if your backend is running and accessible

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "🔍 BACKEND STATUS CHECK" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Check if port 3000 is in use
Write-Host "1️⃣  Checking if port 3000 is in use..." -ForegroundColor Yellow
$portCheck = netstat -ano | findstr :3000
if ($portCheck) {
    Write-Host "   ✅ Port 3000 is in use (backend might be running)" -ForegroundColor Green
    Write-Host "   Details: $portCheck" -ForegroundColor Gray
} else {
    Write-Host "   ❌ Port 3000 is NOT in use (backend is NOT running)" -ForegroundColor Red
    Write-Host ""
    Write-Host "   👉 Solution: Start the backend with:" -ForegroundColor Yellow
    Write-Host "      cd backend" -ForegroundColor White
    Write-Host "      npm run start:dev" -ForegroundColor White
    Write-Host ""
    exit
}

Write-Host ""

# Test localhost health endpoint
Write-Host "2️⃣  Testing http://localhost:3000/api/health..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/health" -Method GET -TimeoutSec 5 -UseBasicParsing
    Write-Host "   ✅ SUCCESS! Backend is running and responding" -ForegroundColor Green
    Write-Host "   Status Code: $($response.StatusCode)" -ForegroundColor Gray
    Write-Host "   Response: $($response.Content)" -ForegroundColor Gray
} catch {
    Write-Host "   ❌ FAILED! Backend is NOT responding" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "   👉 Possible issues:" -ForegroundColor Yellow
    Write-Host "      - Backend is starting but not ready yet (wait a few seconds)" -ForegroundColor White
    Write-Host "      - Backend crashed during startup (check console for errors)" -ForegroundColor White
    Write-Host "      - Database connection failed (check .env file)" -ForegroundColor White
    Write-Host ""
    exit
}

Write-Host ""

# Test emulator address (will fail from computer, but that's OK)
Write-Host "3️⃣  Testing http://10.0.2.2:3000/api/health (Android emulator)..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://10.0.2.2:3000/api/health" -Method GET -TimeoutSec 5 -UseBasicParsing
    Write-Host "   ✅ SUCCESS! Backend is accessible from emulator" -ForegroundColor Green
} catch {
    Write-Host "   ⚠️  Note: This will only work from Android emulator, not from this computer" -ForegroundColor Yellow
    Write-Host "   This is normal - the emulator uses 10.0.2.2 to reach your computer" -ForegroundColor Gray
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "✅ BACKEND IS RUNNING CORRECTLY!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "💡 Your Flutter app should be able to connect now." -ForegroundColor Green
Write-Host ""

