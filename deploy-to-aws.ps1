# Complete AWS Deployment Script for Next.js Frontend
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Next.js Frontend AWS Deployment" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Stop any running Node processes
Write-Host "[1/6] Stopping running Node processes..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2
Write-Host "✓ Processes stopped" -ForegroundColor Green
Write-Host ""

# Step 2: Clean previous build
Write-Host "[2/6] Cleaning previous build..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 1
}
Write-Host "✓ Build cleaned" -ForegroundColor Green
Write-Host ""

# Step 3: Install dependencies
Write-Host "[3/6] Installing dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Dependency installation failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Dependencies installed" -ForegroundColor Green
Write-Host ""

# Step 4: Build Next.js application
Write-Host "[4/6] Building Next.js application..." -ForegroundColor Yellow
Write-Host "This may take a few minutes..." -ForegroundColor Gray
$env:NEXT_PUBLIC_API_URL = "http://taskmanagement-backend-prod.eba-bdtdzgpg.eu-north-1.elasticbeanstalk.com"
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Build failed!" -ForegroundColor Red
    Write-Host "Please fix the build errors and try again." -ForegroundColor Yellow
    exit 1
}
Write-Host "✓ Build successful" -ForegroundColor Green
Write-Host ""

# Step 5: Deploy to AWS Elastic Beanstalk
Write-Host "[5/6] Deploying to AWS Elastic Beanstalk..." -ForegroundColor Yellow
Write-Host "Uploading application bundle..." -ForegroundColor Gray
eb deploy
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Deployment failed!" -ForegroundColor Red
    Write-Host "Check AWS Console for details." -ForegroundColor Yellow
    exit 1
}
Write-Host "✓ Deployment initiated" -ForegroundColor Green
Write-Host ""

# Step 6: Check deployment status
Write-Host "[6/6] Checking deployment status..." -ForegroundColor Yellow
Start-Sleep -Seconds 5
eb status
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Deployment Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Frontend URL: http://taskmanagement-frontend-prod.eba-hn4jncsx.eu-north-1.elasticbeanstalk.com" -ForegroundColor Cyan
Write-Host ""
Write-Host "Monitor deployment: eb events -f" -ForegroundColor Gray
Write-Host "Check logs: eb logs" -ForegroundColor Gray
Write-Host ""
