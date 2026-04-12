# Vercel Deployment Guide for Next.js Frontend

## Why Vercel?
- **Built for Next.js** - Created by the same team
- **Production-ready** - Used by Fortune 500 companies
- **Free tier** - Perfect for your project
- **Zero config** - Automatic optimization
- **30-second deploys** - Much faster than AWS EB

## Step-by-Step Deployment

### 1. Push Code to GitHub (if not already)
```bash
cd "E:\role based task  management project\Nextjs_Frontend"
git init
git add .
git commit -m "Ready for Vercel deployment"
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Sign Up for Vercel
- Go to https://vercel.com
- Click "Sign Up"
- Choose "Continue with GitHub"
- Authorize Vercel to access your repositories

### 3. Import Your Project
- Click "Add New..." → "Project"
- Select your `Nextjs_Frontend` repository
- Vercel will auto-detect it's a Next.js project

### 4. Configure Environment Variables
Before deploying, add this environment variable:

**Key**: `NEXT_PUBLIC_API_URL`
**Value**: `http://taskmanagement-backend-prod.eba-bdtdzgpg.eu-north-1.elasticbeanstalk.com`

### 5. Deploy
- Click "Deploy"
- Wait ~30 seconds
- Your app will be live at: `https://your-project-name.vercel.app`

## Post-Deployment: Update Backend CORS

After deployment, you need to update your backend to allow requests from Vercel.

### Update SecurityConfig.java

Replace the CORS configuration in `Backend_Java/backend/backend/src/main/java/com/example/backend/config/SecurityConfig.java`:

```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowedOrigins(List.of(
        "http://localhost:3000",
        "https://your-project-name.vercel.app"  // Add your Vercel URL here
    ));
    config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    config.setAllowedHeaders(List.of("*"));
    config.setAllowCredentials(true);
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);
    return source;
}
```

### Redeploy Backend
```powershell
cd "E:\role based task  management project\Backend_Java\backend\backend\eb-deploy-temp"
eb deploy
```

## Vercel Features You'll Get

✅ **Automatic HTTPS** - Free SSL certificate
✅ **Global CDN** - Fast loading worldwide
✅ **Preview Deployments** - Every git push gets a preview URL
✅ **Analytics** - Built-in performance monitoring
✅ **Automatic Optimization** - Image optimization, code splitting
✅ **Zero Downtime** - Atomic deployments
✅ **Custom Domains** - Add your own domain (optional)

## Environment Variables in Vercel

After deployment, you can update environment variables:
1. Go to your project dashboard
2. Click "Settings" → "Environment Variables"
3. Add/edit variables
4. Redeploy for changes to take effect

## Monitoring

Vercel provides:
- Real-time logs
- Performance analytics
- Error tracking
- Build logs

Access via: Project Dashboard → "Deployments" → Click any deployment

## Cost

**Free Tier Includes**:
- Unlimited deployments
- 100 GB bandwidth/month
- Automatic HTTPS
- Preview deployments
- Analytics

This is more than enough for your project!

## Comparison: Vercel vs AWS Elastic Beanstalk

| Feature | Vercel | AWS EB |
|---------|--------|--------|
| Setup Time | 2 minutes | 30+ minutes |
| Deploy Time | 30 seconds | 15+ minutes |
| Configuration | Zero | Complex |
| Cost (Free Tier) | 100 GB/month | Limited hours |
| Next.js Optimization | Native | Manual |
| HTTPS | Automatic | Manual setup |
| CDN | Global | Optional |
| Preview Deployments | Yes | No |

## Next Steps

1. Deploy to Vercel (follow steps above)
2. Get your Vercel URL
3. Update backend CORS with Vercel URL
4. Redeploy backend
5. Test your application

Your frontend will be live and production-ready in minutes!
