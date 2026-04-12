# Deploy Next.js Frontend to AWS Elastic Beanstalk
Write-Host "Starting frontend deployment..." -ForegroundColor Green

# Build the Next.js application
Write-Host "`nBuilding Next.js application..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "`nBuild successful!" -ForegroundColor Green

# Deploy to Elastic Beanstalk
Write-Host "`nDeploying to AWS Elastic Beanstalk..." -ForegroundColor Yellow
eb deploy

if ($LASTEXITCODE -ne 0) {
    Write-Host "Deployment failed!" -ForegroundColor Red
    exit 1
}

Write-Host "`nDeployment successful!" -ForegroundColor Green
Write-Host "Frontend URL: http://taskmanagement-frontend-prod.eba-hn4jncsx.eu-north-1.elasticbeanstalk.com" -ForegroundColor Cyan
