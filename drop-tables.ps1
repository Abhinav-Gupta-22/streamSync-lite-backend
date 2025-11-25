# PowerShell script to drop all tables via psql
# Make sure you have psql installed or use Supabase dashboard instead

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "🗑️  DROP ALL TABLES FROM POSTGRESQL" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  WARNING: This will delete ALL data in your database!" -ForegroundColor Red
Write-Host ""

$confirm = Read-Host "Type 'yes' to continue"
if ($confirm -ne 'yes') {
    Write-Host "Cancelled." -ForegroundColor Yellow
    exit
}

Write-Host ""
Write-Host "💡 EASIER METHOD: Use Supabase Dashboard" -ForegroundColor Yellow
Write-Host "   1. Go to https://supabase.com/dashboard" -ForegroundColor White
Write-Host "   2. Select your project" -ForegroundColor White
Write-Host "   3. Click 'SQL Editor'" -ForegroundColor White
Write-Host "   4. Paste the SQL from fix-postgres-schema.sql" -ForegroundColor White
Write-Host "   5. Click 'Run'" -ForegroundColor White
Write-Host ""

Write-Host "Or if you have psql installed, you can run:" -ForegroundColor Yellow
Write-Host 'psql "postgresql://postgres:PASSWORD@HOST:5432/postgres?sslmode=require" -f fix-postgres-schema.sql' -ForegroundColor Gray
Write-Host ""

