Write-Host "🚀 Iniciando prueba completa de Yarvan..." -ForegroundColor Green

# 1. Verificar servicios
Write-Host "1. Verificando servicios..." -ForegroundColor Yellow
$services = @(
    @{name="Auth"; url="http://localhost:3001/health"},
    @{name="Users"; url="http://localhost:3003/health"},
    @{name="Drivers"; url="http://localhost:3004/health"},
    @{name="API Gateway"; url="http://localhost:3000/health"}
)

foreach ($service in $services) {
    try {
        $response = Invoke-RestMethod -Uri $service.url -UseBasicParsing
        Write-Host "   ✅ $($service.name): OK" -ForegroundColor Green
    } catch {
        Write-Host "   ❌ $($service.name): ERROR" -ForegroundColor Red
    }
}

# 2. Registrar usuarios
Write-Host "2. Registrando usuarios..." -ForegroundColor Yellow
try {
    $passenger = Invoke-RestMethod -Uri "http://localhost:3001/auth/register" -Method POST -Body '{"email":"test.passenger@yarvan.com","password":"password123","role":"passenger"}' -ContentType "application/json"
    Write-Host "   ✅ Pasajero registrado: ID $($passenger.user.id)" -ForegroundColor Green
    
    $driver = Invoke-RestMethod -Uri "http://localhost:3001/auth/register" -Method POST -Body '{"email":"test.driver@yarvan.com","password":"password123","role":"driver"}' -ContentType "application/json"
    Write-Host "   ✅ Conductor registrado: ID $($driver.user.id)" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Error en registro de usuarios" -ForegroundColor Red
}

# 3. Crear perfil de conductor
Write-Host "3. Creando perfil de conductor..." -ForegroundColor Yellow
try {
    $driverProfile = Invoke-RestMethod -Uri "http://localhost:3004/drivers" -Method POST -Body '{"firstName":"Juan","lastName":"Pérez","email":"test.driver@yarvan.com","phone":"+573001234567","licenseNumber":"LIC123456789"}' -ContentType "application/json"
    Write-Host "   ✅ Perfil de conductor creado: ID $($driverProfile.id)" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Error creando perfil de conductor" -ForegroundColor Red
}

# 4. Poner conductor online
Write-Host "4. Activando conductor..." -ForegroundColor Yellow
try {
    $statusUpdate = Invoke-RestMethod -Uri "http://localhost:3004/drivers/$($driverProfile.id)/status" -Method PUT -Body '{"status":"online"}' -ContentType "application/json"
    Write-Host "   ✅ Conductor online: Estado $($statusUpdate.status)" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Error activando conductor" -ForegroundColor Red
}

# 5. Crear usuario en servicio Users
Write-Host "5. Creando perfil de pasajero..." -ForegroundColor Yellow
try {
    $userProfile = Invoke-RestMethod -Uri "http://localhost:3003/users" -Method POST -Body '{"firstName":"María","lastName":"García","email":"test.passenger@yarvan.com","phone":"+573009876543"}' -ContentType "application/json"
    Write-Host "   ✅ Perfil de pasajero creado: ID $($userProfile.id)" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Error creando perfil de pasajero" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 Prueba básica completada!" -ForegroundColor Green
Write-Host "📊 Resumen:" -ForegroundColor Cyan
Write-Host "   - Pasajero: $($passenger.user.email) (ID: $($passenger.user.id))" -ForegroundColor White
Write-Host "   - Conductor: $($driver.user.email) (ID: $($driver.user.id))" -ForegroundColor White
Write-Host "   - Estado conductor: online" -ForegroundColor White
Write-Host ""
Write-Host "🔗 Próximos pasos:" -ForegroundColor Yellow
Write-Host "   1. Levantar servicios Trips, Dispatch, Wallet" -ForegroundColor White
Write-Host "   2. Crear viaje y probar asignación" -ForegroundColor White
Write-Host "   3. Probar notificaciones y pagos" -ForegroundColor White