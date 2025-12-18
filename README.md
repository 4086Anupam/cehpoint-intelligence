# Cehpoint - AI-Powered Sales Platform for Technology Solutions

> Transform client onboarding into instant, customizable proposals powered by Google Gemini AI

[![Next.js](https://img.shields.io/badge/Next.js-15.2-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Integration-blue)](https://cloudinary.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green)](https://supabase.com/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

---

## 📋 Table of Contents

- [Executive Summary](#executive-summary)
- [Key Features](#key-features)
- [Performance & Optimization](#performance--optimization)
- [User Flow](#user-flow)
- [Tech Stack & Architecture](#tech-stack--architecture)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [Sales Team Playbook](#sales-team-playbook)
- [Development](#development)
- [Roadmap](#roadmap)
- [Support](#support)

---

## 🎯 Executive Summary

Cehpoint is a **sales-focused proposal generation platform** that enables sales teams to:
- **Intelligently Parse Data**: Extract business profiles from uploaded PDFs (stored via Cloudinary) or manual input.
- **Generate AI Recommendations**: Use Google Gemini to analyze business data and suggest technology solutions.
- **Track & Manage**: Store history and interactions Using Supabase.
- **Efficiently Operate**: Optimized for minimal API usage through smart caching and strategic triggers.

**Built:** November 2025  
**Status:** Production-ready MVP  
**Target Users:** Sales teams conducting client meetings

---

## ✨ Key Features

### 1. **Advanced Data Parsing & Analysis**
- **PDF Extraction**: Automated extraction of business details from uploaded PDF documents.
- **Secure Storage**: Integrated **Cloudinary** for secure, scalable storage of parsed PDF documents.
- **Manual Input Analysis**: Robust analysis engine for manually entered questionnaire data.

### 2. **AI-Powered Recommendations** (Google Gemini)
- Analyzes business challenges, goals, and technology status.
- Generates 6-12 personalized recommendations across 6 categories.
- Creates detailed project blueprints with phases, deliverables, and cost estimates.

### 3. **Smart History & Tracking**
- **Supabase Integration**: Robust real-time database to store and track proposal history.
- **Session Management**: maintain user context across sessions.

### 4. **Sales Platform Features**
- **Customization Mode**: Toggle recommendations on/off.
- **Sales Notes**: Add personalized messages.
- **WhatsApp Integration**: Share proposals instantly with pre-filled messages.
- **Professional Exports**: Download comprehensive HTML proposals.

---

## 🚀 Performance & Optimization

We have implemented improved strategies to minimize costs and maximize efficiency:

### **1. Efficient "Live Suggestions"**
- **Strategy**: Instead of making expensive AI API calls on every form field change (`onChange`), suggestions are triggered only on **"Next" button clicks**.
- **Benefit**: Drastically reduces unnecessary API usage while still providing "live" feel during step transitions.

### **2. Smart Caching System**
- **Strategy**: Analyzed data and recommendations are cached locally (`localStorage`) and recognized upon return.
- **Benefit**: Eliminates redundant API calls for the same client data. If a user leaves and comes back, the data is loaded from cache instantly without costing a token.

---

## 🔄 User Flow

### For Sales Teams:

```
1. Sign In → Access platform
   └─> Click "New Client Proposal" to start fresh session

2. Discovery → Choose data input method
   ├─> Upload business profile (Parsed & stored via Cloudinary)
   └─> Fill questionnaire (7 sections)

3. Analysis → AI processes with Gemini (On-Demand)
   └─> Caches results locally for instant access

4. Dashboard → Customize proposal
   ├─> Toggle recommendations on/off
   ├─> Add sales notes
   └─> Review proposal summary

5. Share & Track
   ├─> Export as HTML
   ├─> Share via WhatsApp
   └─> History saved to Supabase
```

---

## 🛠️ Tech Stack & Architecture

### Backend & Infrastructure
- **AI**: Google Gemini API (gemini-2.0-flash-exp)
- **Database**: **Supabase** (PostgreSQL) - History & User Tracking
- **Storage**: **Cloudinary** - PDF/Document Storage
- **File Parsing**: pdf-parse, mammoth (DOCX), formidable

### Frontend
- **Framework**: Next.js 15.2 (Pages Router)
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS v4
- **State/Cache**: LocalStorage + React Hooks

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or 20+
- Google Gemini API key
- Supabase Project Credentials
- Cloudinary Cloud Name & Keys

### Installation

```bash
# Clone repository
git clone <repository-url>
cd cehpoint

# Install dependencies
npm install

# Set environment variable
# Create .env.local with Gemini, Supabase, and Cloudinary keys
```

### Running Locally
```bash
npm run dev
```

Visit `http://localhost:5000`

---

## 🔐 Environment Variables

Create a `.env.local` file:

```env
# AI Service
GEMINI_API_KEY=your_gemini_api_key_here

# Database (Supabase)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Storage (Cloudinary)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 📱 Sales Team Playbook

### How Sales Teams Use the Platform

#### 1. **Access the Platform**
- Visit your deployed URL
- Sign in to access your dashboard

#### 2. **Start a New Client Proposal**
- Click **"New Client Proposal"** (top-right)
- This clears previous session cache to ensure clean data

#### 3. **Collect Client Information**
- **Upload**: Upload PDF (Automatically parsed & stored in Cloudinary)
- **Manual**: Fill the 7-section questionnaire. *Note: AI suggestions run when you click Next.*

#### 4. **Generate & Customize**
- Submit to generate recommendations (Cached automatically)
- Use **Customization Mode** to refine the proposal
- Add custom sales notes

#### 5. **Share**
- **Download**: Get the professional HTML file
- **WhatsApp**: Click to share instantly (+91 909 115 6095)

---

## 💻 Development & Commands

```json
{
  "dev": "next dev -p 5000 -H 0.0.0.0",
  "build": "next build",
  "start": "next start -p 5000 -H 0.0.0.0",
  "lint": "next lint"
}
```

---

## 🔮 Roadmap

- [x] **PDF Parsing**: Automated extraction
- [x] **Manual Analysis**: Questionnaire support
- [x] **Cost Optimization**: Smart caching & efficiently triggers
- [x] **History Tracking**: Supabase integration
- [ ] **Advanced Analytics**: Admin dashboard for sales performance
- [ ] **CRM Integration**: Direct connection to Salesforce/HubSpot

---

## 🆘 Support

**Email:** sales@cehpoint.co.in  
**Phone:** +91 909 115 6095  
**Website:** https://cehpoint.co.in

---

**Built with ❤️ by Cehpoint**
