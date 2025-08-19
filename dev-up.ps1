Write-Host "🚀 Levantando entorno de desarrollo..." -ForegroundColor Green

# Levantar servicios
docker-compose -f infra\docker\docker-compose.yml up -d

Write-Host "✅ Servicios disponibles en:" -ForegroundColor Green
Write-Host "   - API Gateway: http://localhost:3000" -ForegroundColor Cyan
Write-Host "   - Admin Panel: http://localhost:3001" -ForegroundColor Cyan
Write-Host "   - PostgreSQL: localhost:5432" -ForegroundColor Cyan
Write-Host "   - Redis: localhost:6379" -ForegroundColor Cyan
Write-Host "   - RabbitMQ: http://localhost:15672" -ForegroundColor Cyan

Write-Host "⏳ Esperando 30 segundos para que los servicios inicien..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

Write-Host "🏥 Verificando salud de servicios..." -ForegroundColor Green
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/health" -UseBasicParsing
    Write-Host "✅ API Gateway: OK" -ForegroundColor Green
} catch {
    Write-Host "❌ API Gateway: No responde" -ForegroundColor Red
}