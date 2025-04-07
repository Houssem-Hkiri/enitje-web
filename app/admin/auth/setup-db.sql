-- Admin Access Requests Table
-- This table stores requests for admin access to the dashboard
CREATE TABLE IF NOT EXISTS admin_access_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  reason TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create RLS Policies for admin_access_requests
-- Enable Row Level Security
ALTER TABLE admin_access_requests ENABLE ROW LEVEL SECURITY;

-- Super admins can see and manage all requests
CREATE POLICY "Super admins can do anything with access requests"
  ON admin_access_requests
  USING (
    (SELECT (role = 'super_admin') FROM auth.users WHERE id = auth.uid())
  );

-- Users can see their own requests
CREATE POLICY "Users can view their own access requests"
  ON admin_access_requests
  FOR SELECT
  USING (user_id = auth.uid());

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update the updated_at timestamp
CREATE TRIGGER update_access_requests_timestamp
BEFORE UPDATE ON admin_access_requests
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- Create a view to make it easier to see pending requests
CREATE OR REPLACE VIEW pending_access_requests AS
SELECT * FROM admin_access_requests
WHERE status = 'pending'
ORDER BY created_at DESC;

-- Admin Audit Log Table
-- This table stores audit logs for sensitive admin actions
CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  action TEXT NOT NULL,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create RLS Policies for admin_audit_logs
-- Enable Row Level Security
ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Only super admins can see all audit logs
CREATE POLICY "Super admins can view all audit logs"
  ON admin_audit_logs
  FOR SELECT
  USING (
    (SELECT (role = 'super_admin') FROM auth.users WHERE id = auth.uid())
  );

-- Function to log admin actions
CREATE OR REPLACE FUNCTION log_admin_action(action TEXT, details JSONB)
RETURNS VOID AS $$
BEGIN
  INSERT INTO admin_audit_logs (user_id, action, details, ip_address)
  VALUES (
    auth.uid(),
    action,
    details,
    current_setting('request.headers', true)::json->>'x-forwarded-for'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle access request approval/rejection
CREATE OR REPLACE FUNCTION handle_access_request(request_id UUID, new_status TEXT)
RETURNS VOID AS $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Get the user_id for the request
  SELECT user_id INTO v_user_id
  FROM admin_access_requests
  WHERE id = request_id;
  
  -- Update the request status
  UPDATE admin_access_requests
  SET status = new_status, updated_at = now()
  WHERE id = request_id;
  
  -- Log the action
  PERFORM log_admin_action(
    'access_request_' || new_status,
    jsonb_build_object('request_id', request_id, 'user_id', v_user_id)
  );
  
  -- If approved, you might want to set the user's role in a custom user profile table
  -- or rely on updating user_metadata directly from your application code
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 