Write-Host "🚀 Ejecutando Yarvan sin Docker..." -ForegroundColor Green

# Configurar variables para desarrollo local
$env:NODE_ENV = "development"
$env:JWT_SECRET = "yarvan-test-secret"
$env:DB_HOST = "localhost"
$env:DB_PORT = "5432"
$env:DB_USER = "postgres"
$env:DB_PASS = "postgres"
$env:DB_NAME = "yarvan"

Write-Host "📦 Instalando dependencias..." -ForegroundColor Yellow

# Instalar dependencias en paralelo
$services = @("auth", "users", "drivers", "trips", "dispatch", "geofence", "wallet", "compliance", "demand-engine", "notifications", "api-gateway")

foreach ($service in $services) {
    if (Test-Path "services\$service\package.json") {
        Write-Host "Instalando $service..." -ForegroundColor Cyan
        Set-Location "services\$service"
        npm install --silent
        Set-Location "..\..\"
    }
}

Write-Host "✅ Dependencias instaladas" -ForegroundColor Green
Write-Host "🔧 Para ejecutar servicios individualmente:" -ForegroundColor Yellow
Write-Host "   cd services\auth && npm start" -ForegroundColor Cyan
Write-Host "   cd services\users && npm start" -ForegroundColor Cyan
Write-Host "   cd services\api-gateway && npm start" -ForegroundColor Cyan