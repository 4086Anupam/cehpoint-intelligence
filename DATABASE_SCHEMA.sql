-- Analysis History Database Schema for Supabase
-- Run this SQL in your Supabase SQL Editor (Dashboard > SQL Editor)

-- 1. Create analysis_history table to store all profile analysis data
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

-- 2. Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_analysis_history_user_id ON public.analysis_history(user_id);
CREATE INDEX IF NOT EXISTS idx_analysis_history_created_at ON public.analysis_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analysis_history_company_name ON public.analysis_history(company_name);
CREATE INDEX IF NOT EXISTS idx_analysis_history_status ON public.analysis_history(status);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.analysis_history ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS policies
-- Policy: Users can only view their own analysis history
CREATE POLICY "Users can view own analysis history"
  ON public.analysis_history
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own analysis history
CREATE POLICY "Users can insert own analysis history"
  ON public.analysis_history
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own analysis history
CREATE POLICY "Users can update own analysis history"
  ON public.analysis_history
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own analysis history
CREATE POLICY "Users can delete own analysis history"
  ON public.analysis_history
  FOR DELETE
  USING (auth.uid() = user_id);

-- 5. Create function to auto-update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Create trigger for auto-updating updated_at
DROP TRIGGER IF EXISTS set_updated_at ON public.analysis_history;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.analysis_history
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 7. Grant permissions (service role already has full access)
GRANT ALL ON public.analysis_history TO authenticated;
GRANT ALL ON public.analysis_history TO service_role;
