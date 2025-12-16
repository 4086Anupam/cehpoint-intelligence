# Cehpoint - AI-Powered Sales Platform

## Overview

Cehpoint is a sales-focused proposal generation platform that transforms client onboarding into instant, customizable proposals powered by Google Gemini AI. Sales teams can upload client business profiles or use a comprehensive questionnaire to generate AI-powered technology recommendations, customize proposals, and export professional HTML documents or share via WhatsApp.

**Target Users:** Sales teams conducting client meetings  
**Primary Goal:** Accelerate the sales process by automating proposal generation and customization

## Recent Updates (November 17, 2025)

### Production-Ready Cleanup ✅
- Consolidated all documentation into comprehensive README.md
- Fixed all ESLint errors (unescaped quotes/apostrophes)
- Removed unused files (DEPLOYMENT.md, SUPABASE_INTEGRATION.md, styles/Home.module.css)
- Verified production build succeeds with no errors
- Kept Supabase scaffolding (auth-helpers.ts, supabase.ts.example) for future backend integration
- Added detailed sales team access instructions in README.md

### Sales Platform Features ✅
- New Client Proposal button for easy client switching
- Customization mode with recommendation toggles
- Sales notes textarea with persistence
- Proposal summary showing included/excluded solutions
- Professional HTML export with sales notes
- WhatsApp sharing with personalized messages
- Cross-category exclusion management (re-include buttons)

## System Architecture

### Frontend Architecture

**Framework:** Next.js 15.2 with TypeScript and React 19
- **Pages Router:** Traditional Next.js routing for simplicity
- **Component Structure:** Reusable UI components (Button, Card, Input, Select, MultiSelect)
- **State Management:** React hooks (useState, useEffect) with localStorage for MVP
- **Styling:** Tailwind CSS 4.0 with custom theme configuration
- **Error Handling:** ErrorBoundary component for graceful error display

**Key Pages:**
- `/` - Sign-in/sign-up interface
- `/discovery` - File upload or questionnaire selection
- `/questionnaire` - Multi-step form with 7 sections
- `/dashboard` - AI-generated recommendations with customization tools

### Backend Architecture

**Current State (MVP):** Serverless API routes with localStorage
- **Data Storage:** Browser localStorage for sessions and recommendations
- **API Routes:** Next.js API routes for file parsing, AI analysis, document generation
- **File Processing:** Server-side parsing for PDF (pdf-parse), DOCX (mammoth), TXT

**Migration Path to Supabase:**
- Placeholder functions in `lib/auth-helpers.ts` (commented)
- Example Supabase client in `lib/supabase.ts.example`
- TODO comments throughout codebase indicating integration points
- Full migration guide in README.md "Future Roadmap" section

### AI Integration (Google Gemini)

**Primary Service:** Google Gemini AI via `@google/genai` SDK

**Core AI Functions:**
1. **Document Analysis** (`/api/analyze-document`): Extracts business information from uploaded files
2. **Profile Analysis** (`/api/analyze-profile`): Generates 6-12 technology recommendations
3. **Live Suggestions** (`/api/get-live-suggestions`): Real-time suggestions during questionnaire

**AI Prompt Strategy:**
- Structured prompts with clear role definition
- Rich business context injection
- Category-based recommendations (6 categories)
- Detailed output requirements (ROI, timelines, costs ₹10K-₹95K range)

**Response Validation:** Zod schemas validate all AI responses

### Data Validation & Type Safety

**Validation Library:** Zod for runtime type checking
- `BusinessProfileSchema`: Validates 30+ business profile fields
- `ServiceRecommendationSchema`: Ensures required recommendation fields
- `GeminiAnalysisResponseSchema`: Validates complete AI responses

**TypeScript Types:** Comprehensive interfaces in `types/index.ts`

### Proposal Generation

**HTML Export:** Server-side HTML generation with embedded CSS
- Professional styling with gradients and modern typography
- Responsive design for all devices
- Sections: Executive Summary, Recommendations, Blueprint, Costs

**WhatsApp Sharing:** URL-encoded messages with proposal summaries

### Environment Configuration

**Required Variables:**
- `GEMINI_API_KEY`: Google Gemini API authentication

**Validation:** `lib/env-validation.ts` validates required variables on API execution

## Sales Team Access Instructions

### How to Access Your Features

1. **Sign In**
   - Visit your Cehpoint platform URL
   - Enter your email to access
   - Click "New Client Proposal" to start fresh session

2. **Collect Client Data**
   - **Option A:** Upload client's business profile document (PDF/DOCX/TXT)
   - **Option B:** Fill 7-section questionnaire (auto-saves)

3. **Generate Recommendations**
   - Click "Submit & Generate Recommendations"
   - Wait ~30 seconds for AI analysis

4. **Customize Proposal**
   - Click "Customize Proposal" button
   - Add personalized sales notes
   - Toggle recommendations on/off using checkboxes
   - View proposal summary (shows included/excluded count)

5. **Share with Client**
   - **Download:** Click "Download Proposal" for HTML file (can print to PDF)
   - **WhatsApp:** Click "Share via WhatsApp" for instant messaging

### Contact Information

**Sales Team:** +91 909 115 6095  
**Email:** sales@cehpoint.co.in  
**Portfolio:** https://portfolios.cehpoint.co.in/

## External Dependencies

### AI Services
- **Google Gemini AI** (`@google/genai` v1.29.1)
- Requires `GEMINI_API_KEY` environment variable

### File Processing
- **pdf-parse** (v2.4.5): PDF text extraction
- **mammoth** (v1.11.0): DOCX to text conversion
- **formidable** (v3.5.4): File upload handling

### UI & Styling
- **Tailwind CSS** (v4.0.15): Utility-first CSS
- **lucide-react** (v0.553.0): Icon library
- **react-hot-toast** (v2.6.0): Toast notifications

### Validation & Type Safety
- **Zod** (v4.1.12): Runtime schema validation
- **TypeScript** (v5.8.2): Static type checking

### Future Database (Ready for Integration)
- **Supabase**: Planned database and authentication
  - Migration guide in README.md
  - `lib/supabase.ts.example` template ready
  - Environment variable placeholders documented

## Deployment

**Platform:** Vercel (configured via `vercel.json`)  
**Build Command:** `npm run build`  
**Framework:** Next.js (autoscale deployment)

See README.md for complete deployment checklist and instructions.
