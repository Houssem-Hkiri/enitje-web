export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      news: {
        Row: {
          id: string
          created_at: string
          title: string
          content: string
          image_url: string | null
          category: string
          author: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          content: string
          image_url?: string | null
          category: string
          author?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          content?: string
          image_url?: string | null
          category?: string
          author?: string | null
        }
      }
      projects: {
        Row: {
          id: string
          created_at: string
          title: string
          description: string
          image_url: string | null
          category: string
          status: string
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          description: string
          image_url?: string | null
          category: string
          status: string
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          description?: string
          image_url?: string | null
          category?: string
          status?: string
        }
      }
      gallery: {
        Row: {
          id: string
          created_at: string
          title: string
          image_url: string
          category: string
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          image_url: string
          category: string
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          image_url?: string
          category?: string
        }
      }
      contacts: {
        Row: {
          id: string
          created_at: string
          name: string
          email: string
          message: string
          status: string
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          email: string
          message: string
          status?: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          email?: string
          message?: string
          status?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 