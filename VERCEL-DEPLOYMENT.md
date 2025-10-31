# PasaLey Vercel Deployment Guide

## GitHub Repository Status
✅ Code successfully pushed to: https://github.com/Chan4Sea/pasaley

## Vercel Deployment Steps

### 1. Connect GitHub Repository
1. Go to [vercel.com](https://vercel.com)
2. Sign up/Sign in with your GitHub account
3. Click "New Project"
4. Import your repository: `Chan4Sea/pasaley`

### 2. Configure Environment Variables
In the Vercel dashboard, add these environment variables:

**NEXT_PUBLIC_SUPABASE_URL**
```
https://xyjznjbtjkfrbrvmrcmd.supabase.co
```

**NEXT_PUBLIC_SUPABASE_ANON_KEY**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5anpuamJ0amtmcmJydm1yY21kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4MjY1NjcsImV4cCI6MjA3NzQwMjU2N30._FU4LHD3iK1plG3wb5cs3eAgl5LgoUn6ifh_YXRICCo
```

**NEXT_PUBLIC_GOOGLE_MAPS_API_KEY**
```
AIzaSyCO0kKndUNlmQi3B5mxy4dblg_8WYcuKuk
```

### 3. Deploy Settings
- **Framework Preset**: Next.js
- **Root Directory**: `/` (root)
- **Build Command**: `npm run build` (default)
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install` (default)

### 4. Deploy
1. Click "Deploy" button
2. Wait for build to complete (~2-3 minutes)
3. Your live URL will be: `https://pasaley.vercel.app` (or similar)

### 5. Verify Deployment
After deployment, test these features:
- [ ] Home page loads correctly
- [ ] Map tab shows Google Maps
- [ ] Explore tab shows product search
- [ ] Stores tab shows nearby stores
- [ ] Bottom navigation works
- [ ] Geolocation permissions work
- [ ] Store pages load correctly

## Features Ready for Testing
- 📱 Three-tab bottom navigation
- 🗺️ Interactive Google Maps with store markers
- 🔍 Product search with filters
- 🏪 Individual store pages
- 📍 Distance calculations
- 💫 Mobile-responsive design

## Next Steps
After successful deployment, you can:
1. Share the live URL
2. Test all features
3. Set up Capacitor for mobile app
4. Add real-time features
5. Implement payment processing

## Support
If you encounter any issues:
1. Check Vercel build logs
2. Verify environment variables
3. Test locally with `npm run build`
4. Check browser console for errors