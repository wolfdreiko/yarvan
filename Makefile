.PHONY: help dev-up dev-down test-all deploy-staging deploy-prod logs-follow clean

# Variables
DOCKER_COMPOSE_FILE = infra/docker/docker-compose.yml
TERRAFORM_DIR = infra/terraform
E2E_TEST_DIR = tests/e2e

help: ## Mostrar ayuda
	@echo "Comandos disponibles:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

dev-up: ## Levantar entorno de desarrollo
	@echo "🚀 Levantando entorno de desarrollo..."
	docker-compose -f $(DOCKER_COMPOSE_FILE) up -d
	@echo "✅ Servicios disponibles en:"
	@echo "   - API Gateway: http://localhost:3000"
	@echo "   - Admin Panel: http://localhost:3001"
	@echo "   - PostgreSQL: localhost:5432"
	@echo "   - Redis: localhost:6379"
	@echo "   - RabbitMQ: http://localhost:15672"

dev-down: ## Detener entorno de desarrollo
	@echo "🛑 Deteniendo entorno de desarrollo..."
	docker-compose -f $(DOCKER_COMPOSE_FILE) down

dev-logs: ## Ver logs de desarrollo
	docker-compose -f $(DOCKER_COMPOSE_FILE) logs -f

dev-restart: ## Reiniciar servicios de desarrollo
	@echo "🔄 Reiniciando servicios..."
	docker-compose -f $(DOCKER_COMPOSE_FILE) restart

install-deps: ## Instalar dependencias de todos los servicios
	@echo "📦 Instalando dependencias..."
	@for service in services/*/; do \
		if [ -f "$$service/package.json" ]; then \
			echo "Instalando dependencias para $$service"; \
			cd "$$service" && npm install && cd ../..; \
		fi \
	done

test-unit: ## Ejecutar pruebas unitarias
	@echo "🧪 Ejecutando pruebas unitarias..."
	@for service in services/*/; do \
		if [ -f "$$service/package.json" ]; then \
			echo "Probando $$service"; \
			cd "$$service" && npm test && cd ../..; \
		fi \
	done

test-e2e: ## Ejecutar pruebas end-to-end
	@echo "🎯 Ejecutando pruebas E2E..."
	cd $(E2E_TEST_DIR) && npm install && node yarvan-e2e.test.js

test-all: test-unit test-e2e ## Ejecutar todas las pruebas

build-images: ## Construir imágenes Docker
	@echo "🏗️ Construyendo imágenes Docker..."
	@for service in services/*/; do \
		service_name=$$(basename "$$service"); \
		echo "Construyendo imagen para $$service_name"; \
		docker build -t "yarvan/$$service_name:latest" "$$service"; \
	done

terraform-init: ## Inicializar Terraform
	@echo "🏗️ Inicializando Terraform..."
	cd $(TERRAFORM_DIR) && terraform init

terraform-plan: ## Planificar infraestructura
	@echo "📋 Planificando infraestructura..."
	cd $(TERRAFORM_DIR) && terraform plan

terraform-apply: ## Aplicar infraestructura
	@echo "🚀 Aplicando infraestructura..."
	cd $(TERRAFORM_DIR) && terraform apply -auto-approve

terraform-destroy: ## Destruir infraestructura
	@echo "💥 Destruyendo infraestructura..."
	cd $(TERRAFORM_DIR) && terraform destroy -auto-approve

deploy-staging: ## Desplegar a staging
	@echo "🚀 Desplegando a staging..."
	git push origin develop

deploy-prod: ## Desplegar a producción
	@echo "🚀 Desplegando a producción..."
	git push origin main

logs-follow: ## Seguir logs en tiempo real
	docker-compose -f $(DOCKER_COMPOSE_FILE) logs -f

logs-service: ## Ver logs de un servicio específico (make logs-service SERVICE=auth)
	docker-compose -f $(DOCKER_COMPOSE_FILE) logs -f $(SERVICE)

clean: ## Limpiar recursos locales
	@echo "🧹 Limpiando recursos..."
	docker-compose -f $(DOCKER_COMPOSE_FILE) down -v
	docker system prune -f
	docker volume prune -f

clean-all: ## Limpiar todo (incluyendo imágenes)
	@echo "🧹 Limpieza completa..."
	docker-compose -f $(DOCKER_COMPOSE_FILE) down -v
	docker system prune -af
	docker volume prune -f

health-check: ## Verificar salud de servicios
	@echo "🏥 Verificando salud de servicios..."
	@curl -s http://localhost:3000/health || echo "❌ API Gateway no responde"
	@curl -s http://localhost:3001/health || echo "❌ Auth Service no responde"
	@curl -s http://localhost:3002/health || echo "❌ Users Service no responde"
	@curl -s http://localhost:3003/health || echo "❌ Drivers Service no responde"
	@curl -s http://localhost:3004/health || echo "❌ Trips Service no responde"

db-migrate: ## Ejecutar migraciones de base de datos
	@echo "🗄️ Ejecutando migraciones..."
	docker-compose -f $(DOCKER_COMPOSE_FILE) exec postgres psql -U yarvan -d yarvan -c "SELECT version();"

db-seed: ## Poblar base de datos con datos de prueba
	@echo "🌱 Poblando base de datos..."
	cd scripts && node seed-database.js

backup-db: ## Crear backup de base de datos
	@echo "💾 Creando backup..."
	docker-compose -f $(DOCKER_COMPOSE_FILE) exec postgres pg_dump -U yarvan yarvan > backup_$(shell date +%Y%m%d_%H%M%S).sql

restore-db: ## Restaurar backup de base de datos (make restore-db BACKUP=backup_file.sql)
	@echo "🔄 Restaurando backup..."
	docker-compose -f $(DOCKER_COMPOSE_FILE) exec -T postgres psql -U yarvan yarvan < $(BACKUP)

monitor: ## Abrir herramientas de monitoreo
	@echo "📊 Abriendo herramientas de monitoreo..."
	@echo "RabbitMQ Management: http://localhost:15672 (yarvan/yarvan123)"
	@echo "PostgreSQL: localhost:5432 (yarvan/yarvan123)"
	@echo "Redis: localhost:6379"

setup: install-deps dev-up ## Configuración inicial completa
	@echo "🎉 Configuración inicial completada!"
	@echo "Ejecuta 'make health-check' para verificar que todo funciona correctamente"

quick-test: ## Prueba rápida de funcionalidad básica
	@echo "⚡ Ejecutando prueba rápida..."
	@curl -s -X POST http://localhost:3000/auth/register \
		-H "Content-Type: application/json" \
		-d '{"email":"test@test.com","password":"password123","role":"passenger"}' \
		|| echo "❌ Registro de usuario falló"

format: ## Formatear código
	@echo "✨ Formateando código..."
	@for service in services/*/; do \
		if [ -f "$$service/package.json" ]; then \
			cd "$$service" && npm run format 2>/dev/null || echo "No format script in $$service" && cd ../..; \
		fi \
	done

lint: ## Ejecutar linter
	@echo "🔍 Ejecutando linter..."
	@for service in services/*/; do \
		if [ -f "$$service/package.json" ]; then \
			cd "$$service" && npm run lint 2>/dev/null || echo "No lint script in $$service" && cd ../..; \
		fi \
	done