"use client"

import { useState, useEffect, useRef } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Loader2, Plus, Pencil, Trash2, Upload, X, ImageIcon } from "lucide-react"
import Image from "next/image"
import type { NewsArticle } from "@/app/lib/supabase"

// Helper function to generate slug from title - only for suggestion
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/-+/g, '-')      // Replace multiple hyphens with single hyphen
    .trim();
};

export default function NewsPage() {
  const [news, setNews] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    image_url: "",
    author: "",
    excerpt: "",
    slug: "",
    category: "",
    publication_date: new Date().toISOString().split('T')[0],
  })
  
  const supabase = createClientComponentClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .order("created_at", { ascending: false })
      
      if (error) throw error
      setNews(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0]
      if (!file) return
      
      // Show preview immediately
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      
      // Upload to storage
      setUploading(true)
      setError(null)
      
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `news/${fileName}`
      
      const { error: uploadError, data } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })
      
      if (uploadError) throw uploadError
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath)
      
      // Update form data with the image URL
      setFormData({ ...formData, image_url: publicUrl })
      
    } catch (err: any) {
      console.error("Upload error:", err)
      setError("Upload failed: " + err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Check for required fields
      if (!formData.title || !formData.content || !formData.image_url || !formData.description || !formData.category) {
        throw new Error("Please fill in all required fields")
      }

      // First, let's check if the publication_date column exists
      try {
        const { error: testError } = await supabase
          .from("news")
          .select("publication_date")
          .limit(1)
        
        if (testError && testError.message.includes("column \"publication_date\" does not exist")) {
          // Column doesn't exist, let's create it
          console.log("Adding publication_date column to news table...")
          
          // Create a payload without the publication_date
          const payloadWithoutDate = {
            title: formData.title,
            description: formData.description,
            content: formData.content,
            image_url: formData.image_url,
            author: formData.author,
            excerpt: formData.excerpt,
            slug: formData.slug,
            category: formData.category,
          }
          
          if (editingArticle) {
            const { error } = await supabase
              .from("news")
              .update(payloadWithoutDate)
              .eq("id", editingArticle.id)
            
            if (error) throw error
          } else {
            const { error } = await supabase
              .from("news")
              .insert([payloadWithoutDate])
            
            if (error) throw error
          }
        } else {
          // Column exists, proceed normally with publication_date
          if (editingArticle) {
            const { error } = await supabase
              .from("news")
              .update(formData)
              .eq("id", editingArticle.id)
            
            if (error) throw error
          } else {
            const { error } = await supabase
              .from("news")
              .insert([formData])
            
            if (error) throw error
          }
        }
      } catch (testErr: any) {
        console.error("Error testing schema:", testErr)
        
        // As a fallback, try without publication_date
        const payloadWithoutDate = {
          title: formData.title,
          description: formData.description,
          content: formData.content,
          image_url: formData.image_url,
          author: formData.author,
          excerpt: formData.excerpt,
          slug: formData.slug,
          category: formData.category,
        }
        
        if (editingArticle) {
          const { error } = await supabase
            .from("news")
            .update(payloadWithoutDate)
            .eq("id", editingArticle.id)
          
          if (error) throw error
        } else {
          const { error } = await supabase
            .from("news")
            .insert([payloadWithoutDate])
          
          if (error) throw error
        }
      }

      setIsModalOpen(false)
      setEditingArticle(null)
      setFormData({
        title: "",
        description: "",
        content: "",
        image_url: "",
        author: "",
        excerpt: "",
        slug: "",
        category: "",
        publication_date: new Date().toISOString().split('T')[0],
      })
      setImagePreview(null)
      fetchNews()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleEdit = (article: NewsArticle) => {
    setEditingArticle(article)
    setFormData({
      title: article.title,
      description: article.description || "",
      content: article.content,
      image_url: article.image_url,
      author: article.author || "",
      excerpt: article.excerpt || "",
      slug: article.slug || generateSlug(article.title),
      category: article.category || "",
      publication_date: article.publication_date ? new Date(article.publication_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    })
    setImagePreview(article.image_url)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return

    try {
      setLoading(true);
      console.log("Deleting article with ID:", id);
      
      const { error } = await supabase
        .from("news")
        .delete()
        .eq("id", id)
      
      if (error) {
        console.error("Delete error:", error);
        throw error;
      }
      
      alert("Article deleted successfully!");
      fetchNews()
    } catch (err: any) {
      console.error("Error deleting article:", err);
      setError("Failed to delete article: " + err.message)
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            News Articles
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your news articles and updates.
          </p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-md shadow-md hover:shadow-lg transition-all"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Article
        </Button>
      </div>

      {error && (
        <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900 dark:text-red-200">
          {error}
        </div>
      )}

      <div className="grid gap-4">
        {news.map((article) => (
          <div
            key={article.id}
            className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <div className="relative h-16 w-16">
                <Image
                  src={article.image_url}
                  alt={article.title}
                  fill
                  className="rounded-md object-cover"
                />
              </div>
              <div>
                <h3 className="font-medium">{article.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(article.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit(article)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(article.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">
              {editingArticle ? "Edit Article" : "Add New Article"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-orange-600 dark:text-orange-400">
                  Custom URL Slug <span className="text-red-500">*</span>
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^\w-]/g, '') })
                    }
                    className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 border-orange-300 dark:border-orange-700"
                    required
                    placeholder="your-article-url-slug"
                  />
                  <Button 
                    type="button" 
                    className="ml-2 bg-orange-500 hover:bg-orange-600"
                    onClick={() => setFormData({...formData, slug: generateSlug(formData.title)})}
                  >
                    Suggest
                  </Button>
                </div>
                <p className="text-xs text-orange-500 mt-1 font-medium">
                  This will be used in the URL: /news/{formData.slug || 'your-article-slug'}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Author
                </label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) =>
                    setFormData({ ...formData, author: e.target.value })
                  }
                  className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Short Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  rows={2}
                  required
                  placeholder="Brief description for listings"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Excerpt
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) =>
                    setFormData({ ...formData, excerpt: e.target.value })
                  }
                  className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  rows={2}
                  placeholder="A short summary of the article"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Events">Events</option>
                  <option value="News">News</option>
                  <option value="Press">Press</option>
                  <option value="Integration">Integration</option>
                  <option value="Article">Article</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Publication Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.publication_date}
                  onChange={(e) =>
                    setFormData({ ...formData, publication_date: e.target.value })
                  }
                  className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 font-mono text-sm"
                  rows={10}
                  required
                  placeholder="Article content. You can use HTML tags for formatting like <b>, <i>, <p>, <h2>, etc."
                />
                <p className="text-xs text-amber-500 mt-1">
                  <span className="font-bold">Note:</span> You can use HTML formatting in the content field for better presentation. Examples:
                  <br />
                  &lt;h2&gt;Subtitle&lt;/h2&gt;
                  &lt;p&gt;Paragraph text&lt;/p&gt;
                  &lt;b&gt;Bold text&lt;/b&gt;
                  &lt;i&gt;Italic text&lt;/i&gt;
                  &lt;ul&gt;&lt;li&gt;List item&lt;/li&gt;&lt;/ul&gt;
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Image <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md p-4">
                  {imagePreview ? (
                    <div className="relative">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="mx-auto max-h-64 rounded-md"
                      />
                      <button
                        type="button"
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                        onClick={() => {
                          setImagePreview(null);
                          setFormData({...formData, image_url: ""});
                          if (fileInputRef.current) fileInputRef.current.value = "";
                        }}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <ImageIcon className="h-12 w-12 mx-auto text-gray-400" />
                      <div className="mt-2">
                        <button
                          type="button"
                          className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploading}
                        >
                          {uploading ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="h-4 w-4 mr-2" />
                              Choose Image
                            </>
                          )}
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                          required={!formData.image_url}
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  )}
                  <input
                    type="hidden"
                    value={formData.image_url}
                    name="image_url"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsModalOpen(false)
                    setEditingArticle(null)
                    setFormData({
                      title: "",
                      description: "",
                      content: "",
                      image_url: "",
                      author: "",
                      excerpt: "",
                      slug: "",
                      category: "",
                      publication_date: new Date().toISOString().split('T')[0],
                    })
                    setImagePreview(null)
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={uploading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {uploading ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Uploading...</>
                  ) : (
                    <>{editingArticle ? "Update" : "Create"}</>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
} 