-- Make sure the news table has all required fields
ALTER TABLE news 
ADD COLUMN IF NOT EXISTS slug TEXT,
ADD COLUMN IF NOT EXISTS excerpt TEXT,
ADD COLUMN IF NOT EXISTS author TEXT;

-- Make sure existing slugs are valid and lowercase
UPDATE news
SET slug = LOWER(REGEXP_REPLACE(
    REGEXP_REPLACE(
        REGEXP_REPLACE(slug, '[^a-zA-Z0-9\s-]', '', 'g'),
        '\s+', '-', 'g'),
    '-+', '-', 'g'))
WHERE slug IS NOT NULL AND slug != '';

-- Replace NULL slugs with IDs (temporary solution)
UPDATE news
SET slug = id::text
WHERE slug IS NULL OR slug = '';

-- Create a unique index on the slug 
DROP INDEX IF EXISTS news_slug_idx;
CREATE UNIQUE INDEX news_slug_idx ON news (slug);

-- Create a trigger to ensure slugs are unique upon insert/update
CREATE OR REPLACE FUNCTION ensure_unique_slug()
RETURNS TRIGGER AS $$
DECLARE
    base_slug TEXT;
    new_slug TEXT;
    counter INTEGER;
BEGIN
    -- If no slug is provided, use the ID
    IF NEW.slug IS NULL OR NEW.slug = '' THEN
        NEW.slug := NEW.id;
        RETURN NEW;
    END IF;
    
    -- Clean up provided slug
    NEW.slug := LOWER(REGEXP_REPLACE(
        REGEXP_REPLACE(
            REGEXP_REPLACE(NEW.slug, '[^a-zA-Z0-9\s-]', '', 'g'),
            '\s+', '-', 'g'),
        '-+', '-', 'g'));
    
    -- Save the base slug
    base_slug := NEW.slug;
    
    -- Check if this slug already exists (excluding the current record if it's an update)
    counter := 1;
    WHILE EXISTS (
        SELECT 1 FROM news 
        WHERE slug = NEW.slug 
        AND id != NEW.id
    ) LOOP
        -- Append counter to create unique slug
        NEW.slug := base_slug || '-' || counter;
        counter := counter + 1;
    END LOOP;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS news_slug_trigger ON news;

-- Create the trigger
CREATE TRIGGER news_slug_trigger
BEFORE INSERT OR UPDATE ON news
FOR EACH ROW
EXECUTE FUNCTION ensure_unique_slug();

-- Drop the policies if they exist
DROP POLICY IF EXISTS "Allow authenticated delete" ON news;
DROP POLICY IF EXISTS "Allow public read access" ON news;

-- Create policies for the news table
CREATE POLICY "Allow authenticated delete" ON news
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public read access" ON news
  FOR SELECT USING (true);

-- Enable RLS if not already enabled
ALTER TABLE news ENABLE ROW LEVEL SECURITY; 