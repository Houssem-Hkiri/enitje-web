"use client"

import { useState, useEffect, useRef } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Loader2, Plus, Pencil, Trash2, X, ImageIcon, Upload } from "lucide-react"
import Image from "next/image"
import type { Project } from "@/app/lib/supabase"
import { deleteProject } from "@/app/lib/supabase"

// Helper function to generate slug from title - only for suggestion
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/-+/g, '-')      // Replace multiple hyphens with single hyphen
    .trim();
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    client: "",
    category: "",
    image_url: "",
    content: "",
    technologies: "",
    slug: "",
  })
  
  const supabase = createClientComponentClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false })
      
      if (error) throw error
      setProjects(data)
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
      const filePath = `projects/${fileName}`
      
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
      // Validate image
      if (!formData.image_url) {
        throw new Error("Please upload an image")
      }
      
      if (editingProject) {
        const { error } = await supabase
          .from("projects")
          .update(formData)
          .eq("id", editingProject.id)
        
        if (error) throw error
      } else {
        const { error } = await supabase
          .from("projects")
          .insert([formData])
        
        if (error) throw error
      }
      
      setIsModalOpen(false)
      setEditingProject(null)
      setFormData({
        title: "",
        description: "",
        client: "",
        category: "",
        image_url: "",
        content: "",
        technologies: "",
        slug: "",
      })
      setImagePreview(null)
      fetchProjects()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleEdit = (project: Project) => {
    setEditingProject(project)
    setFormData({
      title: project.title,
      description: project.description,
      client: project.client,
      category: project.category,
      image_url: project.image_url,
      content: project.content || "",
      technologies: project.technologies ? (Array.isArray(project.technologies) ? project.technologies.join(", ") : project.technologies) : "",
      slug: project.slug || "",
    })
    setImagePreview(project.image_url)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return

    try {
      setLoading(true);
      // Use the dedicated function from supabase.ts
      await deleteProject(id);
      
      // Success message
      setError(null);
      alert("Project deleted successfully!");
      
      // Refresh projects list
      await fetchProjects();
    } catch (err: any) {
      console.error("Error deleting project:", err);
      setError("Failed to delete project: " + err.message);
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
            Projects
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your portfolio projects.
          </p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          size="lg"
          className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-md shadow-md hover:shadow-lg transition-all"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Project
        </Button>
      </div>

      {error && (
        <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900 dark:text-red-200">
          {error}
        </div>
      )}

      <div className="grid gap-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <div className="relative h-16 w-16">
                <Image
                  src={project.image_url}
                  alt={project.title}
                  fill
                  className="rounded-md object-cover"
                />
              </div>
              <div>
                <h3 className="font-medium">{project.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {project.client} - {project.category}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit(project)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(project.id)}
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
              {editingProject ? "Edit Project" : "Add New Project"}
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
                    placeholder="your-project-url-slug"
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
                  This will be used in the URL: /projects/{formData.slug || 'your-project-slug'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Client <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.client}
                    onChange={(e) =>
                      setFormData({ ...formData, client: e.target.value })
                    }
                    className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                    required
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
                    <option value="IT">IT</option>
                    <option value="Consulting">Consulting</option>
                    <option value="Conception Mecanique">Conception Mecanique</option>
                    <option value="Conception Electrique">Conception Electrique</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Technologies
                </label>
                <input
                  type="text"
                  value={formData.technologies}
                  onChange={(e) =>
                    setFormData({ ...formData, technologies: e.target.value })
                  }
                  className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  placeholder="React, NextJS, Tailwind CSS"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Comma-separated list of technologies used
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Detailed Content
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  rows={6}
                  placeholder="Detailed project information (supports HTML)"
                />
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
                          className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
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
                    setEditingProject(null)
                    setFormData({
                      title: "",
                      description: "",
                      client: "",
                      category: "",
                      image_url: "",
                      content: "",
                      technologies: "",
                      slug: "",
                    })
                    setImagePreview(null)
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={uploading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {uploading ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Uploading...</>
                  ) : (
                    <>{editingProject ? "Update" : "Create"}</>
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