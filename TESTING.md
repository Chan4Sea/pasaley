# PasaLey Testing Progress

## Test Plan
**Website Type**: MPA (Multi-Page Application with 3 tabs)
**Test Date**: 2025-10-31
**Framework**: Next.js 14 with App Router
**Deployment Target**: Vercel (or compatible Node.js hosting)

### Key Features to Test
- [ ] Bottom Navigation (3 tabs: Map, Explore, Stores)
- [ ] Map View with Google Maps integration
- [ ] Store markers and info windows
- [ ] Explore view with product search
- [ ] Product filtering and sorting
- [ ] Stores grid view
- [ ] Individual store pages
- [ ] Geolocation detection
- [ ] Distance calculations
- [ ] Radius filtering
- [ ] Responsive design

### Critical Pathways
1. **Navigation Flow**: Home → Stores → Explore → Map → Back to Stores
2. **Map Interaction**: Open map → Allow location → View markers → Click marker → View store
3. **Product Search**: Open Explore → Search product → Apply filters → Sort results
4. **Store Details**: Click store card → View products → Navigate back
5. **Radius Filtering**: Change radius on each view → Verify results update

## Testing Progress

### Step 1: Pre-Test Planning
- Website complexity: Complex (Multi-page with Maps API integration)
- Test strategy: Pathway-based testing across all 3 main views
- Deployment requirement: Must deploy to Vercel/production before testing

### Step 2: Comprehensive Testing
**Status**: Pending Deployment

**Pre-Deployment Checklist**:
- [x] Build successful (no errors)
- [x] All routes created
- [x] Environment variables configured
- [x] Dependencies installed
- [ ] Deploy to production
- [ ] Run comprehensive tests

### Step 3: Coverage Validation
(To be completed after deployment)

### Step 4: Fixes & Re-testing
(To be documented as issues are found)

## Deployment Instructions

### Option 1: Vercel (Recommended)
```bash
cd /workspace/pasaley-app

# Install Vercel CLI if needed
npm i -g vercel

# Deploy
vercel --prod

# Follow prompts to link project
```

### Option 2: Manual Deployment
1. Push code to GitHub
2. Import project in Vercel dashboard
3. Configure environment variables:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
4. Deploy

### Option 3: Other Platforms
- **Netlify**: Use Next.js runtime
- **Railway**: Auto-deploy from Git
- **Render**: Node.js service

## Test Execution Plan

Once deployed, execute tests in this order:

1. **Basic Navigation** (5 min)
   - Access deployed URL
   - Verify home redirects to /stores
   - Click each bottom nav tab
   - Verify active tab highlighting
   - Check responsive design on mobile

2. **Stores View** (5 min)
   - Allow geolocation permission
   - Verify stores load
   - Check distance calculations
   - Test radius filter (2km, 5km, 10km)
   - Click a store card → verify details page

3. **Map View** (10 min)
   - Open map tab
   - Verify map loads with API key
   - Check user location marker appears
   - Verify store markers plot correctly
   - Click marker → check info window
   - Click "View Store" → verify navigation
   - Test radius filter on map

4. **Explore View** (10 min)
   - Open explore tab
   - Verify products load with store info
   - Test search functionality
   - Apply radius filter
   - Toggle "In Stock Only"
   - Sort by distance
   - Sort by price
   - Verify distance displays correctly

5. **Store Details Page** (5 min)
   - Access via any method
   - Verify store info displays
   - Check products list
   - Test "View on Map" link
   - Test "Add to Cart" buttons
   - Verify back navigation

6. **Error Handling** (5 min)
   - Deny geolocation → verify fallback location
   - Test with slow network
   - Access invalid store ID
   - Verify error messages display

## Expected Behavior

### Navigation
- Bottom nav always visible on all pages
- Active tab highlighted in blue
- Smooth transitions between views

### Geolocation
- Prompt for location permission
- Fall back to Kathmandu (27.7172, 85.324) if denied
- Calculate distances from current location

### Maps
- Google Maps loads correctly
- Blue circle marker for user location
- Red markers for stores
- Info windows show store preview
- Radius filter updates markers

### Product Search
- Real-time search filtering
- Multiple filter combinations work
- Sort by distance shows closest first
- Sort by price shows cheapest first

### Store Details
- Products display in grid
- Prices in NPR format
- In-stock status clear
- Add to cart disabled for out-of-stock

## Notes
- Local testing on localhost:3000 is for development only
- Production testing must use deployed URL
- Google Maps requires valid API key
- Supabase data should contain sample stores and products in Kathmandu area
