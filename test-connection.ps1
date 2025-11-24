# Quick Backend Connection Test Script
Write-Host "Testing backend connection..." -ForegroundColor Cyan

# Test localhost
Write-Host "`n1. Testing http://localhost:3000/api/health" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/health" -Method GET -TimeoutSec 5
    Write-Host "✅ SUCCESS! Backend is running on localhost:3000" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Gray
} catch {
    Write-Host "❌ FAILED! Backend is NOT running or not accessible" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "`n👉 Solution: Start the backend with 'npm run start:dev'" -ForegroundColor Yellow
}

# Test emulator address
Write-Host "`n2. Testing http://10.0.2.2:3000/api/health (Android emulator)" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://10.0.2.2:3000/api/health" -Method GET -TimeoutSec 5
    Write-Host "✅ SUCCESS! Backend is accessible from Android emulator" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Note: This will only work from Android emulator, not from this computer" -ForegroundColor Yellow
}

Write-Host "`n" -NoNewline

