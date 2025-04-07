-- SQL script to add publication_date column to the news table
-- Run this in the Supabase SQL Editor to fix the missing column issue

-- Check if the column already exists before adding it
DO $$
BEGIN
    -- Check if the column exists
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'news'
        AND column_name = 'publication_date'
    ) THEN
        -- Add the column with a default value of the current date
        ALTER TABLE news
        ADD COLUMN publication_date DATE NOT NULL DEFAULT CURRENT_DATE;
        
        -- Update existing records to use their creation date as publication date
        UPDATE news 
        SET publication_date = created_at::DATE;
        
        RAISE NOTICE 'Added publication_date column to news table';
    ELSE
        RAISE NOTICE 'publication_date column already exists in news table';
    END IF;
END
$$; 