# Deploy Frontend to Vercel - Quick Guide

## Option 1: Deploy from Existing GitHub Repo (Easiest)

If your code is already on GitHub:

1. Go to https://vercel.com
2. Sign up/Login with GitHub
3. Click "Add New..." → "Project"
4. Select your repository
5. **Important**: Set "Root Directory" to `Nextjs_Frontend`
6. Add environment variable:
   - Key: `NEXT_PUBLIC_API_URL`
   - Value: `http://taskmanagement-backend-prod.eba-bdtdzgpg.eu-north-1.elasticbeanstalk.com`
7. Click "Deploy"

## Option 2: Create Separate Frontend Repository

If you want a separate repo for frontend only:

```powershell
# Navigate to frontend folder
cd "E:\role based task  management project\Nextjs_Frontend"

# Initialize new git repo
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Frontend for Vercel"

# Create new repo on GitHub (do this first on github.com)
# Then connect and push:
git remote add origin <your-new-frontend-repo-url>
git branch -M main
git push -u origin main
```

Then deploy from Vercel as usual.

## Option 3: Deploy via Vercel CLI (No GitHub needed)

```powershell
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend
cd "E:\role based task  management project\Nextjs_Frontend"

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? taskmanagement-frontend
# - Directory? ./ (current directory)
# - Override settings? No

# For production deployment:
vercel --prod
```

## Environment Variable Needed

**Key**: `NEXT_PUBLIC_API_URL`
**Value**: `http://taskmanagement-backend-prod.eba-bdtdzgpg.eu-north-1.elasticbeanstalk.com`

## After Deployment

1. Get your Vercel URL (e.g., `https://taskmanagement-frontend.vercel.app`)
2. Update backend CORS to allow your Vercel URL
3. Test the application

## No Backend Push Needed

Your backend is already deployed on AWS Elastic Beanstalk. You only need to:
- Deploy frontend to Vercel
- Update backend CORS configuration

That's it!
