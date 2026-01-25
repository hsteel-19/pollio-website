-- Migration: Add 'welcome' to slide_type enum
-- Run this in Supabase SQL Editor if your database already exists

-- Add 'welcome' as the first value in the enum (before other types)
ALTER TYPE slide_type ADD VALUE IF NOT EXISTS 'welcome' BEFORE 'multiple_choice';
