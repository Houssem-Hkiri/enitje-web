import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';
import Image from 'next/image';

async function getNews() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  
  try {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching news:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Failed to fetch news:', error);
    return [];
  }
}

// Helper function to truncate text
function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

// Helper function to strip HTML tags from content
function stripHtmlTags(html: string): string {
  return html?.replace(/<[^>]*>/g, '') || '';
}

export default async function NewsTestPage() {
  const news = await getNews();
  
  // Format date helper function
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">News Test Page (Server-Side Rendered)</h1>
      
      <div className="mb-4">
        <p className="mb-2">Found {news.length} news articles in database</p>
        <Link href="/news" className="text-blue-500 underline">
          Go to client-side news page
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((article) => (
          <div key={article.id} className="border p-4 rounded shadow">
            <h2 className="text-xl font-bold">{article.title}</h2>
            
            {article.image_url && (
              <div className="my-4">
                <img 
                  src={article.image_url} 
                  alt={article.title}
                  className="w-full h-40 object-cover rounded"
                />
              </div>
            )}
            
            <div className="text-sm text-gray-500 mb-2">
              {formatDate(article.publication_date || article.created_at)}
              {article.category && (
                <span className="ml-2 inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                  {article.category}
                </span>
              )}
            </div>
            
            <p className="text-gray-600 mb-2 line-clamp-3">
              {article.excerpt || truncateText(stripHtmlTags(article.content || ''), 150)}
            </p>
            
            <Link href={`/news/${article.slug}`} className="text-blue-500 hover:underline">
              Read more →
            </Link>
          </div>
        ))}
      </div>
      
      {news.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
          <p>No news articles found. This could indicate an issue with the database or query.</p>
        </div>
      )}
    </div>
  );
} 