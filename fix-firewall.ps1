# Windows Firewall Fix Script for Node.js Backend
# This script helps fix firewall issues preventing Android emulator from connecting

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "🔧 WINDOWS FIREWALL FIX FOR NODE.JS BACKEND" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Check if running as administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "⚠️  This script needs administrator privileges" -ForegroundColor Yellow
    Write-Host "   Right-click PowerShell and select 'Run as Administrator'" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   Or run this command manually:" -ForegroundColor Yellow
    Write-Host "   netsh advfirewall firewall add rule name='Node.js Backend' dir=in action=allow protocol=TCP localport=3000" -ForegroundColor White
    Write-Host ""
    exit
}

Write-Host "1️⃣  Adding firewall rule for Node.js on port 3000..." -ForegroundColor Yellow

# Remove existing rule if it exists
netsh advfirewall firewall delete rule name="Node.js Backend" 2>$null

# Add new rule
netsh advfirewall firewall add rule name="Node.js Backend" dir=in action=allow protocol=TCP localport=3000

if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Firewall rule added successfully!" -ForegroundColor Green
} else {
    Write-Host "   ❌ Failed to add firewall rule" -ForegroundColor Red
    Write-Host "   Try running PowerShell as Administrator" -ForegroundColor Yellow
    exit
}

Write-Host ""
Write-Host "2️⃣  Checking if Node.js is allowed in Windows Firewall..." -ForegroundColor Yellow

# Check if Node.js executable is allowed
$nodePath = Get-Command node -ErrorAction SilentlyContinue
if ($nodePath) {
    $nodeExe = $nodePath.Source
    Write-Host "   Found Node.js at: $nodeExe" -ForegroundColor Gray
    
    # Check if it's already allowed
    $existingRule = netsh advfirewall firewall show rule name=all | Select-String -Pattern "Node.js" -Context 0,5
    
    if ($existingRule) {
        Write-Host "   ✅ Node.js is already configured in firewall" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Node.js might need to be manually added" -ForegroundColor Yellow
        Write-Host "   Go to: Windows Defender Firewall > Allow an app" -ForegroundColor White
        Write-Host "   Find Node.js and check both Private and Public" -ForegroundColor White
    }
} else {
    Write-Host "   ⚠️  Could not find Node.js executable" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "3️⃣  Testing port 3000..." -ForegroundColor Yellow

$portCheck = netstat -ano | findstr :3000
if ($portCheck) {
    Write-Host "   ✅ Port 3000 is in use (backend is running)" -ForegroundColor Green
} else {
    Write-Host "   ❌ Port 3000 is NOT in use (backend is not running)" -ForegroundColor Red
    Write-Host "   Start backend with: cd backend && npm run start:dev" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "✅ FIREWALL RULE ADDED!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "📱 Next steps:" -ForegroundColor Yellow
Write-Host "   1. Make sure backend is running (npm run start:dev)" -ForegroundColor White
Write-Host "   2. Try your Flutter app again" -ForegroundColor White
Write-Host "   3. Check backend console for request logs" -ForegroundColor White
Write-Host ""
Write-Host "💡 If still not working:" -ForegroundColor Yellow
Write-Host "   - Temporarily disable firewall to test:" -ForegroundColor White
Write-Host "     netsh advfirewall set allprofiles state off" -ForegroundColor Gray
Write-Host "   - (Remember to re-enable after testing!)" -ForegroundColor White
Write-Host ""

