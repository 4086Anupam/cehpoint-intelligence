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

## Database Schema (Optional)

For storing user data beyond authentication:

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

## Key Files Changed

- `lib/supabase.ts` - Supabase client initialization
- `lib/auth-helpers.ts` - API route authentication helpers
- `lib/storage.ts` - User session management (now uses Supabase)
- `pages/login.tsx` - Email OTP login/signup form
- `pages/index.tsx` - Redirects to login
- `pages/discovery.tsx` - Protected page with async auth
- `pages/dashboard.tsx` - Protected page with async auth
- `pages/questionnaire.tsx` - Protected page with async auth
- `package.json` - Added `@supabase/supabase-js` dependency

## Support

For Supabase issues, visit:
- Docs: https://supabase.com/docs
- GitHub: https://github.com/supabase/supabase
- Discord: https://discord.supabase.com
