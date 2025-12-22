-- Migration: Fix search_path security warning in update_updated_at_column function
-- This fixes the "Function Search Path Mutable" security warning from Supabase Security Advisor

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

