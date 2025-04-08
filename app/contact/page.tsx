import { createClient } from '@/app/lib/supabase-server'
import ContactFormClient from './ContactFormClient'

export default async function ContactPage() {
  const supabase = createClient()
  const { data: categories, error } = await supabase
    .from('contact_categories')
    .select('*')
    .order('name')

  if (error) {
    console.error('Error fetching categories:', error)
    return <div>Error loading contact form. Please try again later.</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Contact Us</h1>
      <div className="max-w-2xl mx-auto">
        <ContactFormClient categories={categories || []} />
      </div>
    </div>
  )
}



