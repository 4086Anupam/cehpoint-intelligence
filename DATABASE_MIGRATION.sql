-- Migration: Add status and parsed_data columns to analysis_history
-- Run this SQL if you already have the analysis_history table

-- Add new columns
ALTER TABLE public.analysis_history 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed'));

ALTER TABLE public.analysis_history 
ADD COLUMN IF NOT EXISTS parsed_data JSONB;

ALTER TABLE public.analysis_history 
ADD COLUMN IF NOT EXISTS error_message TEXT;

-- Make business_profile nullable (for pending records)
ALTER TABLE public.analysis_history 
ALTER COLUMN business_profile DROP NOT NULL;

-- Make recommendations nullable (for pending records)
ALTER TABLE public.analysis_history 
ALTER COLUMN recommendations DROP NOT NULL;

-- Create index for status
CREATE INDEX IF NOT EXISTS idx_analysis_history_status ON public.analysis_history(status);

-- Update existing records to have 'completed' status
UPDATE public.analysis_history SET status = 'completed' WHERE status IS NULL;
