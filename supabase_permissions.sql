-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
-- Policy for selecting (reading) projects
CREATE POLICY "Allow public read access" ON projects
  FOR SELECT USING (true);

-- Policy for inserting new projects (only authenticated users)
CREATE POLICY "Allow authenticated insert" ON projects
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policy for updating projects (only authenticated users)
CREATE POLICY "Allow authenticated update" ON projects
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Policy for deleting projects (only authenticated users)
CREATE POLICY "Allow authenticated delete" ON projects
  FOR DELETE USING (auth.role() = 'authenticated');

-- If you have a specific admin role or want to restrict to certain users:
-- CREATE POLICY "Allow admin delete" ON projects
--   FOR DELETE USING (auth.uid() IN (SELECT id FROM admin_users));

-- Troubleshooting: Check for existing policies that might conflict
-- SELECT * FROM pg_policies WHERE tablename = 'projects'; 