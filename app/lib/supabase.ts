import { createClient } from '@supabase/supabase-js'
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

// Create a single supabase client for interacting with the database
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

// Types for our database tables
export type NewsArticle = {
  id: string
  title: string
  description: string
  content: string
  image_url: string
  created_at: string
  updated_at: string
  author: string
  slug: string
  excerpt: string
  category: string
  publication_date: string
}

export type Project = {
  id: string
  title: string
  description: string
  client: string
  category: string
  image_url: string
  created_at: string
  updated_at: string
  slug: string
  content?: string
  technologies?: string
}

export type GalleryItem = {
  id: string
  title: string
  description?: string
  image_url: string
  category?: string
  created_at: string
  updated_at: string
}

// Helper functions for common operations
export const getNewsArticles = async () => {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data as NewsArticle[]
}

export const getProjects = async () => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data as Project[]
}

export const getGalleryItems = async () => {
  const { data, error } = await supabase
    .from('gallery')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data as GalleryItem[]
}

export const getFeaturedProjects = async (limit = 3) => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)
  
  if (error) throw error
  return data as Project[]
}

export const getLatestNews = async (limit = 3) => {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)
  
  if (error) throw error
  return data as NewsArticle[]
}

export const getProjectBySlug = async (slug: string) => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .single();
  
  if (error) throw error;
  return data as Project;
}

export const getNewsArticleBySlug = async (slug: string) => {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('slug', slug)
    .single();
  
  if (error) throw error;
  return data as NewsArticle;
}

export const getProjectById = async (id: string) => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data as Project;
}

export const getNewsArticleById = async (id: string) => {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data as NewsArticle;
}

export const deleteProject = async (id: string) => {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
}

export async function getProjects(limit = 6) {
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

export async function getNewsArticles(limit = 6) {
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

export async function getProjectById(id: string) {
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

export async function getNewsArticleById(id: string) {
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

export default supabase 