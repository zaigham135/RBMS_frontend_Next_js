# Fixed deployment script - deploy with node_modules
Write-Host "Deploying Next.js to AWS with pre-built bundle..." -ForegroundColor Cyan

# Create a temporary deployment package
Write-Host "Creating deployment package..." -ForegroundColor Yellow

# Deploy using --staged to include all files
eb deploy --staged

Write-Host "Deployment initiated!" -ForegroundColor Green
Write-Host "Monitor with: eb events -f" -ForegroundColor Gray
