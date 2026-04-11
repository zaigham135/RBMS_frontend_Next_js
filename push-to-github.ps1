# Script to push Next.js frontend to GitHub repository

Write-Host "🚀 Pushing Next.js Frontend to GitHub..." -ForegroundColor Cyan
Write-Host ""

# Check if git is initialized
if (-not (Test-Path ".git")) {
    Write-Host "📝 Initializing Git repository..." -ForegroundColor Yellow
    git init
    git branch -M master
}

# Check if remote exists
$remoteExists = git remote | Select-String "origin"

if (-not $remoteExists) {
    Write-Host "📝 Adding remote repository..." -ForegroundColor Yellow
    git remote add origin https://github.com/zaigham135/RBMS_frontend_Next_js.git
} else {
    Write-Host "✅ Remote repository already configured" -ForegroundColor Green
}

# Create .gitignore if it doesn't exist
if (-not (Test-Path ".gitignore")) {
    Write-Host "📝 Creating .gitignore..." -ForegroundColor Yellow
    
    $gitignoreContent = @"
# Dependencies
/node_modules
/.pnp
.pnp.js

# Testing
/coverage

# Next.js
/.next/
/out/
.next
out

# Production
/build
build.log

# Misc
.DS_Store
*.pem
.env
.env*.local

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts

# IDE
.vscode/
.idea/
*.swp
*.swo
*~
"@
    
    Set-Content -Path ".gitignore" -Value $gitignoreContent
}

Write-Host ""
Write-Host "📝 Staging all files..." -ForegroundColor Cyan
git add -A

Write-Host ""
Write-Host "📝 Creating commit..." -ForegroundColor Cyan
$commitMessage = "Update: Latest frontend changes with theme fixes and UI improvements"
git commit -m $commitMessage

Write-Host ""
Write-Host "📝 Pushing to GitHub..." -ForegroundColor Cyan
git push origin master

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
    Write-Host "🔗 Repository: https://github.com/zaigham135/RBMS_frontend_Next_js" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "❌ Push failed. You may need to force push if history was rewritten." -ForegroundColor Red
    Write-Host ""
    Write-Host "To force push, run:" -ForegroundColor Yellow
    Write-Host "git push origin master --force" -ForegroundColor White
}
