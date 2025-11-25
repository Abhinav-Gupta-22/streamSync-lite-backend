# Test Backend Connection from Emulator Perspective
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "🔍 TESTING BACKEND CONNECTION" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Test 1: Localhost (should work)
Write-Host "1️⃣  Testing http://localhost:3000/api/health..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/health" -Method GET -TimeoutSec 5 -UseBasicParsing
    Write-Host "   ✅ SUCCESS! Backend is accessible from localhost" -ForegroundColor Green
    Write-Host "   Status: $($response.StatusCode)" -ForegroundColor Gray
} catch {
    Write-Host "   ❌ FAILED! Backend is not accessible from localhost" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "   👉 Backend might not be running. Start it with:" -ForegroundColor Yellow
    Write-Host "      cd backend && npm run start:dev" -ForegroundColor White
    exit
}

Write-Host ""

# Test 2: Check firewall rules
Write-Host "2️⃣  Checking firewall rules for port 3000..." -ForegroundColor Yellow
$firewallRules = netsh advfirewall firewall show rule name=all | Select-String -Pattern "3000" -Context 2,2
if ($firewallRules) {
    Write-Host "   ✅ Found firewall rules for port 3000:" -ForegroundColor Green
    Write-Host $firewallRules -ForegroundColor Gray
} else {
    Write-Host "   ⚠️  No firewall rules found for port 3000" -ForegroundColor Yellow
    Write-Host "   Adding firewall rule..." -ForegroundColor Yellow
    netsh advfirewall firewall add rule name="Node.js Backend" dir=in action=allow protocol=TCP localport=3000
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Firewall rule added!" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Failed to add firewall rule (run as Administrator)" -ForegroundColor Red
    }
}

Write-Host ""

# Test 3: Check if backend is listening on all interfaces
Write-Host "3️⃣  Checking if backend is listening on 0.0.0.0:3000..." -ForegroundColor Yellow
$listening = netstat -ano | findstr ":3000" | findstr "LISTENING"
if ($listening -match "0.0.0.0:3000") {
    Write-Host "   ✅ Backend is listening on 0.0.0.0:3000 (accessible from emulator)" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Backend might not be listening on all interfaces" -ForegroundColor Yellow
    Write-Host "   Make sure backend uses: app.listen(port, '0.0.0.0')" -ForegroundColor White
}

Write-Host ""

# Test 4: Try to simulate emulator connection
Write-Host "4️⃣  Testing connection from emulator perspective..." -ForegroundColor Yellow
Write-Host "   Note: 10.0.2.2 only works from Android emulator, not from this computer" -ForegroundColor Gray
Write-Host "   If Flutter app still can't connect, try:" -ForegroundColor Yellow
Write-Host "   - Restart Android emulator" -ForegroundColor White
Write-Host "   - Check Windows Defender Firewall (not just Windows Firewall)" -ForegroundColor White
Write-Host "   - Temporarily disable antivirus firewall" -ForegroundColor White

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "📋 SUMMARY" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Backend is running and accessible from localhost" -ForegroundColor Green
Write-Host ""
Write-Host "💡 If Flutter app still can't connect:" -ForegroundColor Yellow
Write-Host "   1. Restart Android emulator" -ForegroundColor White
Write-Host "   2. Check Windows Defender Firewall (separate from Windows Firewall)" -ForegroundColor White
Write-Host "   3. Check antivirus firewall (Norton, McAfee, etc.)" -ForegroundColor White
Write-Host "   4. Try using your computer's IP address instead of 10.0.2.2" -ForegroundColor White
Write-Host "      Find IP: ipconfig | findstr IPv4" -ForegroundColor Gray
Write-Host "      Use: http://YOUR_IP:3000/api" -ForegroundColor Gray
Write-Host ""
