import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import AdminLayoutClient from "./AdminLayoutClient";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentClient({ cookies });
  
  // Check authentication server-side
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    // Redirect to login if not authenticated
    redirect("/admin/login");
  }

  // Get user role from metadata
  const {
    data: { user },
  } = await supabase.auth.getUser();
  
  const userRole = user?.user_metadata?.role || null;
  
  // Render the client-side layout with pre-fetched auth data
  return (
    <AdminLayoutClient
      user={user}
      userRole={userRole}
      children={children}
    />
  );
} 