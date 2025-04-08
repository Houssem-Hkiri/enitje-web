import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import type { NewsArticle, Project, GalleryItem } from "./supabase";

// Server-side functions using the server component client

export async function getProjectsServer(limit = 6) {
  const supabase = createServerComponentClient({ cookies });
  
  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
    
  if (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
  
  return projects || [];
}

export async function getNewsArticlesServer(limit = 6) {
  const supabase = createServerComponentClient({ cookies });
  
  const { data: news, error } = await supabase
    .from("news")
    .select("*") 
    .order("created_at", { ascending: false })
    .limit(limit);
    
  if (error) {
    console.error("Error fetching news articles:", error);
    return [];
  }
  
  return news || [];
}

export async function getProjectByIdServer(id: string) {
  const supabase = createServerComponentClient({ cookies });
  
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();
    
  if (error) {
    console.error(`Error fetching project with id ${id}:`, error);
    return null;
  }
  
  return data;
}

export async function getNewsArticleByIdServer(id: string) {
  const supabase = createServerComponentClient({ cookies });
  
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("id", id)
    .single();
    
  if (error) {
    console.error(`Error fetching news article with id ${id}:`, error);
    return null;
  }
  
  return data;
}

export async function getProjectBySlugServer(slug: string) {
  const supabase = createServerComponentClient({ cookies });
  
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .single();
    
  if (error) {
    console.error(`Error fetching project with slug ${slug}:`, error);
    return null;
  }
  
  return data;
}

export async function getNewsArticleBySlugServer(slug: string) {
  const supabase = createServerComponentClient({ cookies });
  
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("slug", slug)
    .single();
    
  if (error) {
    console.error(`Error fetching news article with slug ${slug}:`, error);
    return null;
  }
  
  return data;
}

export async function getGalleryItemsServer(limit = 12) {
  const supabase = createServerComponentClient({ cookies });
  
  const { data, error } = await supabase
    .from("gallery")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
    
  if (error) {
    console.error("Error fetching gallery items:", error);
    return [];
  }
  
  return data || [];
}

// Function to check if user is authenticated and has admin rights
export async function isUserAdmin() {
  const supabase = createServerComponentClient({ cookies });
  
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return false;
    }
    
    // Check user claims or roles (depends on your auth setup)
    // This is just an example, adjust based on your actual admin checking logic
    return session.user.email?.endsWith('@enitje.com') || false;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
} 