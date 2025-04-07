-- Create site_settings table for storing configuration values
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up RLS policies
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Only authenticated users can view settings
CREATE POLICY "Authenticated users can view settings"
  ON site_settings
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Only authenticated users can insert/update settings
CREATE POLICY "Authenticated users can insert settings"
  ON site_settings
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update settings"
  ON site_settings
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Create a trigger to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON site_settings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Insert default Google Analytics ID if it doesn't exist
INSERT INTO site_settings (key, value)
VALUES ('google_analytics_id', '')
ON CONFLICT (key) DO NOTHING;

-- Grant permissions
GRANT ALL ON TABLE site_settings TO authenticated;
GRANT ALL ON TABLE site_settings TO service_role;

-- Create page_views table to store analytics data
CREATE TABLE IF NOT EXISTS page_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_path TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  ip_address TEXT,
  country TEXT,
  city TEXT,
  device_type TEXT,
  browser TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create a function to clean old page views (optional, for data retention)
CREATE OR REPLACE FUNCTION clean_old_page_views()
RETURNS VOID AS $$
BEGIN
  -- Delete page views older than 1 year
  DELETE FROM page_views 
  WHERE created_at < now() - INTERVAL '1 year';
END;
$$ LANGUAGE plpgsql;

-- Create conversions table to track goals
CREATE TABLE IF NOT EXISTS conversions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL, -- e.g., 'contact', 'newsletter', 'download'
  page_path TEXT,
  referrer TEXT,
  user_agent TEXT,
  ip_address TEXT,
  country TEXT,
  city TEXT,
  value DECIMAL(10, 2), -- Optional monetary value
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create a function to record a page view
CREATE OR REPLACE FUNCTION record_page_view(
  page_path TEXT, 
  referrer TEXT DEFAULT NULL,
  user_agent TEXT DEFAULT NULL,
  ip_address TEXT DEFAULT NULL,
  country TEXT DEFAULT NULL,
  city TEXT DEFAULT NULL,
  device_type TEXT DEFAULT NULL,
  browser TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  new_id UUID;
BEGIN
  INSERT INTO page_views (
    page_path, 
    referrer, 
    user_agent, 
    ip_address, 
    country, 
    city, 
    device_type, 
    browser
  )
  VALUES (
    page_path, 
    referrer, 
    user_agent, 
    ip_address, 
    country, 
    city, 
    device_type, 
    browser
  )
  RETURNING id INTO new_id;
  
  RETURN new_id;
END;
$$ LANGUAGE plpgsql;

-- Create a function to record a conversion
CREATE OR REPLACE FUNCTION record_conversion(
  type TEXT,
  page_path TEXT DEFAULT NULL,
  referrer TEXT DEFAULT NULL,
  user_agent TEXT DEFAULT NULL,
  ip_address TEXT DEFAULT NULL,
  country TEXT DEFAULT NULL,
  city TEXT DEFAULT NULL,
  value DECIMAL(10, 2) DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  new_id UUID;
BEGIN
  INSERT INTO conversions (
    type,
    page_path,
    referrer,
    user_agent,
    ip_address,
    country,
    city,
    value
  )
  VALUES (
    type,
    page_path,
    referrer,
    user_agent,
    ip_address,
    country,
    city,
    value
  )
  RETURNING id INTO new_id;
  
  RETURN new_id;
END;
$$ LANGUAGE plpgsql;

-- Create useful views for analytics dashboard

-- Daily page views
CREATE OR REPLACE VIEW daily_page_views AS
SELECT 
  DATE(created_at) AS date,
  COUNT(*) AS view_count
FROM page_views
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Page views by path
CREATE OR REPLACE VIEW page_views_by_path AS
SELECT 
  page_path,
  COUNT(*) AS view_count
FROM page_views
GROUP BY page_path
ORDER BY view_count DESC;

-- Page views by country
CREATE OR REPLACE VIEW page_views_by_country AS
SELECT 
  country,
  COUNT(*) AS view_count
FROM page_views
WHERE country IS NOT NULL
GROUP BY country
ORDER BY view_count DESC;

-- Page views by device
CREATE OR REPLACE VIEW page_views_by_device AS
SELECT 
  device_type,
  COUNT(*) AS view_count
FROM page_views
WHERE device_type IS NOT NULL
GROUP BY device_type
ORDER BY view_count DESC;

-- Conversions by type
CREATE OR REPLACE VIEW conversions_by_type AS
SELECT 
  type,
  COUNT(*) AS conversion_count
FROM conversions
GROUP BY type
ORDER BY conversion_count DESC;

-- Set up security policy to allow only authenticated users to view analytics data
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Policy for page_views table
CREATE POLICY "Allow authenticated to select page_views" 
ON page_views FOR SELECT 
TO authenticated;

-- Policy for conversions table 
CREATE POLICY "Allow authenticated to select conversions" 
ON conversions FOR SELECT 
TO authenticated;

-- Policy for site_settings table
CREATE POLICY "Allow authenticated to select site_settings" 
ON site_settings FOR SELECT 
TO authenticated;

CREATE POLICY "Allow authenticated to update site_settings" 
ON site_settings FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow authenticated to insert site_settings" 
ON site_settings FOR INSERT
TO authenticated
WITH CHECK (true); 