# Cehpoint - AI-Powered Sales Platform for Technology Solutions

> Transform client onboarding into instant, customizable proposals powered by Google Gemini AI

[![Next.js](https://img.shields.io/badge/Next.js-15.2-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

---

## 📋 Table of Contents

- [Executive Summary](#executive-summary)
- [Key Features](#key-features)
- [User Flow](#user-flow)
- [Tech Stack & Architecture](#tech-stack--architecture)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [Deployment to Vercel](#deployment-to-vercel)
- [Sales Team Playbook](#sales-team-playbook)
- [Development](#development)
- [Future Roadmap](#future-roadmap)
- [Support](#support)

---

## 🎯 Executive Summary

Cehpoint is a **sales-focused proposal generation platform** that enables sales teams to:
- Upload client business profiles (PDF, DOCX, TXT) or use a 7-section questionnaire
- Generate AI-powered technology recommendations using Google Gemini
- Customize proposals by toggling solutions on/off and adding sales notes
- Export professional HTML proposals or share via WhatsApp instantly

**Built:** November 2025  
**Status:** Production-ready MVP with localStorage (ready for Supabase backend)  
**Target Users:** Sales teams conducting client meetings

---

## ✨ Key Features

### 1. **Dual Onboarding Methods**
- **Upload Business Profile**: AI extracts business details from documents (PDF, DOCX, TXT)
- **Smart Questionnaire**: 7 comprehensive sections covering all business aspects

### 2. **AI-Powered Analysis** (Google Gemini)
- Analyzes business challenges, goals, and technology status
- Generates 6-12 personalized recommendations across 6 categories:
  1. Process Automation & Optimization
  2. Software Solutions
  3. Cybersecurity & Risk Reduction
  4. Technology Modernization
  5. AI & Intelligent Automation
  6. Industry-Specific Solutions
- Creates project blueprints with phases, deliverables, and costs (₹10,000 - ₹95,000 range)

### 3. **Sales Platform Features**
- **Customization Mode**: Toggle recommendations on/off for each client
- **Sales Notes**: Add personalized messages for proposals
- **Proposal Summary**: Track included/excluded solutions across all categories
- **Download Proposal**: Export comprehensive HTML proposals (printable to PDF)
- **WhatsApp Sharing**: Send proposals via WhatsApp with pre-filled messages
- **Multi-Currency Support**: USD / INR / EUR pricing display

### 4. **Professional Dashboard**
- Priority-based recommendations (High/Medium/Low)
- Category filtering
- Business impact and ROI display
- Timeline and cost estimates
- WhatsApp CTAs for instant client communication
- ISO 27001, SOC 2, Google Partner certifications display

---

## 🔄 User Flow

### For Sales Teams:

```
1. Sign In → Access platform (localStorage-based for MVP)
   └─> Click "New Client Proposal" to start fresh session

2. Discovery → Choose data input method
   ├─> Upload business profile (AI extracts data)
   └─> Fill questionnaire (7 sections, auto-saves)

3. Analysis → AI processes with Gemini
   └─> Generates 6-12 recommendations + project blueprint

4. Dashboard → Customize proposal
   ├─> Toggle recommendations on/off
   ├─> Add sales notes
   └─> Review proposal summary

5. Share → Export or send
   ├─> Download HTML proposal
   └─> Share via WhatsApp with sales team (+91 909 115 6095)
```

---

## 🛠️ Tech Stack & Architecture

### Frontend
**Framework**: Next.js 15.2 (Pages Router)  
**Language**: TypeScript 5.0  
**Styling**: Tailwind CSS v4  
**Icons**: Lucide React  
**Notifications**: React Hot Toast  

### Backend
**AI**: Google Gemini API (gemini-2.0-flash-exp)  
**Storage**: localStorage (MVP) - **Ready for Supabase migration**  
**File Parsing**: pdf-parse, mammoth (DOCX), formidable  
**Validation**: Zod schemas  

### Key Directories

```
cehpoint/
├── pages/
│   ├── index.tsx              # Sign-in/Sign-up page
│   ├── login.tsx              # Authentication (localStorage)
│   ├── discovery.tsx          # Upload or questionnaire choice
│   ├── questionnaire.tsx      # 7-section smart questionnaire
│   ├── dashboard.tsx          # Recommendations & proposal customization
│   └── api/
│       ├── analyze-profile.ts      # Gemini analysis of questionnaire
│       ├── analyze-document.ts     # Gemini analysis of uploaded docs
│       ├── parse-file.ts           # File parsing (PDF/DOCX/TXT)
│       ├── fetch-url.ts            # URL content extraction
│       └── get-live-suggestions.ts # Real-time AI suggestions
├── lib/
│   ├── gemini.ts              # Gemini API integration
│   ├── storage.ts             # Session/user management (localStorage)
│   ├── validation.ts          # Zod schemas for data validation
│   ├── proposalGenerator.ts  # HTML proposal generation & WhatsApp
│   ├── env-validation.ts      # Environment variable validation
│   ├── auth-helpers.ts        # (Commented) Supabase auth helpers
│   └── supabase.ts.example    # (Example) Supabase client setup
├── components/
│   ├── Button.tsx             # Reusable button with variants
│   ├── Card.tsx               # Card container with hover effects
│   ├── Input.tsx              # Form input with label
│   ├── Select.tsx             # Dropdown select
│   ├── MultiSelect.tsx        # Multi-select dropdown
│   ├── Loading.tsx            # Loading indicator
│   └── ErrorBoundary.tsx      # Error handling component
├── types/
│   └── index.ts               # TypeScript interfaces
└── styles/
    └── globals.css            # Tailwind CSS imports
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or 20+
- Google Gemini API key ([Get one here](https://ai.google.dev))

### Installation

```bash
# Clone repository
git clone <repository-url>
cd cehpoint

# Install dependencies
npm install

# Set environment variable
echo "GEMINI_API_KEY=your_gemini_api_key" > .env.local

# Run development server
npm run dev
```

Visit `http://localhost:5000`

---

## 🔐 Environment Variables

Create a `.env.local` file:

```env
# Required
GEMINI_API_KEY=your_gemini_api_key_here

# Optional (for future Supabase integration)
# NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
# SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**Security Notes:**
- Never commit `.env.local` to Git (already in `.gitignore`)
- `NEXT_PUBLIC_*` variables are exposed to browser
- `SUPABASE_SERVICE_ROLE_KEY` should ONLY be used in API routes

---

## 🚢 Deployment to Vercel

### Step 1: Connect Repository
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your Git repository

### Step 2: Configure Build Settings
```
Framework Preset: Next.js
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

### Step 3: Set Environment Variables
In Vercel Dashboard → Settings → Environment Variables:

```
GEMINI_API_KEY=your_actual_gemini_api_key
```

**Important:** Add for all environments (Production, Preview, Development)

### Step 4: Deploy
1. Click "Deploy"
2. Wait ~2-3 minutes for build
3. Verify deployment is successful

### Pre-Deployment Checklist

#### Code Quality
- [x] Run `npm run build` locally and verify success
- [x] Run `npm run lint` and fix any errors
- [x] Remove all `console.log` statements
- [x] Verify TypeScript types are correct

#### Environment Variables
- [ ] `GEMINI_API_KEY` is set in Vercel
- [ ] Test API routes catch missing variables
- [ ] No secrets hardcoded in codebase

#### Feature Testing
- [ ] Landing page loads correctly
- [ ] Login/signup flow works
- [ ] Discovery page directs to questionnaire
- [ ] Questionnaire has all 7 sections
- [ ] AI analysis generates recommendations
- [ ] Dashboard displays recommendations
- [ ] Download proposal works
- [ ] WhatsApp sharing works

#### Performance
- [ ] Images are optimized
- [ ] Bundle size < 500KB initial load
- [ ] Lighthouse Performance score > 80

#### Browser Compatibility
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Post-Deployment

**Monitor for 48 hours:**
- Check Vercel Function logs for errors
- Test complete user flow on production URL
- Verify mobile experience
- Monitor Gemini API quota

**Success Criteria:**
- ✅ Build completes without errors
- ✅ All pages load correctly
- ✅ AI analysis generates recommendations
- ✅ No console errors
- ✅ Mobile experience is smooth

---

## 📱 Sales Team Playbook

### How Sales Teams Use the Platform

#### 1. **Access the Platform**
- Visit your deployed URL (e.g., `https://cehpoint.vercel.app`)
- Sign in with your email (localStorage-based for MVP)
- You'll land on the discovery page

#### 2. **Start a New Client Proposal**
- Click **"New Client Proposal"** button (top-right) to start fresh
- This clears previous data and begins new session

#### 3. **Collect Client Information**

**Option A: Upload Business Profile**
- Click "Upload Business Profile"
- Upload client's company profile (PDF, DOCX, TXT)
- AI extracts business details automatically
- Review auto-filled questionnaire and fill missing fields

**Option B: Manual Questionnaire**
- Click "Complete Business Questionnaire"
- Fill 7 sections (auto-saves every change):
  1. Business Information
  2. Current Operations & Processes
  3. Technology Status
  4. Business Goals & Vision
  5. Challenges & Blockers
  6. Industry-Specific Data
  7. Project Requirements

#### 4. **Generate AI Recommendations**
- Click "Submit & Generate Recommendations"
- Wait ~30 seconds for Gemini AI analysis
- Dashboard displays 6-12 personalized solutions

#### 5. **Customize the Proposal**

**Enable Customization Mode:**
- Click **"Customize Proposal"** button

**Add Sales Notes:**
- Enter personalized message in "Sales Notes" textarea
- Example: "Hi [Client], based on our discussion, these solutions will help you achieve [specific goal]"

**Toggle Recommendations:**
- Check/uncheck boxes on each recommendation card
- Excluded solutions show in "Proposal Summary" section
- Click "Re-include" to add them back

**Proposal Summary Shows:**
- Total solutions selected (e.g., "8 of 12 solutions selected")
- List of excluded solutions with re-include buttons

#### 6. **Share with Client**

**Download HTML Proposal:**
- Click **"Download Proposal"** button
- Opens comprehensive HTML file in browser
- Client can print to PDF or save
- Includes all selected recommendations, pricing, timeline, blueprint

**Share via WhatsApp:**
- Click **"Share via WhatsApp"** button
- Opens WhatsApp with pre-filled message
- Message includes company name, solution count, sales notes
- Sends to Cehpoint sales team: +91 909 115 6095

### Sales Team Contact Information

**Phone/WhatsApp:** +91 909 115 6095  
**Email:** sales@cehpoint.co.in  
**Website:** cehpoint.co.in  
**Portfolio:** https://portfolios.cehpoint.co.in/

---

## 💻 Development

### Local Development

```bash
# Install dependencies
npm install

# Run dev server (port 5000)
npm run dev

# Build for production
npm run build

# Run production build locally
npm start

# Lint code
npm run lint
```

### Key Scripts

```json
{
  "dev": "next dev -p 5000 -H 0.0.0.0",
  "build": "next build",
  "start": "next start -p 5000 -H 0.0.0.0",
  "lint": "next lint"
}
```

### Important Development Notes

1. **Port Configuration**: Always use port 5000 for Replit compatibility
2. **Hostname**: `0.0.0.0` for public access in cloud environments
3. **Auto-Save**: Questionnaire auto-saves every change to localStorage
4. **Session Persistence**: User sessions persist across page refreshes
5. **File Upload Limits**: 
   - Max file size: 10MB
   - Max content size: 500KB (after parsing)
   - Supported formats: PDF, DOCX, TXT

### Code Conventions

- **TypeScript**: Strict mode enabled, minimize `any` types
- **Components**: Functional components with TypeScript interfaces
- **Styling**: Tailwind CSS utility classes (no custom CSS files)
- **Error Handling**: Try/catch blocks with user-friendly toast notifications
- **Validation**: Zod schemas for all API request/response data

---

## 🔮 Future Roadmap

### Supabase Backend Integration

**Why Migrate?**
- Real user authentication with email/password
- Persistent database storage (multi-device support)
- Historical data retention
- Row-level security
- Production-ready scalability

**Migration Steps:**

1. **Set Up Supabase Project**
   - Create project at [supabase.com](https://supabase.com)
   - Run database schema (see below)
   - Configure authentication

2. **Install Dependencies**
   ```bash
   npm install @supabase/supabase-js
   ```

3. **Add Environment Variables**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

4. **Activate Backend Code**
   - Rename `lib/supabase.ts.example` to `lib/supabase.ts`
   - Uncomment Supabase imports in:
     - `lib/storage.ts`
     - `pages/api/analyze-profile.ts`
     - `pages/login.tsx`
     - `pages/questionnaire.tsx`
     - `pages/dashboard.tsx`

5. **Database Schema** (Run in Supabase SQL Editor)

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  company_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Questionnaire submissions table
CREATE TABLE public.questionnaire_submissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  company_name TEXT NOT NULL,
  industry TEXT NOT NULL,
  business_model TEXT NOT NULL,
  team_size TEXT NOT NULL,
  operating_regions TEXT[] NOT NULL,
  -- Add all questionnaire fields here
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Recommendations table
CREATE TABLE public.ai_recommendations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  submission_id UUID REFERENCES questionnaire_submissions(id) NOT NULL,
  recommendations JSONB NOT NULL,
  project_blueprint JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questionnaire_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_recommendations ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Users can only access their own data)
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can view own submissions"
  ON public.questionnaire_submissions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own recommendations"
  ON public.ai_recommendations FOR SELECT
  USING (auth.uid() = user_id);
```

6. **Test Migration**
   - Test sign up/sign in
   - Fill questionnaire and verify database save
   - Generate recommendations and check persistence
   - Log out and log back in to verify data persists

### Additional Enhancements
- Email notifications for new proposals
- PDF export with custom branding
- Admin dashboard for analytics
- Advanced reporting and insights
- Integration with CRM systems
- Real-time collaboration features

---

## 🆘 Support

### Common Issues

**Build fails on Vercel**
```
Solution:
- Check build logs in Vercel dashboard
- Verify all dependencies are in package.json
- Ensure GEMINI_API_KEY environment variable is set
- Check for TypeScript errors
```

**API routes return 500**
```
Solution:
- Check Vercel Function logs
- Verify GEMINI_API_KEY is correctly set
- Check Gemini API quota at ai.google.dev
- Review API route error handling
```

**Blank page after deployment**
```
Solution:
- Check browser console for JavaScript errors
- Verify all assets are loading correctly
- Check Network tab for failed requests
- Ensure environment variables are set
```

**Recommendations not generating**
```
Solution:
- Verify Gemini API key is valid
- Check API quota hasn't been exceeded
- Review browser console for errors
- Try with different questionnaire data
```

### Debugging Tools
1. **Vercel Dashboard** → Deployments → Build Logs
2. **Vercel Dashboard** → Functions → Real-time Logs
3. **Browser DevTools** → Console
4. **Browser DevTools** → Network tab

### Contact

**Email:** sales@cehpoint.co.in  
**Phone:** +91 909 115 6095  
**Website:** https://cehpoint.co.in

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🙏 Acknowledgments

- **Google Gemini AI** - AI-powered recommendation engine
- **Next.js Team** - React framework
- **Vercel** - Deployment platform
- **Tailwind CSS** - Styling framework

---

**Built with ❤️ by Cehpoint**  
*Serving 500+ clients across 40+ countries*
