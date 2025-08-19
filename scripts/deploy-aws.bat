@echo off
echo 🚀 Deploying Yarvan to AWS...

REM Check if AWS CLI is installed
aws --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ AWS CLI is not installed
    exit /b 1
)

REM Check if Terraform is installed
terraform --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Terraform is not installed
    exit /b 1
)

echo ✅ Prerequisites check passed

REM Initialize Terraform
echo 🏗️  Initializing Terraform...
cd infra\terraform
terraform init

REM Plan Terraform
echo 📋 Planning Terraform deployment...
terraform plan -out=tfplan

REM Ask for confirmation
set /p CONFIRM="Do you want to apply these changes? (y/N): "
if /i not "%CONFIRM%"=="y" (
    echo ❌ Deployment cancelled
    exit /b 0
)

REM Apply Terraform
echo 🚀 Applying Terraform...
terraform apply tfplan

REM Get outputs
echo 📊 Getting infrastructure outputs...
terraform output

echo ✅ AWS infrastructure deployed!
echo 📋 Next steps:
echo   1. Update GitHub secrets with AWS credentials
echo   2. Push code to trigger CI/CD pipeline
echo   3. Monitor ECS services in AWS Console