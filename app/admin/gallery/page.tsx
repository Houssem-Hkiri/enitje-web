"use client"

import { useState, useEffect, useRef } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Loader2, Plus, Pencil, Trash2, Upload, X, ImageIcon } from "lucide-react"
import Image from "next/image"
import type { GalleryItem } from "@/app/lib/supabase"

export default function GalleryPage() {
  const [gallery, setGallery] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingImage, setEditingImage] = useState<GalleryItem | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    image_url: "",
  })
  
  const supabase = createClientComponentClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchGallery()
  }, [])

  const fetchGallery = async () => {
    try {
      const { data, error } = await supabase
        .from("gallery")
        .select("*")
        .order("created_at", { ascending: false })
      
      if (error) throw error
      setGallery(data)
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
      const filePath = `gallery/${fileName}`
      
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
      // Validation
      if (!formData.image_url) {
        throw new Error("Please upload an image")
      }
      
      if (editingImage) {
        const { error } = await supabase
          .from("gallery")
          .update(formData)
          .eq("id", editingImage.id)
        
        if (error) throw error
      } else {
        const { error } = await supabase
          .from("gallery")
          .insert([formData])
        
        if (error) throw error
      }
      
      setIsModalOpen(false)
      setEditingImage(null)
      setFormData({
        title: "",
        description: "",
        category: "",
        image_url: "",
      })
      setImagePreview(null)
      fetchGallery()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleEdit = (image: GalleryItem) => {
    setEditingImage(image)
    setFormData({
      title: image.title,
      description: image.description || "",
      category: image.category || "",
      image_url: image.image_url,
    })
    setImagePreview(image.image_url)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return

    try {
      setLoading(true);
      
      const { error } = await supabase
        .from("gallery")
        .delete()
        .eq("id", id)
      
      if (error) {
        console.error("Delete error:", error);
        throw error;
      }
      
      alert("Image deleted successfully!");
      fetchGallery()
    } catch (err: any) {
      console.error("Error deleting image:", err);
      setError("Failed to delete image: " + err.message)
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
            Gallery
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your gallery images.
          </p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          size="lg"
          className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-2 rounded-md shadow-md hover:shadow-lg transition-all"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Image
        </Button>
      </div>

      {error && (
        <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900 dark:text-red-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {gallery.map((image) => (
          <div
            key={image.id}
            className="relative group bg-white dark:bg-gray-800 rounded-lg shadow p-2"
          >
            <div className="relative h-40 w-full">
              <Image
                src={image.image_url}
                alt={image.title}
                fill
                className="rounded-md object-cover"
              />
            </div>
            <div className="mt-2">
              <h3 className="font-medium text-sm">{image.title}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {image.category}
              </p>
            </div>
            <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit(image)}
              >
                <Pencil className="h-3 w-3" />
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(image.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full p-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingImage ? "Edit Image" : "Add New Image"}
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
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="">Select Category</option>
                  <option value="Events">Events</option>
                  <option value="Office">Office</option>
                  <option value="Team">Team</option>
                  <option value="Projects">Projects</option>
                </select>
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
                          className="inline-flex items-center px-4 py-2 bg-purple-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
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
                    setEditingImage(null)
                    setFormData({
                      title: "",
                      description: "",
                      category: "",
                      image_url: "",
                    })
                    setImagePreview(null)
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={uploading}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {uploading ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Uploading...</>
                  ) : (
                    <>{editingImage ? "Update" : "Create"}</>
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