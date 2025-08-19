# ✅ Yarvan Deployment Checklist

## 🏠 Local Development Setup

### Prerequisites
- [ ] Docker Desktop installed and running
- [ ] Node.js 18+ installed
- [ ] Python 3.11+ installed (for ml-facial)
- [ ] VS Code with recommended extensions

### Environment Setup
- [ ] Run `scripts\setup-local.bat`
- [ ] Copy `.env.example` to `.env` in `infra\docker\`
- [ ] Update `.env` with your configuration
- [ ] Verify Docker Compose services start: `docker-compose up -d`

### Service Validation
- [ ] API Gateway health: `curl http://localhost:3000/api/v1/health`
- [ ] Pricing service health: `curl http://localhost:3002/health`
- [ ] PostgreSQL connection: `docker exec -it yarvan_postgres pg_isready -U yarvan`
- [ ] Redis connection: `docker exec -it yarvan_redis redis-cli ping`
- [ ] Admin Panel loads: http://localhost:3001

---

## ☁️ AWS Infrastructure

### Prerequisites
- [ ] AWS CLI installed and configured
- [ ] Terraform 1.0+ installed
- [ ] AWS account with appropriate permissions

### Infrastructure Deployment
- [ ] Run `terraform init` in `infra/terraform/`
- [ ] Run `terraform plan` and review changes
- [ ] Run `terraform apply` to create infrastructure
- [ ] Verify outputs: VPC, RDS, ElastiCache, ECS, ALB

### Resource Validation
- [ ] VPC created with public/private subnets
- [ ] RDS PostgreSQL instance running
- [ ] ElastiCache Redis cluster active
- [ ] ECS cluster created
- [ ] ALB with target groups configured
- [ ] S3 bucket with versioning enabled
- [ ] ECR repositories created for all services

---

## 🚀 CI/CD Pipeline

### GitHub Setup
- [ ] Repository created and code pushed
- [ ] GitHub secrets configured:
  - [ ] `AWS_ACCOUNT_ID`
  - [ ] `AWS_ACCESS_KEY_ID`
  - [ ] `AWS_SECRET_ACCESS_KEY`

### Pipeline Validation
- [ ] GitHub Actions workflow triggers on push
- [ ] Docker images build successfully
- [ ] Images pushed to ECR repositories
- [ ] ECS services update with new images

---

## 🔒 Security Configuration

### Authentication
- [ ] JWT secrets configured in SSM Parameter Store
- [ ] Database passwords stored securely
- [ ] IAM roles follow least privilege principle

### Network Security
- [ ] Security groups configured properly
- [ ] RDS only accessible from ECS
- [ ] ElastiCache only accessible from ECS
- [ ] ALB allows HTTP/HTTPS traffic only

### Data Protection
- [ ] RDS encryption at rest enabled
- [ ] S3 bucket encryption enabled
- [ ] ElastiCache encryption in transit enabled

---

## 📱 Mobile App Validation

### Flutter Dependencies (Existing pubspec.yaml)
- [ ] `geolocator` for location services
- [ ] `google_maps_flutter` for maps
- [ ] `local_auth` for biometric authentication
- [ ] `firebase_core` and `firebase_auth` for authentication
- [ ] `flutter_secure_storage` for secure data storage

### Recommended Structure
```
apps/driver-app/
├── lib/
│   ├── main.dart
│   ├── screens/
│   │   ├── login_screen.dart
│   │   ├── home_screen.dart
│   │   └── trip_screen.dart
│   ├── services/
│   │   ├── auth_service.dart
│   │   ├── location_service.dart
│   │   └── api_service.dart
│   └── models/
│       ├── user.dart
│       ├── trip.dart
│       └── driver.dart
```

### Security Features
- [ ] Biometric authentication implemented
- [ ] Secure storage for tokens
- [ ] Certificate pinning for API calls
- [ ] Play Integrity/DeviceCheck integration planned

---

## 🧪 Testing & Validation

### Smoke Tests
```bash
# Health endpoints
curl -f http://localhost:3000/api/v1/health
curl -f http://localhost:3002/health

# Database connectivity
docker exec yarvan_postgres psql -U yarvan -d yarvan -c "SELECT 1;"

# Redis connectivity
docker exec yarvan_redis redis-cli ping
```

### Load Testing
```bash
# Install artillery globally
npm install -g artillery

# Basic load test
artillery quick --count 10 --num 5 http://localhost:3000/api/v1/health
```

### PostGIS Validation
```sql
-- Test PostGIS extension
SELECT PostGIS_Version();

-- Test spatial query
SELECT ST_Distance(
  ST_GeomFromText('POINT(-74.0059 40.7128)'),  -- NYC
  ST_GeomFromText('POINT(-118.2437 34.0522)')  -- LA
);
```

---

## 📊 Monitoring Setup

### CloudWatch
- [ ] Log groups created for all services
- [ ] Metrics dashboard configured
- [ ] Alarms set for critical metrics:
  - [ ] ECS service health
  - [ ] RDS CPU/connections
  - [ ] ALB response times
  - [ ] ElastiCache memory usage

### Application Monitoring
- [ ] Health endpoints responding
- [ ] Database connections stable
- [ ] Redis cache working
- [ ] External API integrations tested

---

## 🔧 Configuration Management

### Environment Variables
- [ ] Local `.env` files configured
- [ ] AWS SSM parameters created
- [ ] Secrets properly encrypted
- [ ] Service discovery configured

### External Integrations
- [ ] Mapbox token configured
- [ ] Firebase project setup
- [ ] OSRM routing service accessible
- [ ] Payment gateway credentials (future)

---

## 📈 Performance Optimization

### Database
- [ ] Connection pooling configured
- [ ] Indexes created for common queries
- [ ] Query performance monitored

### Caching
- [ ] Redis cache strategy implemented
- [ ] CDN configured for static assets
- [ ] API response caching enabled

### Auto Scaling
- [ ] ECS service auto scaling configured
- [ ] RDS read replicas planned
- [ ] ElastiCache cluster scaling configured

---

## 🚨 Disaster Recovery

### Backups
- [ ] RDS automated backups enabled
- [ ] S3 versioning and lifecycle policies
- [ ] Database backup restoration tested

### High Availability
- [ ] Multi-AZ deployment for RDS
- [ ] ECS services across multiple AZs
- [ ] ALB health checks configured

---

## 📋 Final Validation Commands

```bash
# Local environment
cd D:\proyectos\yarvan
scripts\setup-local.bat

# AWS deployment
scripts\deploy-aws.bat

# Health checks
curl http://localhost:3000/api/v1/health
curl http://localhost:3002/health
curl http://your-alb-dns/api/v1/health

# Database test
docker exec yarvan_postgres psql -U yarvan -d yarvan -c "SELECT version();"

# Redis test
docker exec yarvan_redis redis-cli ping
```

---

## 🎯 Next Steps After Validation

1. **Complete remaining services** (auth, users, drivers, etc.)
2. **Implement Flutter apps** with biometric authentication
3. **Add payment integration** (Stripe/PayPal)
4. **Set up monitoring dashboards**
5. **Configure SSL certificates** with ACM
6. **Implement logging aggregation**
7. **Add integration tests**
8. **Set up staging environment**

---

## 📞 Troubleshooting Quick Reference

| Issue | Solution |
|-------|----------|
| Docker not starting | Restart Docker Desktop, check WSL2 |
| Port 3000 in use | `netstat -ano \| findstr :3000`, kill process |
| DB connection failed | Check PostgreSQL container, verify credentials |
| Terraform apply fails | Check AWS credentials, review IAM permissions |
| ECS service not starting | Check CloudWatch logs, verify task definition |
| Health check failing | Verify service is listening on correct port |