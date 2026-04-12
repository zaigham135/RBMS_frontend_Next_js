#!/usr/bin/env pwsh

Write-Host "🚀 Pushing Frontend to GitHub..." -ForegroundColor Cyan

# Check if .git exists
if (-not (Test-Path ".git")) {
    Write-Host "📦 Initializing Git repository..." -ForegroundColor Yellow
    git init
    git add .
    git commit -m "Initial commit: Next.js frontend"
}

# Check if remote exists
$remoteExists = git remote | Select-String "origin"
if (-not $remoteExists) {
    Write-Host "🔗 Adding remote repository..." -ForegroundColor Yellow
    git remote add origin https://github.com/zaigham135/RBMS_frontend_Next_js.git
}

# Get current branch name
$currentBranch = git branch --show-current

# If no branch exists, create master
if (-not $currentBranch) {
    Write-Host "🌿 Creating master branch..." -ForegroundColor Yellow
    git checkout -b master
}

# Stage all changes
Write-Host "📝 Staging changes..." -ForegroundColor Yellow
git add .

# Check if there are changes to commit
$status = git status --porcelain
if ($status) {
    Write-Host "💾 Committing changes..." -ForegroundColor Yellow
    git commit -m "Update: Latest frontend changes"
} else {
    Write-Host "✅ No changes to commit" -ForegroundColor Green
}

# Push to GitHub
Write-Host "📤 Pushing to GitHub..." -ForegroundColor Yellow
try {
    git push -u origin master
    Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Push failed. Trying force push..." -ForegroundColor Yellow
    git push -u origin master --force
    Write-Host "✅ Force push completed!" -ForegroundColor Green
}

Write-Host "`n🎉 Done!" -ForegroundColor Cyan
