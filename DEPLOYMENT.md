# Quick Deployment Guide for PasaLey

## Prerequisites
- GitHub account (for Vercel deployment)
- Vercel account (free tier works)
- Environment variables ready (already configured in .env.local)

## Deployment Steps

### Method 1: Vercel CLI (Fastest)

```bash
# 1. Navigate to project
cd /workspace/pasaley-app

# 2. Install Vercel CLI globally
npm install -g vercel

# 3. Login to Vercel
vercel login

# 4. Deploy to production
vercel --prod

# 5. Follow the prompts:
#    - Setup and deploy? Yes
#    - Which scope? (select your account)
#    - Link to existing project? No
#    - Project name? pasaley-marketplace
#    - Directory? ./
#    - Override settings? No

# 6. Deployment will complete and provide a URL
```

### Method 2: GitHub + Vercel Dashboard

```bash
# 1. Initialize Git (if not already)
cd /workspace/pasaley-app
git init
git add .
git commit -m "Initial commit: PasaLey with 3-tab navigation and Google Maps"

# 2. Create GitHub repository
#    - Go to github.com/new
#    - Name: pasaley-marketplace
#    - Public or Private
#    - Don't initialize with README

# 3. Push to GitHub
git remote add origin https://github.com/YOUR_USERNAME/pasaley-marketplace.git
git branch -M main
git push -u origin main

# 4. Deploy via Vercel Dashboard
#    - Go to vercel.com/new
#    - Import your GitHub repository
#    - Framework Preset: Next.js (auto-detected)
#    - Root Directory: ./
#    - Build Command: pnpm build (auto-detected)
#    - Output Directory: .next (auto-detected)

# 5. Configure Environment Variables in Vercel:
#    Project Settings → Environment Variables → Add:
```

**Environment Variables to Add**:
```
NEXT_PUBLIC_SUPABASE_URL=https://xyjznjbtjkfrbrvmrcmd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5anpuamJ0amtmcmJydm1yY21kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4MjY1NjcsImV4cCI6MjA3NzQwMjU2N30._FU4LHD3iK1plG3wb5cs3eAgl5LgoUn6ifh_YXRICCo
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyCO0kKndUNlmQi3B5mxy4dblg_8WYcuKuk
```

```bash
# 6. Click "Deploy"
#    - Vercel will build and deploy automatically
#    - Deployment typically takes 2-3 minutes
#    - You'll get a production URL like: pasaley-marketplace.vercel.app
```

### Method 3: Other Platforms

#### Railway
```bash
railway login
railway init
railway up
```

#### Render
1. Create new Web Service
2. Connect GitHub repository
3. Build Command: `pnpm install && pnpm build`
4. Start Command: `pnpm start`
5. Add environment variables

#### Netlify
1. Install Netlify CLI: `npm i -g netlify-cli`
2. Run: `netlify deploy --prod`
3. Follow prompts

## Post-Deployment

### 1. Verify Deployment
```bash
# Check if site is accessible
curl -I https://your-deployment-url.vercel.app

# Should return: HTTP/2 200
```

### 2. Test Basic Functionality
Visit these URLs:
- https://your-deployment-url.vercel.app/ (redirects to /stores)
- https://your-deployment-url.vercel.app/stores
- https://your-deployment-url.vercel.app/explore
- https://your-deployment-url.vercel.app/map

### 3. Check Browser Console
- Open Developer Tools (F12)
- Look for any errors
- Verify API calls to Supabase work
- Check Google Maps loads correctly

### 4. Allow Geolocation
- Browser will prompt for location permission
- Allow to test distance calculations
- Deny to test fallback to Kathmandu

### 5. Run Comprehensive Tests
Follow the TESTING.md document for complete test suite.

## Troubleshooting

### Build Fails
- Check Node.js version (requires 18+)
- Verify all dependencies installed
- Check build logs for specific errors

### Maps Don't Load
- Verify NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is set
- Check API key has Maps JavaScript API enabled
- Check browser console for API errors

### No Stores/Products Show
- Verify Supabase credentials are correct
- Check if stores table has data
- Verify geolocation permission granted
- Check distance calculations and radius filter

### Navigation Not Working
- Hard refresh (Ctrl+Shift+R)
- Clear browser cache
- Check if routing is configured correctly

## Development vs Production

**Local Development** (port 3000):
```bash
pnpm dev
# Use for: Development, debugging, testing changes
```

**Production Build** (deployed):
```bash
pnpm build && pnpm start
# Use for: Final testing, user access, deployment
```

## Next Steps After Deployment

1. Share deployment URL with team
2. Run comprehensive test suite (see TESTING.md)
3. Monitor for errors using Vercel Analytics
4. Set up custom domain (optional)
5. Configure Vercel analytics and monitoring

## Support

- Vercel Docs: https://vercel.com/docs
- Next.js Deployment: https://nextjs.org/docs/deployment
- Supabase Setup: https://supabase.com/docs/guides/getting-started
- Google Maps API: https://developers.google.com/maps/documentation

## Package Contents

The enhanced PasaLey application includes:
- ✅ Three-tab bottom navigation (Map, Explore, Stores)
- ✅ Google Maps integration with store markers
- ✅ Product search with filtering and sorting
- ✅ Distance-based calculations
- ✅ Radius filtering (2km, 5km, 10km)
- ✅ Individual store pages
- ✅ Mobile-responsive design
- ✅ Geolocation support with fallback
- ✅ Supabase integration for data
- ✅ TypeScript for type safety
- ✅ Tailwind CSS for styling

All existing functionality preserved and enhanced!
