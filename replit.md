# Pasaley - Hyperlocal Retail Application

## Overview
A Next.js 14 web application with TypeScript and Tailwind CSS for hyperlocal retail services.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Linting**: ESLint
- **Formatting**: Prettier with Tailwind plugin
- **Node.js**: v20

## Project Structure
- `/app` - Next.js App Router pages and layouts
- `/public` - Static assets
- Configuration files in root

## Development
- Run `npm run dev` to start the development server on port 5000
- The app is configured to run on `0.0.0.0:5000` for Replit compatibility
- Hot reload is enabled with webpack polling for file watching

## Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## Environment Setup
- Configured for Replit environment with proper host settings
- Webpack polling enabled for file watching in cloud environment
- Development: Port 5000 binding for frontend preview
- Production: Respects PORT environment variable (defaults to 5000 if not set)

## Deployment
- Deployment target: Autoscale (for stateless web applications)
- Build command: `npm run build`
- Run command: `npm run start`

## Supabase Integration
- **Client Library**: `@supabase/supabase-js` installed
- **Helper Location**: `lib/supabase.ts`
- **Environment Variables Required**:
  - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous/public key
- **Usage**: Import with `import { supabase } from "@/lib/supabase"`
- **Example**: See `.env.local.example` for environment variable template

## Recent Changes
- **Oct 31, 2025**: Added Supabase integration
  - Installed @supabase/supabase-js
  - Created Supabase client helper at lib/supabase.ts
  - Added environment variable documentation
- **Oct 31, 2025**: Initial Next.js 14 setup with TypeScript and Tailwind CSS
  - Configured for Replit environment
  - Added Prettier with Tailwind plugin
  - Set up ESLint
  - Configured deployment settings
