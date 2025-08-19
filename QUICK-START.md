# 🚀 Yarvan - Inicio Rápido

## Prueba en 5 Minutos

```bash
# 1. Clonar repositorio
git clone https://github.com/wolfdreiko/yarvan.git
cd yarvan

# 2. Configurar variables
cp .env.example .env

# 3. Levantar servicios
make dev-up

# 4. Esperar 30 segundos y probar
sleep 30
make health-check

# 5. Ejecutar pruebas E2E
make test-e2e
```

## URLs de Acceso

- **API Gateway:** http://localhost:3000
- **Admin Panel:** http://localhost:3001  
- **RabbitMQ:** http://localhost:15672 (yarvan/yarvan123)

## Prueba Manual Rápida

```bash
# Registrar usuario
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@yarvan.com","password":"password123","role":"passenger"}'

# Login (copiar el token)
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@yarvan.com","password":"password123"}'

# Crear viaje (usar token del login)
curl -X POST http://localhost:3000/trips \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{"passengerId":1,"originLat":4.6097,"originLng":-74.0817,"originAddress":"Zona Rosa","destinationLat":4.5981,"destinationLng":-74.0758,"destinationAddress":"Centro"}'
```

## Comandos Útiles

```bash
make help           # Ver todos los comandos
make logs-follow    # Ver logs en tiempo real
make clean          # Limpiar y reiniciar
make test-all       # Ejecutar todas las pruebas
```

¡Listo! Yarvan funcionando en tu máquina local.