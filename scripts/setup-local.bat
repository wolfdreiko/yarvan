@echo off
echo 🚀 Setting up Yarvan local environment...

REM Check if Docker is running
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed or running
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed
    exit /b 1
)

echo ✅ Prerequisites check passed

REM Copy environment file
if not exist "infra\docker\.env" (
    copy "infra\docker\.env.example" "infra\docker\.env"
    echo ✅ Environment file created
)

REM Install dependencies for services
echo 📦 Installing dependencies...
cd services\api-gateway && npm install && cd ..\..
cd services\pricing && npm install && cd ..\..

REM Install dependencies for admin panel
cd apps\admin-panel && npm install && cd ..\..

echo ✅ Dependencies installed

REM Start Docker Compose
echo 🐳 Starting Docker services...
cd infra\docker
docker-compose up -d postgres redis osrm

echo ⏳ Waiting for services to be ready...
timeout /t 30 /nobreak >nul

REM Health checks
echo 🔍 Running health checks...
curl -f http://localhost:5432 >nul 2>&1 || echo "⚠️  PostgreSQL might not be ready"
curl -f http://localhost:6379 >nul 2>&1 || echo "⚠️  Redis might not be ready"

echo ✅ Local environment setup complete!
echo 📋 Next steps:
echo   1. Update .env file with your configuration
echo   2. Run: docker-compose up api-gateway pricing
echo   3. Visit: http://localhost:3000/api/v1/health