# Script to properly push Next.js frontend to GitHub

Write-Host "🚀 Setting up and pushing Next.js Frontend to GitHub..." -ForegroundColor Cyan
Write-Host ""

# Step 1: Check current branch
Write-Host "📝 Step 1: Checking current branch..." -ForegroundColor Yellow
$currentBranch = git branch --show-current

if (-not $currentBranch) {
    Write-Host "No branch found. Creating master branch..." -ForegroundColor Yellow
    
    # Stage all files
    git add -A
    
    # Create initial commit
    git commit -m "Initial commit: Next.js frontend with all features"
    
    # Create and switch to master branch
    git branch -M master
    
    Write-Host "✅ Master branch created" -ForegroundColor Green
} else {
    Write-Host "Current branch: $currentBranch" -ForegroundColor Green
    
    # Stage all files
    Write-Host ""
    Write-Host "📝 Staging all changes..." -ForegroundColor Yellow
    git add -A
    
    # Commit changes
    Write-Host "📝 Committing changes..." -ForegroundColor Yellow
    git commit -m "Update: Latest frontend changes with theme fixes and UI improvements"
}

# Step 2: Check remote
Write-Host ""
Write-Host "📝 Step 2: Checking remote repository..." -ForegroundColor Yellow
$remoteExists = git remote | Select-String "origin"

if (-not $remoteExists) {
    Write-Host "Adding remote repository..." -ForegroundColor Yellow
    git remote add origin https://github.com/zaigham135/RBMS_frontend_Next_js.git
} else {
    Write-Host "✅ Remote already configured" -ForegroundColor Green
}

# Step 3: Push to GitHub
Write-Host ""
Write-Host "📝 Step 3: Pushing to GitHub..." -ForegroundColor Cyan
Write-Host "⚠️  This will force push and overwrite remote history" -ForegroundColor Red
Write-Host ""
Write-Host "Continue? (Y/N)" -ForegroundColor Yellow
$response = Read-Host

if ($response -eq 'Y' -or $response -eq 'y') {
    git push origin master --force
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
        Write-Host "🔗 Repository: https://github.com/zaigham135/RBMS_frontend_Next_js" -ForegroundColor Cyan
    } else {
        Write-Host ""
        Write-Host "❌ Push failed. Error details above." -ForegroundColor Red
    }
} else {
    Write-Host ""
    Write-Host "❌ Push cancelled." -ForegroundColor Red
}
