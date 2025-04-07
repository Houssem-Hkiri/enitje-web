import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';

async function getProjects() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    return [];
  }
}

// Helper function to truncate text
function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export default async function ProjectsTestPage() {
  const projects = await getProjects();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Projects Test Page (Server-Side Rendered)</h1>
      
      <div className="mb-4">
        <p className="mb-2">Found {projects.length} projects in database</p>
        <Link href="/projects" className="text-blue-500 underline">
          Go to client-side projects page
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="border p-4 rounded shadow">
            <h2 className="text-xl font-bold">{project.title}</h2>
            <p className="text-gray-600 mb-2 line-clamp-3">
              {truncateText(project.description || '', 150)}
            </p>
            {project.image_url && (
              <div className="mb-2">
                <img 
                  src={project.image_url} 
                  alt={project.title}
                  className="w-full h-40 object-cover rounded"
                />
              </div>
            )}
            <div className="text-sm text-gray-500 mt-2">
              {project.client && <p>Client: {project.client}</p>}
              {project.category && <p>Category: {project.category}</p>}
              {project.technologies && <p>Technologies: {project.technologies}</p>}
            </div>
          </div>
        ))}
      </div>
      
      {projects.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
          <p>No projects found. This could indicate an issue with the database or query.</p>
        </div>
      )}
    </div>
  );
} 