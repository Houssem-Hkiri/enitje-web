-- SQL script to add category column to the news table
-- Run this in the Supabase SQL Editor if the category column is missing

-- Check if the column already exists before adding it
DO $$
BEGIN
    -- Check if the column exists
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'news'
        AND column_name = 'category'
    ) THEN
        -- Add the column with a default value of 'News'
        ALTER TABLE news
        ADD COLUMN category TEXT NOT NULL DEFAULT 'News';
        
        RAISE NOTICE 'Added category column to news table';
    ELSE
        RAISE NOTICE 'category column already exists in news table';
    END IF;
END
$$; 