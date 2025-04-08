"use server"

import fs from "fs"
import path from "path"
import { put } from "@vercel/blob"
import { revalidatePath } from "next/cache"
import { newsData } from "../data/news"
import { projectsData } from "../data/projects"

// Types
export type NewsItem = {
  id: number
  title: string
  date: string
  category: string
  image: string
  excerpt: string
  content: string
}

export type ProjectItem = {
  id: number
  title: string
  category: string
  image: string
  description: string
}

export type GalleryItem = {
  id: number
  title: string
  category: string
  src: string
}

export type UploadResponse = {
  success: boolean
  url?: string
  contentType?: string
  error?: string
}

// Gallery data - we'll create this file to store gallery items
let galleryData: { [key: string]: GalleryItem[] } = {
  en: [],
  fr: [],
}

// Try to load gallery data
try {
  const galleryPath = path.join(process.cwd(), "app/data/gallery.json")
  if (fs.existsSync(galleryPath)) {
    galleryData = JSON.parse(fs.readFileSync(galleryPath, "utf8"))
  } else {
    // Create initial gallery data with sample items
    galleryData = {
      en: [
        {
          id: 1,
          title: "Team Building Event 2023",
          category: "Events",
          src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3M7A3797.jpg-4xIaAstel9xbV1vp4auINgxuEOhJsz.jpeg",
        },
        {
          id: 2,
          title: "Annual Conference",
          category: "Events",
          src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3M7A3764.jpg-R8CTzh4Kr5W2GDoErCWS9cV1FluTYO.jpeg",
        },
        {
          id: 3,
          title: "Forum ENIT Entreprise",
          category: "Events",
          src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Cover1.jpg-dU6o5ytm6GGrypJyhxh3V2um4UkU9o.jpeg",
        },
        { id: 4, title: "Workshop Session", category: "Workshops", src: "/placeholder.svg?height=600&width=800" },
        { id: 5, title: "Project Showcase", category: "Projects", src: "/placeholder.svg?height=600&width=800" },
      ],
      fr: [
        {
          id: 1,
          title: "Événement de Team Building 2023",
          category: "Événements",
          src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3M7A3797.jpg-4xIaAstel9xbV1vp4auINgxuEOhJsz.jpeg",
        },
        {
          id: 2,
          title: "Conférence Annuelle",
          category: "Événements",
          src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3M7A3764.jpg-R8CTzh4Kr5W2GDoErCWS9cV1FluTYO.jpeg",
        },
        {
          id: 3,
          title: "Forum ENIT Entreprise",
          category: "Événements",
          src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Cover1.jpg-dU6o5ytm6GGrypJyhxh3V2um4UkU9o.jpeg",
        },
        { id: 4, title: "Session d'Atelier", category: "Ateliers", src: "/placeholder.svg?height=600&width=800" },
        { id: 5, title: "Présentation de Projet", category: "Projets", src: "/placeholder.svg?height=600&width=800" },
      ],
    }
    fs.writeFileSync(galleryPath, JSON.stringify(galleryData, null, 2))
  }
} catch (error) {
  console.error("Error loading gallery data:", error)
  // Fallback to default data
  galleryData = {
    en: [
      {
        id: 1,
        title: "Team Building Event 2023",
        category: "Events",
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3M7A3797.jpg-4xIaAstel9xbV1vp4auINgxuEOhJsz.jpeg",
      },
    ],
    fr: [
      {
        id: 1,
        title: "Événement de Team Building 2023",
        category: "Événements",
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3M7A3797.jpg-4xIaAstel9xbV1vp4auINgxuEOhJsz.jpeg",
      },
    ],
  }
}

// Helper function to save data to a file
function saveDataToFile(filePath: string, data: any) {
  const dir = path.dirname(filePath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
}

// Upload image to Vercel Blob Storage
export async function uploadImage(file: File): Promise<UploadResponse> {
  try {
    const { put } = await import('@vercel/blob')
    const result = await put(file.name, file, {
      access: 'public',
    })

    return {
      success: true,
      url: result.url,
      contentType: result.contentType
    }
  } catch (error) {
    console.error('Error uploading image:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

// Save or update a news article
export async function saveNewsItem(item: NewsItem, language = "en") {
  try {
    // Make a deep copy of the current news data
    const currentNewsData = JSON.parse(JSON.stringify(newsData))

    // Find if the item already exists (by id)
    const existingItemIndex = currentNewsData[language].findIndex((news: NewsItem) => news.id === item.id)

    if (existingItemIndex !== -1) {
      // Update existing item
      currentNewsData[language][existingItemIndex] = item
    } else {
      // Add new item
      currentNewsData[language].push(item)
    }

    // Save updated data to file
    const newsPath = path.join(process.cwd(), "app/data/news.ts")
    const fileContent = `export const newsData = ${JSON.stringify(currentNewsData, null, 2)}\n`
    fs.writeFileSync(newsPath, fileContent)

    // Revalidate the news pages
    revalidatePath("/news")
    revalidatePath("/admin")

    return { success: true, message: "News item saved successfully" }
  } catch (error: any) {
    console.error("Error saving news item:", error)
    return { success: false, error: error.message || "Failed to save news item" }
  }
}

// Save or update a project
export async function saveProjectItem(item: ProjectItem, language = "en") {
  try {
    // Make a deep copy of the current projects data
    const currentProjectsData = JSON.parse(JSON.stringify(projectsData))

    // Find if the item already exists (by id)
    const existingItemIndex = currentProjectsData[language].findIndex((project: ProjectItem) => project.id === item.id)

    if (existingItemIndex !== -1) {
      // Update existing item
      currentProjectsData[language][existingItemIndex] = item
    } else {
      // Add new item
      currentProjectsData[language].push(item)
    }

    // Save updated data to file
    const projectsPath = path.join(process.cwd(), "app/data/projects.ts")
    const fileContent = `export const projectsData = ${JSON.stringify(currentProjectsData, null, 2)}\n`
    fs.writeFileSync(projectsPath, fileContent)

    // Revalidate the projects pages
    revalidatePath("/projects")
    revalidatePath("/admin")

    return { success: true, message: "Project saved successfully" }
  } catch (error: any) {
    console.error("Error saving project:", error)
    return { success: false, error: error.message || "Failed to save project" }
  }
}

// Save or update a gallery item
export async function saveGalleryItem(item: GalleryItem, language = "en") {
  try {
    // Find if the item already exists (by id)
    const existingItemIndex = galleryData[language].findIndex((galleryItem: GalleryItem) => galleryItem.id === item.id)

    if (existingItemIndex !== -1) {
      // Update existing item
      galleryData[language][existingItemIndex] = item
    } else {
      // Add new item
      galleryData[language].push(item)
    }

    // Save updated data to file
    const galleryPath = path.join(process.cwd(), "app/data/gallery.json")
    saveDataToFile(galleryPath, galleryData)

    // Revalidate paths
    revalidatePath("/admin")

    return { success: true, message: "Gallery item saved successfully" }
  } catch (error: any) {
    console.error("Error saving gallery item:", error)
    return { success: false, error: error.message || "Failed to save gallery item" }
  }
}

// Delete a news item
export async function deleteNewsItem(id: number, language = "en") {
  try {
    // Make a deep copy of the current news data
    const currentNewsData = JSON.parse(JSON.stringify(newsData))

    // Remove the item with the given id
    currentNewsData[language] = currentNewsData[language].filter((news: NewsItem) => news.id !== id)

    // Save updated data to file
    const newsPath = path.join(process.cwd(), "app/data/news.ts")
    const fileContent = `export const newsData = ${JSON.stringify(currentNewsData, null, 2)}\n`
    fs.writeFileSync(newsPath, fileContent)

    // Revalidate the news pages
    revalidatePath("/news")
    revalidatePath("/admin")

    return { success: true, message: "News item deleted successfully" }
  } catch (error: any) {
    console.error("Error deleting news item:", error)
    return { success: false, error: error.message || "Failed to delete news item" }
  }
}

// Delete a project
export async function deleteProjectItem(id: number, language = "en") {
  try {
    // Make a deep copy of the current projects data
    const currentProjectsData = JSON.parse(JSON.stringify(projectsData))

    // Remove the item with the given id
    currentProjectsData[language] = currentProjectsData[language].filter((project: ProjectItem) => project.id !== id)

    // Save updated data to file
    const projectsPath = path.join(process.cwd(), "app/data/projects.ts")
    const fileContent = `export const projectsData = ${JSON.stringify(currentProjectsData, null, 2)}\n`
    fs.writeFileSync(projectsPath, fileContent)

    // Revalidate the projects pages
    revalidatePath("/projects")
    revalidatePath("/admin")

    return { success: true, message: "Project deleted successfully" }
  } catch (error: any) {
    console.error("Error deleting project:", error)
    return { success: false, error: error.message || "Failed to delete project" }
  }
}

// Delete a gallery item
export async function deleteGalleryItem(id: number, language = "en") {
  try {
    // Remove the item with the given id
    galleryData[language] = galleryData[language].filter((galleryItem: GalleryItem) => galleryItem.id !== id)

    // Save updated data to file
    const galleryPath = path.join(process.cwd(), "app/data/gallery.json")
    saveDataToFile(galleryPath, galleryData)

    // Revalidate paths
    revalidatePath("/admin")

    return { success: true, message: "Gallery item deleted successfully" }
  } catch (error: any) {
    console.error("Error deleting gallery item:", error)
    return { success: false, error: error.message || "Failed to delete gallery item" }
  }
}

// Get all gallery items
export async function getGalleryItems(language = "en"): Promise<GalleryItem[]> {
  return galleryData[language] || []
}

