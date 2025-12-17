# Supabase Email OTP Authentication Integration Guide

## Overview
This app now uses **Supabase Email OTP authentication** for secure, passwordless login and signup flows.

## Setup Steps

### 1. Create a Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in project details and database password
5. Wait for the project to initialize (2-3 minutes)

### 2. Get Your API Keys
1. Go to **Settings → API**
2. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret** → `SUPABASE_SERVICE_ROLE_KEY` (keep private!)

### 3. Configure Email OTP in Supabase
1. Go to **Authentication → Providers**
2. Scroll to "Email"
3. Set "Confirm email" to **Enabled**
4. Ensure "Enable email confirmations" is toggled **ON**
5. Click "Save"

### 4. Set Environment Variables

#### Local Development (`.env.local`)
```
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

#### Vercel Deployment
1. Go to your Vercel project dashboard
2. Click **Settings → Environment Variables**
3. Add the four variables above
4. Select **Production, Preview, Development**
5. Click "Save"

### 5. Install Dependencies
```bash
npm install
```

## How It Works

### User Registration (Signup)
1. User enters email and company name
2. Click "Send OTP to Email"
3. Supabase sends 6-digit OTP to email
4. User enters OTP
5. Supabase creates new user account with company name in metadata
6. User is authenticated and redirected to discovery page

### User Login
1. User enters email
2. Click "Send OTP to Email"
3. Supabase sends 6-digit OTP to existing user's email
4. User enters OTP
5. User is authenticated and redirected to discovery page

## Authentication Flow

### Client-Side (`storage.ts`)
- `isAuthenticated()`: Checks if user has active Supabase session
- `getUser()`: Retrieves current user from Supabase, caches locally
- `logout()`: Signs out from Supabase and clears local cache
- `saveUser()` / `clearUser()`: Local cache management

### API Routes (`auth-helpers.ts`)
- `getAuthenticatedUser(req)`: Validates Bearer token from request
- `requireAuth(req, res)`: Middleware to protect API routes

### Protected Pages
All pages check authentication before rendering:
```tsx
const authed = await isAuthenticated();
if (!authed) {
  router.replace('/login');
}
```

## Testing Authentication

### Test Signup
1. Start app: `npm run dev`
2. Go to `http://localhost:5000`
3. Click "Don't have an account? Sign Up"
4. Enter: `test@example.com`, Company: `Test Corp`
5. Click "Send OTP to Email"
6. **You won't receive a real email in development** - check Supabase logs:
   - Go to **Authentication → Users**
   - Click on your test user
   - Look for the OTP in email logs
7. Or use Supabase's test email provider with Mailtrap/Resend

### Test Login
1. Once signed up, click "Sign In" (toggle mode)
2. Enter same email
3. Click "Send OTP to Email"
4. Enter OTP
5. Redirected to discovery page

### Test API Protection
Protected API routes use `requireAuth()`:
```tsx
import { requireAuth } from '@/lib/auth-helpers';

export default async function handler(req, res) {
  const user = await requireAuth(req, res);
  if (!user) return; // 401 already sent

  // Safe to access user.id, user.email, etc.
}
```

## Production Email Setup

Supabase sends emails through **Resend** by default. For production:

1. **Option A: Use Supabase's Default Resend**
   - Works out-of-the-box
   - Emails come from `noreply@resend.dev`
   - Perfect for MVP

2. **Option B: Custom SMTP**
   - Go to **Settings → Email**
   - Click "SMTP"
   - Add your SMTP credentials (Gmail, SendGrid, etc.)

3. **Option C: Use External Service**
   - Configure Resend/SendGrid separately
   - Update Supabase settings
   - More reliable for production

## Common Issues

### "Missing required environment variables"
- Ensure `.env.local` has all 4 variables
- Restart dev server after adding env vars
- Check for typos in variable names

### OTP not arriving
- **Development**: Check Supabase logs → Authentication → Users
- **Production**: Verify SMTP or Resend configuration
- Check email spam folder
- Ensure email in Supabase is correct

### "Unauthorized" API errors
- Ensure client is authenticated before making API calls
- Check Bearer token is being sent correctly
- Verify `getAuthenticatedUser()` is called properly

### User stays logged in after logout
- Clear browser localStorage (`dev tools → Application → Local Storage`)
- Check if `logout()` is being called correctly
- Verify Supabase session is cleared

## Database Schema

### Required: Analysis History Table

Run this SQL in your Supabase SQL Editor to enable analysis history:

```sql
-- Analysis History Table (with status tracking for pending/failed analyses)
CREATE TABLE IF NOT EXISTS public.analysis_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  parsed_data JSONB,
  business_profile JSONB,
  recommendations JSONB,
  project_blueprint JSONB,
  business_profile_pdf_url TEXT,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_analysis_history_user_id ON public.analysis_history(user_id);
CREATE INDEX IF NOT EXISTS idx_analysis_history_created_at ON public.analysis_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analysis_history_status ON public.analysis_history(status);

-- Enable Row Level Security
ALTER TABLE public.analysis_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies (users can only access their own data)
CREATE POLICY "Users can view own analysis history"
  ON public.analysis_history FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analysis history"
  ON public.analysis_history FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own analysis history"
  ON public.analysis_history FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own analysis history"
  ON public.analysis_history FOR DELETE USING (auth.uid() = user_id);

-- Auto-update timestamp function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for auto-updating updated_at
DROP TRIGGER IF EXISTS set_updated_at ON public.analysis_history;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.analysis_history
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
```

You can also find the complete SQL in `DATABASE_SCHEMA.sql` in the project root.

### Migration (if you have existing table)

If you already have the `analysis_history` table, run this migration:

```sql
-- Add new columns for status tracking
ALTER TABLE public.analysis_history 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed'));

ALTER TABLE public.analysis_history 
ADD COLUMN IF NOT EXISTS parsed_data JSONB;

ALTER TABLE public.analysis_history 
ADD COLUMN IF NOT EXISTS error_message TEXT;

-- Make columns nullable for pending records
ALTER TABLE public.analysis_history 
ALTER COLUMN business_profile DROP NOT NULL;

ALTER TABLE public.analysis_history 
ALTER COLUMN recommendations DROP NOT NULL;

-- Create index for status
CREATE INDEX IF NOT EXISTS idx_analysis_history_status ON public.analysis_history(status);

-- Update existing records to completed
UPDATE public.analysis_history SET status = 'completed' WHERE status IS NULL;
```

You can also find this in `DATABASE_MIGRATION.sql` in the project root.

### Optional: Profiles Table (for additional user data)

```sql
-- profiles table
create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  email text not null,
  company_name text,
  created_at timestamp default now()
);

-- questionnaire_submissions table
create table public.questionnaire_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  business_profile jsonb,
  created_at timestamp default now()
);

-- Set up RLS (Row Level Security)
alter table public.profiles enable row level security;
alter table public.questionnaire_submissions enable row level security;
```

## Cloudinary Setup (For PDF Uploads)

To enable PDF upload storage in Cloudinary:

### 1. Create a Cloudinary Account
1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for a free account
3. Go to your Dashboard

### 2. Get Your API Credentials
1. On the Dashboard, find your:
   - **Cloud Name** → `CLOUDINARY_CLOUD_NAME`
   - **API Key** → `CLOUDINARY_API_KEY`
   - **API Secret** → `CLOUDINARY_API_SECRET`

### 3. Add Environment Variables

Add these to your `.env.local`:
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

And to Vercel Environment Variables for production.

## Key Files Changed

- `lib/supabase.ts` - Supabase client initialization
- `lib/auth-helpers.ts` - API route authentication helpers
- `lib/storage.ts` - User session management (now uses Supabase)
- `pages/login.tsx` - Email OTP login/signup form
- `pages/index.tsx` - Redirects to login
- `pages/discovery.tsx` - Protected page with async auth, Cloudinary upload
- `pages/dashboard.tsx` - Protected page with async auth
- `pages/questionnaire.tsx` - Protected page with async auth
- `pages/history.tsx` - Analysis history page
- `pages/api/analyze-profile.ts` - Saves analysis to Supabase
- `pages/api/analysis-history.ts` - Fetches user's analysis history
- `pages/api/upload-to-cloudinary.ts` - Handles PDF uploads to Cloudinary
- `components/TopBar.tsx` - Added history link in profile dropdown

## Support

For Supabase issues, visit:
- Docs: https://supabase.com/docs
- GitHub: https://github.com/supabase/supabase
- Discord: https://discord.supabase.com
