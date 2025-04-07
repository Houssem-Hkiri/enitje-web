-- Setup for news table
CREATE TABLE IF NOT EXISTS news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL, -- Supports HTML formatting for rich text presentation
  image_url TEXT NOT NULL,
  slug TEXT UNIQUE,
  excerpt TEXT,
  author TEXT,
  category TEXT NOT NULL,
  publication_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Setup for projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  client TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  slug TEXT UNIQUE,
  content TEXT,
  technologies TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Setup for gallery table
CREATE TABLE IF NOT EXISTS gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create function for updating timestamps
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add update timestamp trigger to news
DROP TRIGGER IF EXISTS set_news_timestamp ON news;
CREATE TRIGGER set_news_timestamp
BEFORE UPDATE ON news
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Add update timestamp trigger to projects
DROP TRIGGER IF EXISTS set_projects_timestamp ON projects;
CREATE TRIGGER set_projects_timestamp
BEFORE UPDATE ON projects
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Add update timestamp trigger to gallery
DROP TRIGGER IF EXISTS set_gallery_timestamp ON gallery;
CREATE TRIGGER set_gallery_timestamp
BEFORE UPDATE ON gallery
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Create function for ensuring unique slugs for news
CREATE OR REPLACE FUNCTION ensure_unique_news_slug()
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

-- Create function for ensuring unique slugs for projects
CREATE OR REPLACE FUNCTION ensure_unique_project_slug()
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
        SELECT 1 FROM projects 
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

-- Add slug trigger to news
DROP TRIGGER IF EXISTS news_slug_trigger ON news;
CREATE TRIGGER news_slug_trigger
BEFORE INSERT OR UPDATE ON news
FOR EACH ROW
EXECUTE FUNCTION ensure_unique_news_slug();

-- Add slug trigger to projects
DROP TRIGGER IF EXISTS projects_slug_trigger ON projects;
CREATE TRIGGER projects_slug_trigger
BEFORE INSERT OR UPDATE ON projects
FOR EACH ROW
EXECUTE FUNCTION ensure_unique_project_slug();

-- Create indexes
CREATE INDEX IF NOT EXISTS news_created_at_idx ON news (created_at DESC);
CREATE INDEX IF NOT EXISTS projects_created_at_idx ON projects (created_at DESC);
CREATE INDEX IF NOT EXISTS gallery_created_at_idx ON gallery (created_at DESC);
CREATE INDEX IF NOT EXISTS news_category_idx ON news (category);
CREATE INDEX IF NOT EXISTS projects_category_idx ON projects (category);

-- Setup Row Level Security
-- Enable RLS on all tables
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies
DROP POLICY IF EXISTS "Allow authenticated delete" ON news;
DROP POLICY IF EXISTS "Allow public read access" ON news;
DROP POLICY IF EXISTS "Allow authenticated insert" ON news;
DROP POLICY IF EXISTS "Allow authenticated update" ON news;

DROP POLICY IF EXISTS "Allow authenticated delete" ON projects;
DROP POLICY IF EXISTS "Allow public read access" ON projects;
DROP POLICY IF EXISTS "Allow authenticated insert" ON projects;
DROP POLICY IF EXISTS "Allow authenticated update" ON projects;

DROP POLICY IF EXISTS "Allow authenticated delete" ON gallery;
DROP POLICY IF EXISTS "Allow public read access" ON gallery;
DROP POLICY IF EXISTS "Allow authenticated insert" ON gallery;
DROP POLICY IF EXISTS "Allow authenticated update" ON gallery;

-- Create policies for news
CREATE POLICY "Allow authenticated delete" ON news FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow public read access" ON news FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert" ON news FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update" ON news FOR UPDATE USING (auth.role() = 'authenticated');

-- Create policies for projects
CREATE POLICY "Allow authenticated delete" ON projects FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow public read access" ON projects FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert" ON projects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update" ON projects FOR UPDATE USING (auth.role() = 'authenticated');

-- Create policies for gallery
CREATE POLICY "Allow authenticated delete" ON gallery FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow public read access" ON gallery FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert" ON gallery FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update" ON gallery FOR UPDATE USING (auth.role() = 'authenticated');

-- Storage permissions
INSERT INTO storage.buckets (id, name) 
VALUES ('images', 'images')
ON CONFLICT (id) DO NOTHING;

-- Allow public access to images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');

-- Allow authenticated users to insert images
CREATE POLICY "Authenticated Users Can Upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');

-- Allow authenticated users to update their own images
CREATE POLICY "Authenticated Users Can Update Their Own Images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'images' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete images
CREATE POLICY "Authenticated Users Can Delete Images"
ON storage.objects FOR DELETE
USING (bucket_id = 'images' AND auth.role() = 'authenticated'); 