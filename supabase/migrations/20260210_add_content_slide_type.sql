-- Migration: Add 'content' to slide_type enum
-- Run this in Supabase SQL Editor

ALTER TYPE slide_type ADD VALUE IF NOT EXISTS 'content' AFTER 'welcome';
