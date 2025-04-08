import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/types/supabase'

export const createClient = () => {
  const cookieStore = cookies()
  return createServerComponentClient<Database>({ cookies: () => cookieStore })
}

export const getSession = async () => {
  const supabase = createClient()
  return await supabase.auth.getSession()
}

export const getUser = async () => {
  const supabase = createClient()
  return await supabase.auth.getUser()
}

export const signOut = async () => {
  const supabase = createClient()
  return await supabase.auth.signOut()
} 