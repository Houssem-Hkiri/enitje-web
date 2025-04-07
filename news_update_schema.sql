-- Make sure the news table has all required fields
ALTER TABLE news 
ADD COLUMN IF NOT EXISTS slug TEXT,
ADD COLUMN IF NOT EXISTS excerpt TEXT,
ADD COLUMN IF NOT EXISTS author TEXT;

-- Create a unique index on the slug to ensure URLs are unique
CREATE UNIQUE INDEX IF NOT EXISTS news_slug_idx ON news (slug);

-- Update existing records to have a slug if they don't already
UPDATE news
SET slug = LOWER(REGEXP_REPLACE(
    REGEXP_REPLACE(
        REGEXP_REPLACE(title, '[^a-zA-Z0-9\s-]', '', 'g'),
        '\s+', '-', 'g'),
    '-+', '-', 'g'))
WHERE slug IS NULL OR slug = '';

-- Create delete policy for news articles (if not already exists)
CREATE POLICY IF NOT EXISTS "Allow authenticated delete" ON news
  FOR DELETE USING (auth.role() = 'authenticated');

-- Enable RLS if not already enabled
ALTER TABLE news ENABLE ROW LEVEL SECURITY; 