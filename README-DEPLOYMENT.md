# 🚀 Yarvan - Guía de Despliegue

## 📋 Requisitos Previos

- Docker & Docker Compose
- Node.js 18+
- AWS CLI configurado
- Terraform 1.5+
- Git

## 🛠️ Configuración Local

### 1. Clonar y Configurar

```bash
git clone https://github.com/wolfdreiko/yarvan.git
cd yarvan
cp .env.example .env
```

### 2. Configurar Variables de Entorno

Edita `.env` con tus credenciales:

```bash
# JWT
JWT_SECRET=tu-jwt-secret-super-seguro

# Base de Datos
DB_HOST=localhost
DB_USER=yarvan
DB_PASS=yarvan123

# Firebase
FIREBASE_PROJECT_ID=tu-proyecto-firebase
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Twilio
TWILIO_ACCOUNT_SID=tu-account-sid
TWILIO_AUTH_TOKEN=tu-auth-token

# SMTP
SMTP_HOST=smtp.gmail.com
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-app-password
```

### 3. Levantar Servicios Localmente

```bash
# Opción 1: Docker Compose (Recomendado)
cd infra/docker
docker-compose up -d

# Opción 2: Desarrollo individual
cd services/auth && npm install && npm run dev
cd services/users && npm install && npm run dev
# ... repetir para cada servicio
```

### 4. Verificar Servicios

```bash
# Health checks
curl http://localhost:3000/health  # API Gateway
curl http://localhost:3001/health  # Auth Service
curl http://localhost:3002/health  # Users Service
```

## ☁️ Despliegue en AWS

### 1. Configurar Infraestructura

```bash
cd infra/terraform

# Inicializar Terraform
terraform init

# Planificar despliegue
terraform plan -var="db_password=tu-password-seguro"

# Aplicar infraestructura
terraform apply -var="db_password=tu-password-seguro"
```

### 2. Configurar CI/CD

1. **Configurar Secrets en GitHub:**
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `DB_PASSWORD`
   - `JWT_SECRET`

2. **Push a main/develop:**
```bash
git add .
git commit -m "Deploy Yarvan microservices"
git push origin main  # Para producción
git push origin develop  # Para staging
```

### 3. Verificar Despliegue

```bash
# Obtener URL del ALB
terraform output alb_dns_name

# Probar endpoints
curl https://tu-alb-url.amazonaws.com/auth/health
curl https://tu-alb-url.amazonaws.com/users/health
```

## 🧪 Ejecutar Pruebas

### Pruebas Unitarias

```bash
# Instalar dependencias de testing
cd tests/e2e
npm install

# Ejecutar pruebas E2E
npm test

# O ejecutar directamente
node yarvan-e2e.test.js
```

### Pruebas de Carga

```bash
# Usando Artillery (instalar globalmente)
npm install -g artillery

# Crear archivo de pruebas de carga
artillery quick --count 10 --num 5 http://localhost:3000/auth/health
```

## 📊 Monitoreo

### CloudWatch Logs

```bash
# Ver logs de un servicio específico
aws logs tail /ecs/yarvan-auth --follow

# Ver métricas del cluster
aws ecs describe-clusters --clusters yarvan-cluster
```

### Métricas Clave

- **Latencia de API:** < 200ms p95
- **Disponibilidad:** > 99.9%
- **Errores:** < 0.1%
- **Throughput:** > 1000 req/min

## 🔧 Troubleshooting

### Problemas Comunes

1. **Servicio no responde:**
```bash
# Verificar estado del servicio
aws ecs describe-services --cluster yarvan-cluster --services yarvan-auth

# Reiniciar servicio
aws ecs update-service --cluster yarvan-cluster --service yarvan-auth --force-new-deployment
```

2. **Error de base de datos:**
```bash
# Verificar conectividad
aws rds describe-db-instances --db-instance-identifier yarvan-postgres

# Verificar security groups
aws ec2 describe-security-groups --group-ids sg-xxxxxxxxx
```

3. **Error de autenticación:**
```bash
# Verificar JWT secret en variables de entorno
aws ecs describe-task-definition --task-definition yarvan-auth
```

### Logs Útiles

```bash
# API Gateway
docker logs yarvan_api-gateway_1

# Base de datos
docker logs yarvan_postgres_1

# Redis
docker logs yarvan_redis_1
```

## 🚀 Comandos Rápidos

```bash
# Desarrollo local completo
make dev-up

# Ejecutar todas las pruebas
make test-all

# Desplegar a staging
make deploy-staging

# Desplegar a producción
make deploy-prod

# Ver logs en tiempo real
make logs-follow

# Limpiar recursos locales
make clean
```

## 📈 Escalamiento

### Horizontal

```bash
# Escalar servicio específico
aws ecs update-service \
  --cluster yarvan-cluster \
  --service yarvan-trips \
  --desired-count 3
```

### Vertical

```bash
# Actualizar task definition con más recursos
terraform apply -var="task_cpu=512" -var="task_memory=1024"
```

## 🔐 Seguridad

### Rotación de Secrets

```bash
# Rotar JWT secret
aws secretsmanager update-secret \
  --secret-id yarvan/jwt-secret \
  --secret-string "nuevo-jwt-secret"

# Actualizar servicios
aws ecs update-service --cluster yarvan-cluster --service yarvan-auth --force-new-deployment
```

### Backup de Base de Datos

```bash
# Crear snapshot manual
aws rds create-db-snapshot \
  --db-instance-identifier yarvan-postgres \
  --db-snapshot-identifier yarvan-backup-$(date +%Y%m%d)
```

## 📞 Soporte

- **Documentación:** [docs.yarvan.com](https://docs.yarvan.com)
- **Issues:** [GitHub Issues](https://github.com/wolfdreiko/yarvan/issues)
- **Slack:** #yarvan-support
- **Email:** support@yarvan.com