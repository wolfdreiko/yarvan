# 🚀 Yarvan Deployment Guide

## 📋 Prerequisites

### Local Development
- **Docker Desktop** (Windows)
- **Node.js 18+**
- **Python 3.11+** (for ml-facial)
- **VS Code** with extensions:
  - Docker
  - AWS Toolkit
  - Terraform

### AWS Deployment
- **AWS CLI** configured
- **Terraform 1.0+**
- **GitHub** repository with secrets

---

## 🏠 Local Setup

### 1. Quick Start
```bash
# Run setup script
scripts\setup-local.bat

# Or manual setup:
cd infra\docker
copy .env.example .env
docker-compose up -d postgres redis osrm
```

### 2. Start Services
```bash
# API Gateway
cd services\api-gateway
npm run start:dev

# Pricing Service
cd services\pricing
npm run start:dev

# Admin Panel
cd apps\admin-panel
npm run dev
```

### 3. Health Checks
- API Gateway: http://localhost:3000/api/v1/health
- Pricing: http://localhost:3002/health
- Admin Panel: http://localhost:3001
- PostgreSQL: localhost:5432
- Redis: localhost:6379

---

## ☁️ AWS Deployment

### 1. Infrastructure Setup
```bash
# Deploy infrastructure
scripts\deploy-aws.bat

# Or manual:
cd infra\terraform
terraform init
terraform plan
terraform apply
```

### 2. GitHub Secrets
Add these secrets to your GitHub repository:
```
AWS_ACCOUNT_ID=123456789012
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
```

### 3. Deploy Services
```bash
# Push to main branch triggers CI/CD
git push origin main
```

---

## 🔧 Configuration

### Environment Variables
```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=yarvan
DB_PASS=yarvan123
DB_NAME=yarvan

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=24h

# External APIs
MAPBOX_TOKEN=pk.your-mapbox-token-here
FIREBASE_PROJECT_ID=yarvan-app
```

---

## 🧪 Testing

### Smoke Tests
```bash
# Health endpoints
curl http://localhost:3000/api/v1/health
curl http://localhost:3002/health

# Database connection
docker exec -it yarvan_postgres psql -U yarvan -d yarvan -c "SELECT version();"

# Redis connection
docker exec -it yarvan_redis redis-cli ping
```

### Load Testing
```bash
# Install artillery
npm install -g artillery

# Run load test
artillery quick --count 10 --num 5 http://localhost:3000/api/v1/health
```

---

## 📊 Monitoring

### Local Logs
```bash
# Docker logs
docker-compose logs -f api-gateway
docker-compose logs -f pricing

# Service logs
npm run start:dev  # Shows live logs
```

### AWS Monitoring
- **CloudWatch Logs**: `/aws/ecs/yarvan-*`
- **CloudWatch Metrics**: ECS service metrics
- **ALB Access Logs**: S3 bucket
- **RDS Performance Insights**: Database metrics

---

## 🔒 Security Recommendations

### Authentication
**Recomendación: AWS Cognito vs Keycloak**

**AWS Cognito** (Recomendado para Yarvan):
- ✅ Integración nativa con AWS
- ✅ Escalabilidad automática
- ✅ MFA y biometría móvil
- ✅ Costo por uso
- ✅ Compliance SOC/ISO

**Keycloak**:
- ✅ Open source y customizable
- ❌ Requiere gestión de infraestructura
- ❌ Costos de hosting y mantenimiento

### Mobile Security
```typescript
// Play Integrity API (Android)
import { PlayIntegrity } from '@google-cloud/play-integrity';

// DeviceCheck (iOS)
import DeviceCheck from 'react-native-device-check';
```

### Data Export (Legal Compliance)
```sql
-- Export user data for authorities
SELECT 
  u.id, u.email, u.created_at,
  t.origin, t.destination, t.created_at as trip_date
FROM users u
LEFT JOIN trips t ON u.id = t.user_id
WHERE u.id = $1;
```

---

## 🚨 Troubleshooting

### Common Issues

**Docker not starting:**
```bash
# Windows: Restart Docker Desktop
# Check WSL2 backend is enabled
```

**Port conflicts:**
```bash
# Check what's using port
netstat -ano | findstr :3000
# Kill process
taskkill /PID <PID> /F
```

**Database connection failed:**
```bash
# Check PostgreSQL is running
docker ps | grep postgres
# Check connection
docker exec -it yarvan_postgres pg_isready -U yarvan
```

**AWS deployment fails:**
```bash
# Check AWS credentials
aws sts get-caller-identity
# Check Terraform state
terraform show
```

---

## 📈 Scaling Considerations

### ECS vs EKS Decision

**ECS Fargate** (Recomendado para Yarvan):
- ✅ Serverless, sin gestión de nodos
- ✅ Integración nativa con ALB/NLB
- ✅ Menor complejidad operacional
- ✅ Ideal para microservicios HTTP

**EKS**:
- ✅ Mayor flexibilidad y control
- ❌ Requiere gestión de nodos
- ❌ Mayor complejidad
- ✅ Mejor para workloads complejos

### Auto Scaling
```hcl
# ECS Service Auto Scaling
resource "aws_appautoscaling_target" "ecs_target" {
  max_capacity       = 10
  min_capacity       = 2
  resource_id        = "service/yarvan-cluster/yarvan-api-gateway"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}
```

---

## 📞 Support

- **Documentation**: This file
- **Issues**: GitHub Issues
- **Monitoring**: CloudWatch Dashboard
- **Logs**: ECS CloudWatch Logs