"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  BarChart3,
  Users,
  FileText,
  Settings,
  LogOut,
  Lock,
  AlertTriangle,
  Search,
  Plus,
  Trash2,
  Edit,
  Eye,
  Save,
  X,
  Upload,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Calendar,
  User,
  UserPlus,
  UserCheck,
  Briefcase,
  Check,
} from "lucide-react"

// Import the data
import { newsData } from "../data/news"
import { projectsData } from "../data/projects"
import { useLanguage } from "../contexts/LanguageContext"

// Import server actions
import {
  uploadImage,
  saveNewsItem,
  saveProjectItem,
  saveGalleryItem,
  deleteNewsItem,
  deleteProjectItem,
  deleteGalleryItem,
  getGalleryItems,
  type NewsItem,
  type ProjectItem,
  type GalleryItem,
} from "../actions/storage-actions"

// Enhanced security with token-based authentication and session timeout
export default function AdminPanel() {
  const router = useRouter()
  const { language } = useLanguage()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [authError, setAuthError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [loginAttempts, setLoginAttempts] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const [lockoutTime, setLockoutTime] = useState(0)
  const [sessionTimeout, setSessionTimeout] = useState<NodeJS.Timeout | null>(null)
  const [showSessionWarning, setShowSessionWarning] = useState(false)
  const [remainingTime, setRemainingTime] = useState(0)

  // Main navigation state
  const [activeSection, setActiveSection] = useState("dashboard")
  const [activeTab, setActiveTab] = useState("news")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState("id")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  // For editing and creating
  const [isEditing, setIsEditing] = useState(false)
  const [currentItem, setCurrentItem] = useState<any>(null)
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Gallery data
  const [galleryImages, setGalleryImages] = useState<GalleryItem[]>([])
  const [isLoadingGallery, setIsLoadingGallery] = useState(false)

  // SEO stats mock data
  const seoStats = {
    visitors: {
      total: 12458,
      monthly: 2345,
      weekly: 876,
      daily: 124,
      change: 8.2,
    },
    pageViews: {
      total: 45678,
      monthly: 8765,
      weekly: 2345,
      daily: 432,
      change: 12.5,
    },
    topPages: [
      { url: "/services", views: 1245, bounce: "32%" },
      { url: "/projects", views: 987, bounce: "28%" },
      { url: "/about", views: 876, bounce: "35%" },
      { url: "/news", views: 765, bounce: "40%" },
      { url: "/contact", views: 654, bounce: "25%" },
    ],
    keywords: [
      { term: "enit junior entreprise", position: 1, volume: 320 },
      { term: "junior entreprise tunisie", position: 3, volume: 210 },
      { term: "services ingénierie tunisie", position: 5, volume: 180 },
      { term: "projets étudiants ingénierie", position: 7, volume: 150 },
      { term: "consultation technique tunisie", position: 12, volume: 90 },
    ],
  }

  // HR management mock data
  const hrData = {
    team: [
      {
        id: 1,
        name: "Sarah Ben Ali",
        position: "Présidente",
        department: "Direction",
        status: "active",
        joinDate: "2022-09-01",
      },
      {
        id: 2,
        name: "Mohamed Karim",
        position: "Vice-Président",
        department: "Direction",
        status: "active",
        joinDate: "2022-09-01",
      },
      {
        id: 3,
        name: "Yasmine Trabelsi",
        position: "Chef de Projet",
        department: "Projets",
        status: "active",
        joinDate: "2022-10-15",
      },
      {
        id: 4,
        name: "Ahmed Benali",
        position: "Responsable IT",
        department: "Technique",
        status: "active",
        joinDate: "2022-11-01",
      },
      {
        id: 5,
        name: "Leila Mansour",
        position: "Responsable Marketing",
        department: "Marketing",
        status: "active",
        joinDate: "2023-01-15",
      },
      {
        id: 6,
        name: "Karim Hadjeri",
        position: "Responsable Financier",
        department: "Finance",
        status: "active",
        joinDate: "2023-02-01",
      },
      {
        id: 7,
        name: "Nour Sassi",
        position: "Responsable RH",
        department: "RH",
        status: "active",
        joinDate: "2023-03-15",
      },
      {
        id: 8,
        name: "Youssef Mejri",
        position: "Responsable Technique",
        department: "Technique",
        status: "active",
        joinDate: "2023-04-01",
      },
    ],
    departments: [
      { id: 1, name: "Direction", members: 2, projects: 0 },
      { id: 2, name: "Projets", members: 1, projects: 12 },
      { id: 3, name: "Technique", members: 2, projects: 8 },
      { id: 4, name: "Marketing", members: 1, projects: 5 },
      { id: 5, name: "Finance", members: 1, projects: 0 },
      { id: 6, name: "RH", members: 1, projects: 0 },
    ],
    applications: [
      { id: 1, name: "Amine Khelifi", position: "Développeur Web", status: "pending", appliedDate: "2023-09-15" },
      { id: 2, name: "Sarra Mejri", position: "Designer UI/UX", status: "interview", appliedDate: "2023-09-18" },
      { id: 3, name: "Mehdi Bouazizi", position: "Développeur Mobile", status: "accepted", appliedDate: "2023-09-10" },
      { id: 4, name: "Fatma Zouari", position: "Analyste Marketing", status: "rejected", appliedDate: "2023-09-05" },
    ],
    projects: [
      {
        id: 1,
        name: "Plateforme E-Commerce",
        lead: "Yasmine Trabelsi",
        members: 4,
        status: "in-progress",
        deadline: "2023-12-15",
      },
      {
        id: 2,
        name: "Système de Maison Intelligente",
        lead: "Ahmed Benali",
        members: 3,
        status: "completed",
        deadline: "2023-08-30",
      },
      {
        id: 3,
        name: "Outil d'Analyse de Marché",
        lead: "Leila Mansour",
        members: 2,
        status: "planning",
        deadline: "2024-01-30",
      },
    ],
  }

  // Load gallery data on component mount
  useEffect(() => {
    if (isAuthenticated) {
      loadGalleryData()
    }
  }, [isAuthenticated, language])

  // Function to load gallery data
  async function loadGalleryData() {
    try {
      setIsLoadingGallery(true)
      const data = await getGalleryItems(language)
      setGalleryImages(data)
    } catch (error) {
      console.error("Error loading gallery data:", error)
    } finally {
      setIsLoadingGallery(false)
    }
  }

  // Check for existing session on load
  useEffect(() => {
    const token = localStorage.getItem("adminToken")
    const expiry = localStorage.getItem("tokenExpiry")

    if (token && expiry && Number.parseInt(expiry) > Date.now()) {
      setIsAuthenticated(true)
      startSessionTimer()
    }
  }, [])

  // Handle lockout countdown
  useEffect(() => {
    if (isLocked && lockoutTime > 0) {
      const timer = setTimeout(() => {
        setLockoutTime((prev) => prev - 1)
      }, 1000)

      return () => clearTimeout(timer)
    } else if (isLocked && lockoutTime === 0) {
      setIsLocked(false)
      setLoginAttempts(0)
    }
  }, [isLocked, lockoutTime])

  // Session timeout warning
  useEffect(() => {
    if (showSessionWarning && remainingTime > 0) {
      const timer = setTimeout(() => {
        setRemainingTime((prev) => prev - 1)
      }, 1000)

      return () => clearTimeout(timer)
    } else if (showSessionWarning && remainingTime === 0) {
      handleLogout()
    }
  }, [showSessionWarning, remainingTime])

  // Display success or error message with auto-dismiss
  useEffect(() => {
    if (submitSuccess || submitError) {
      const timer = setTimeout(() => {
        setSubmitSuccess(null)
        setSubmitError(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [submitSuccess, submitError])

  // Start session timer
  const startSessionTimer = () => {
    // Clear any existing timer
    if (sessionTimeout) {
      clearTimeout(sessionTimeout)
    }

    // Set session to expire after 30 minutes
    const timeout = setTimeout(
      () => {
        setShowSessionWarning(true)
        setRemainingTime(60) // 60 second warning
      },
      30 * 60 * 1000 - 60 * 1000,
    ) // 30 minutes minus 60 seconds for warning

    setSessionTimeout(timeout)

    // Set token expiry
    localStorage.setItem("tokenExpiry", (Date.now() + 30 * 60 * 1000).toString())
  }

  // Extend session
  const extendSession = () => {
    setShowSessionWarning(false)
    startSessionTimer()
  }

  // Enhanced authentication with rate limiting
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    if (isLocked) {
      setAuthError(`Account locked. Try again in ${lockoutTime} seconds.`)
      return
    }

    setIsLoading(true)

    // Simulate API call with delay
    setTimeout(() => {
      // In a real app, this would be a secure API call with proper hashing
      if (username === "admin" && password === "securepassword123!") {
        setIsAuthenticated(true)
        setAuthError("")
        setLoginAttempts(0)

        // Generate a random token and store it
        const token = Math.random().toString(36).substring(2) + Date.now().toString(36)
        localStorage.setItem("adminToken", token)

        startSessionTimer()
      } else {
        const newAttempts = loginAttempts + 1
        setLoginAttempts(newAttempts)

        if (newAttempts >= 5) {
          setIsLocked(true)
          setLockoutTime(60) // Lock for 60 seconds
          setAuthError("Too many failed attempts. Account locked for 60 seconds.")
        } else {
          setAuthError(`Invalid username or password. ${5 - newAttempts} attempts remaining.`)
        }
      }

      setIsLoading(false)
      setPassword("")
    }, 1000)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setUsername("")
    setPassword("")
    setShowSessionWarning(false)

    if (sessionTimeout) {
      clearTimeout(sessionTimeout)
    }

    localStorage.removeItem("adminToken")
    localStorage.removeItem("tokenExpiry")
  }

  // Handle file upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        // Show preview locally
        const reader = new FileReader()
        reader.onload = (event) => {
          if (event.target?.result) {
            setUploadedImage(event.target.result as string)
          }
        }
        reader.readAsDataURL(file)

        // Upload the file in the background
        const formData = new FormData()
        formData.append("file", file)

        // No need to wait for upload completion when just showing preview
        // The actual upload will happen when saving the item
      } catch (error) {
        console.error("Error processing file:", error)
        setSubmitError("Error processing file. Please try again.")
      }
    }
  }

  const handleEditItem = (item: any) => {
    setCurrentItem({ ...item })
    setIsEditing(true)
    setUploadedImage(null)
    // Reset any previous error or success messages
    setSubmitError(null)
    setSubmitSuccess(null)
  }

  const handleCreateItem = (type: string) => {
    if (type === "news") {
      setCurrentItem({
        id: Math.max(...newsData[language].map((item) => item.id), 0) + 1,
        title: "",
        date: new Date().toLocaleDateString(language === "fr" ? "fr-FR" : "en-US"),
        category: "",
        image: "/placeholder.svg?height=400&width=600",
        excerpt: "",
        content: "",
      })
    } else if (type === "project") {
      setCurrentItem({
        id: Math.max(...projectsData[language].map((item) => item.id), 0) + 1,
        title: "",
        description: "",
        category: "",
        image: "/placeholder.svg?height=400&width=600",
      })
    } else if (type === "gallery") {
      setCurrentItem({
        id: Math.max(...galleryImages.map((item) => item.id), 0) + 1,
        title: "",
        category: "",
        src: "/placeholder.svg?height=600&width=800",
      })
    }

    setIsEditing(true)
    setActiveTab(type === "gallery" ? "gallery" : type === "project" ? "projects" : "news")
    setUploadedImage(null)

    // Reset any previous error or success messages
    setSubmitError(null)
    setSubmitSuccess(null)
  }

  const handleSaveItem = async () => {
    // Validate required fields
    if (!currentItem.title || (activeTab !== "gallery" && !currentItem.category)) {
      setSubmitError("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)
    setSubmitSuccess(null)

    try {
      // If we uploaded a new image, process it first
      if (uploadedImage && uploadedImage.startsWith("data:")) {
        // Convert data URL to file
        const response = await fetch(uploadedImage)
        const blob = await response.blob()
        const file = new File([blob], `${Date.now()}-image.${blob.type.split("/")[1] || "png"}`, { type: blob.type })

        // Upload file
        const formData = new FormData()
        formData.append("file", file)

        const uploadResponse = await uploadImage(formData)

        if (!uploadResponse.success) {
          throw new Error(uploadResponse.error || "Failed to upload image")
        }

        // Update the item with the new image URL
        if (activeTab === "gallery") {
          currentItem.src = uploadResponse.url
        } else {
          currentItem.image = uploadResponse.url
        }
      }

      // Save the item
      let result

      if (activeTab === "news") {
        result = await saveNewsItem(currentItem as NewsItem, language)
      } else if (activeTab === "projects") {
        result = await saveProjectItem(currentItem as ProjectItem, language)
      } else {
        // gallery
        result = await saveGalleryItem(currentItem as GalleryItem, language)
      }

      if (!result.success) {
        throw new Error(
          result.error ||
            `Failed to save ${activeTab === "gallery" ? "image" : activeTab === "projects" ? "project" : "news article"}`,
        )
      }

      setSubmitSuccess(
        result.message ||
          `${activeTab === "gallery" ? "Image" : activeTab === "projects" ? "Project" : "News article"} saved successfully`,
      )

      // Reload gallery data if we're on the gallery tab
      if (activeTab === "gallery") {
        loadGalleryData()
      }

      // Close the edit modal after a small delay to show the success message
      setTimeout(() => {
        setIsEditing(false)
        setCurrentItem(null)
        setUploadedImage(null)
      }, 1000)
    } catch (error: any) {
      console.error(`Error saving ${activeTab}:`, error)
      setSubmitError(error.message || `An error occurred while saving. Please try again.`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteConfirm = (id: number) => {
    setConfirmDelete(id)
  }

  const handleDeleteItem = async (id: number) => {
    setIsSubmitting(true)
    setSubmitError(null)
    setSubmitSuccess(null)

    try {
      let result

      if (activeTab === "news") {
        result = await deleteNewsItem(id, language)
      } else if (activeTab === "projects") {
        result = await deleteProjectItem(id, language)
      } else {
        // gallery
        result = await deleteGalleryItem(id, language)
      }

      if (!result.success) {
        throw new Error(
          result.error ||
            `Failed to delete ${activeTab === "gallery" ? "image" : activeTab === "projects" ? "project" : "news article"}`,
        )
      }

      setSubmitSuccess(
        result.message ||
          `${activeTab === "gallery" ? "Image" : activeTab === "projects" ? "Project" : "News article"} deleted successfully`,
      )

      // Reload gallery data if we're on the gallery tab
      if (activeTab === "gallery") {
        loadGalleryData()
      }

      setConfirmDelete(null)
    } catch (error: any) {
      console.error(`Error deleting ${activeTab}:`, error)
      setSubmitError(error.message || `An error occurred while deleting. Please try again.`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancelDelete = () => {
    setConfirmDelete(null)
  }

  // Sort and filter data
  const getSortedAndFilteredData = (dataType: string) => {
    let data =
      dataType === "news"
        ? [...newsData[language]]
        : dataType === "projects"
          ? [...projectsData[language]]
          : [...galleryImages]

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      if (dataType === "gallery") {
        data = data.filter(
          (item) => item.title.toLowerCase().includes(term) || item.category.toLowerCase().includes(term),
        )
      } else {
        data = data.filter(
          (item) =>
            item.title.toLowerCase().includes(term) ||
            (dataType === "news"
              ? item.excerpt.toLowerCase().includes(term)
              : item.description.toLowerCase().includes(term)),
        )
      }
    }

    // Sort data
    data.sort((a, b) => {
      const aValue = a[sortField as keyof typeof a]
      const bValue = b[sortField as keyof typeof b]

      // Handle string comparison
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }

      // Handle number comparison
      return sortDirection === "asc" ? (aValue > bValue ? 1 : -1) : aValue < bValue ? 1 : -1
    })

    return data
  }

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
          <div className="flex justify-center mb-6">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Primary%20logo%20-%20Colored%20%285%29-nHtP7NdgDU9QRWPwvJvhtFujJovJdi.png"
              alt="ENIT Junior Entreprise Logo"
              width={150}
              height={50}
              className="h-12 w-auto"
            />
          </div>

          <h1 className="text-2xl font-bold mb-6 text-center text-navy">Admin Login</h1>

          {authError && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <div className="relative">
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                  required
                  disabled={isLoading || isLocked}
                />
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                  required
                  disabled={isLoading || isLocked}
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <button
              type="submit"
              className={`w-full px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary-light transition-all duration-300 flex items-center justify-center ${isLoading || isLocked ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={isLoading || isLocked}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="animate-spin h-5 w-5 mr-2" />
                  Logging in...
                </>
              ) : (
                <>
                  <Lock className="h-5 w-5 mr-2" />
                  Login
                </>
              )}
            </button>

            <div className="text-sm text-gray-500 text-center mt-4 p-2 bg-yellow-50 rounded-md">
              <p className="font-medium text-yellow-700">Demo Credentials</p>
              <p>Username: admin</p>
              <p>Password: securepassword123!</p>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Status notifications */}
      {submitSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-green-100 text-green-800 px-4 py-3 rounded-md shadow-md flex items-center">
          <Check className="h-5 w-5 mr-2" />
          {submitSuccess}
        </div>
      )}

      {submitError && (
        <div className="fixed top-4 right-4 z-50 bg-red-100 text-red-800 px-4 py-3 rounded-md shadow-md flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          {submitError}
        </div>
      )}

      {/* Session timeout warning */}
      {showSessionWarning && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4 text-red-600 flex items-center">
              <AlertTriangle className="h-6 w-6 mr-2" />
              Session Timeout Warning
            </h3>
            <p className="mb-4">Your session will expire in {remainingTime} seconds due to inactivity.</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleLogout}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Logout
              </button>
              <button
                onClick={extendSession}
                className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary-light"
              >
                Stay Logged In
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-navy text-white hidden md:block">
          <div className="p-4 border-b border-navy-light">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Primary%20logo%20-%20Colored%20%285%29-nHtP7NdgDU9QRWPwvJvhtFujJovJdi.png"
              alt="ENIT Junior Entreprise Logo"
              width={120}
              height={40}
              className="h-10 w-auto mx-auto"
            />
          </div>

          <div className="p-4">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                <User className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-sm font-medium">Admin</p>
                <p className="text-xs text-gray-400">Administrator</p>
              </div>
            </div>

            <nav className="space-y-1">
              <button
                onClick={() => setActiveSection("dashboard")}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeSection === "dashboard" ? "bg-secondary text-white" : "text-gray-300 hover:bg-navy-light"
                }`}
              >
                <BarChart3 className="h-5 w-5" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => setActiveSection("content")}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeSection === "content" ? "bg-secondary text-white" : "text-gray-300 hover:bg-navy-light"
                }`}
              >
                <FileText className="h-5 w-5" />
                <span>Content</span>
              </button>

              <button
                onClick={() => setActiveSection("hr")}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeSection === "hr" ? "bg-secondary text-white" : "text-gray-300 hover:bg-navy-light"
                }`}
              >
                <Users className="h-5 w-5" />
                <span>HR Management</span>
              </button>

              <button
                onClick={() => setActiveSection("settings")}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeSection === "settings" ? "bg-secondary text-white" : "text-gray-300 hover:bg-navy-light"
                }`}
              >
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </button>
            </nav>
          </div>

          <div className="absolute bottom-0 left-0 w-64 p-4 border-t border-navy-light">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile sidebar */}
        <div className="fixed bottom-0 left-0 right-0 bg-navy text-white z-10 md:hidden">
          <div className="flex justify-around">
            <button
              onClick={() => setActiveSection("dashboard")}
              className={`flex flex-col items-center justify-center py-3 flex-1 ${
                activeSection === "dashboard" ? "text-secondary" : "text-gray-300"
              }`}
            >
              <BarChart3 className="h-5 w-5" />
              <span className="text-xs mt-1">Dashboard</span>
            </button>

            <button
              onClick={() => setActiveSection("content")}
              className={`flex flex-col items-center justify-center py-3 flex-1 ${
                activeSection === "content" ? "text-secondary" : "text-gray-300"
              }`}
            >
              <FileText className="h-5 w-5" />
              <span className="text-xs mt-1">Content</span>
            </button>

            <button
              onClick={() => setActiveSection("hr")}
              className={`flex flex-col items-center justify-center py-3 flex-1 ${
                activeSection === "hr" ? "text-secondary" : "text-gray-300"
              }`}
            >
              <Users className="h-5 w-5" />
              <span className="text-xs mt-1">HR</span>
            </button>

            <button
              onClick={() => setActiveSection("settings")}
              className={`flex flex-col items-center justify-center py-3 flex-1 ${
                activeSection === "settings" ? "text-secondary" : "text-gray-300"
              }`}
            >
              <Settings className="h-5 w-5" />
              <span className="text-xs mt-1">Settings</span>
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto pb-16 md:pb-0">
          {/* Header */}
          <header className="bg-white shadow-sm p-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-navy">
              {activeSection === "dashboard" && "Dashboard"}
              {activeSection === "content" && "Content Management"}
              {activeSection === "hr" && "HR Management"}
              {activeSection === "settings" && "Settings"}
            </h1>

            <div className="flex items-center space-x-4">
              <div className="text-sm">
                <span className="text-gray-500">Session expires: </span>
                <span className="font-medium">
                  {new Date(Number.parseInt(localStorage.getItem("tokenExpiry") || "0")).toLocaleTimeString()}
                </span>
              </div>

              <button onClick={extendSession} className="text-xs text-secondary hover:text-secondary-dark">
                Extend
              </button>

              <button onClick={handleLogout} className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </header>

          {/* Dashboard Section */}
          {activeSection === "dashboard" && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500">Total Visitors</p>
                      <h3 className="text-2xl font-bold mt-1">{seoStats.visitors.total.toLocaleString()}</h3>
                      <p className="text-xs text-green-600 mt-1 flex items-center">
                        <ChevronUp className="h-3 w-3 mr-1" />
                        {seoStats.visitors.change}% from last month
                      </p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-full">
                      <Users className="h-6 w-6 text-blue-500" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500">Page Views</p>
                      <h3 className="text-2xl font-bold mt-1">{seoStats.pageViews.total.toLocaleString()}</h3>
                      <p className="text-xs text-green-600 mt-1 flex items-center">
                        <ChevronUp className="h-3 w-3 mr-1" />
                        {seoStats.pageViews.change}% from last month
                      </p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-full">
                      <Eye className="h-6 w-6 text-purple-500" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500">Team Members</p>
                      <h3 className="text-2xl font-bold mt-1">{hrData.team.length}</h3>
                      <p className="text-xs text-gray-500 mt-1">Active members</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-full">
                      <UserCheck className="h-6 w-6 text-green-500" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500">Active Projects</p>
                      <h3 className="text-2xl font-bold mt-1">{hrData.projects.length}</h3>
                      <p className="text-xs text-gray-500 mt-1">In progress</p>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-full">
                      <Briefcase className="h-6 w-6 text-yellow-500" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-bold mb-4">Top Pages</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Page
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Views
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Bounce Rate
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {seoStats.topPages.map((page, index) => (
                          <tr key={index}>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                              {page.url}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{page.views}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{page.bounce}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-bold mb-4">Top Keywords</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Keyword
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Position
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Volume
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {seoStats.keywords.map((keyword, index) => (
                          <tr key={index}>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                              {keyword.term}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{keyword.position}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{keyword.volume}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-bold mb-4">Recent Applications</h3>
                  <div className="space-y-4">
                    {hrData.applications.map((app, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                            <User className="h-5 w-5 text-gray-500" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{app.name}</p>
                            <p className="text-xs text-gray-500">{app.position}</p>
                          </div>
                        </div>
                        <div>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              app.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : app.status === "interview"
                                  ? "bg-blue-100 text-blue-800"
                                  : app.status === "accepted"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                            }`}
                          >
                            {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-bold mb-4">Active Projects</h3>
                  <div className="space-y-4">
                    {hrData.projects.map((project, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-900">{project.name}</h4>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              project.status === "in-progress"
                                ? "bg-blue-100 text-blue-800"
                                : project.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {project.status === "in-progress"
                              ? "In Progress"
                              : project.status === "completed"
                                ? "Completed"
                                : "Planning"}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mb-2">Lead: {project.lead}</p>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 text-gray-400 mr-1" />
                            <span className="text-xs text-gray-500">{project.members} members</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                            <span className="text-xs text-gray-500">
                              Due: {new Date(project.deadline).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Content Management Section */}
          {activeSection === "content" && (
            <div className="p-6">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="mb-4 md:mb-0">
                      <h2 className="text-lg font-bold text-navy">Content Management</h2>
                      <p className="text-sm text-gray-500">Manage your website content</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary w-full"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => setActiveTab("news")}
                          className={`px-4 py-2 rounded-md ${
                            activeTab === "news"
                              ? "bg-secondary text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          News
                        </button>
                        <button
                          onClick={() => setActiveTab("projects")}
                          className={`px-4 py-2 rounded-md ${
                            activeTab === "projects"
                              ? "bg-secondary text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          Projects
                        </button>
                        <button
                          onClick={() => setActiveTab("gallery")}
                          className={`px-4 py-2 rounded-md ${
                            activeTab === "gallery"
                              ? "bg-secondary text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          Gallery
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-navy">
                      {activeTab === "news"
                        ? "Manage News Articles"
                        : activeTab === "projects"
                          ? "Manage Projects"
                          : "Manage Gallery"}
                    </h3>
                    <button
                      onClick={() =>
                        handleCreateItem(
                          activeTab === "gallery" ? "gallery" : activeTab === "projects" ? "project" : "news",
                        )
                      }
                      className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary-light transition-all duration-300 flex items-center"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <RefreshCw className="animate-spin h-4 w-4 mr-2" />
                      ) : (
                        <Plus className="h-4 w-4 mr-2" />
                      )}
                      {activeTab === "news" ? "Add News" : activeTab === "projects" ? "Add Project" : "Add Image"}
                    </button>
                  </div>

                  {activeTab === "gallery" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {isLoadingGallery ? (
                        // Loading skeleton
                        Array.from({ length: 6 }).map((_, index) => (
                          <div
                            key={index}
                            className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm animate-pulse"
                          >
                            <div className="h-48 bg-gray-200"></div>
                            <div className="p-4">
                              <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                              <div className="flex space-x-2">
                                <div className="h-8 w-8 bg-gray-200 rounded-md"></div>
                                <div className="h-8 w-8 bg-gray-200 rounded-md"></div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : getSortedAndFilteredData("gallery").length > 0 ? (
                        getSortedAndFilteredData("gallery").map((image: any, index) => (
                          <div
                            key={index}
                            className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm"
                          >
                            <div className="relative h-48">
                              <Image
                                src={image.src || "/placeholder.svg"}
                                alt={image.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="p-4">
                              <h4 className="font-medium text-gray-900 mb-1">{image.title}</h4>
                              <p className="text-sm text-gray-500 mb-3">{image.category}</p>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleEditItem(image)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                                  title="Edit"
                                  disabled={isSubmitting}
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                {confirmDelete === image.id ? (
                                  <div className="flex items-center space-x-1">
                                    <button
                                      onClick={() => handleDeleteItem(image.id)}
                                      className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                                      title="Confirm Delete"
                                      disabled={isSubmitting}
                                    >
                                      {isSubmitting ? (
                                        <RefreshCw className="animate-spin h-4 w-4" />
                                      ) : (
                                        <Check className="h-4 w-4" />
                                      )}
                                    </button>
                                    <button
                                      onClick={handleCancelDelete}
                                      className="p-2 text-gray-600 hover:bg-gray-50 rounded-md"
                                      title="Cancel"
                                      disabled={isSubmitting}
                                    >
                                      <X className="h-4 w-4" />
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => handleDeleteConfirm(image.id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                                    title="Delete"
                                    disabled={isSubmitting}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
                          <Search className="h-12 w-12 text-gray-300 mb-3" />
                          <p className="text-lg font-medium">No gallery images found</p>
                          <p className="text-sm mb-4">Add your first image to get started</p>
                          <button
                            onClick={() => handleCreateItem("gallery")}
                            className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary-light transition-all duration-300 flex items-center"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Image
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                              onClick={() => toggleSort("id")}
                            >
                              <div className="flex items-center">
                                ID
                                {sortField === "id" &&
                                  (sortDirection === "asc" ? (
                                    <ChevronUp className="h-4 w-4 ml-1" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4 ml-1" />
                                  ))}
                              </div>
                            </th>
                            <th
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                              onClick={() => toggleSort("title")}
                            >
                              <div className="flex items-center">
                                Title
                                {sortField === "title" &&
                                  (sortDirection === "asc" ? (
                                    <ChevronUp className="h-4 w-4 ml-1" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4 ml-1" />
                                  ))}
                              </div>
                            </th>
                            <th
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                              onClick={() => toggleSort("category")}
                            >
                              <div className="flex items-center">
                                Category
                                {sortField === "category" &&
                                  (sortDirection === "asc" ? (
                                    <ChevronUp className="h-4 w-4 ml-1" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4 ml-1" />
                                  ))}
                              </div>
                            </th>
                            {activeTab === "news" && (
                              <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                onClick={() => toggleSort("date")}
                              >
                                <div className="flex items-center">
                                  Date
                                  {sortField === "date" &&
                                    (sortDirection === "asc" ? (
                                      <ChevronUp className="h-4 w-4 ml-1" />
                                    ) : (
                                      <ChevronDown className="h-4 w-4 ml-1" />
                                    ))}
                                </div>
                              </th>
                            )}
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {getSortedAndFilteredData(activeTab).map((item: any) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.id}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{item.title}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-secondary/10 text-secondary">
                                  {item.category}
                                </span>
                              </td>
                              {activeTab === "news" && (
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
                              )}
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => router.push(`/${activeTab}/${item.id}`)}
                                    className="text-indigo-600 hover:text-indigo-900"
                                    title="View"
                                    disabled={isSubmitting}
                                  >
                                    <Eye className="h-5 w-5" />
                                  </button>
                                  <button
                                    onClick={() => handleEditItem(item)}
                                    className="text-blue-600 hover:text-blue-900"
                                    title="Edit"
                                    disabled={isSubmitting}
                                  >
                                    <Edit className="h-5 w-5" />
                                  </button>
                                  {confirmDelete === item.id ? (
                                    <div className="flex items-center space-x-1">
                                      <button
                                        onClick={() => handleDeleteItem(item.id)}
                                        className="text-red-600 hover:text-red-900"
                                        title="Confirm Delete"
                                        disabled={isSubmitting}
                                      >
                                        {isSubmitting ? (
                                          <RefreshCw className="animate-spin h-5 w-5" />
                                        ) : (
                                          <Check className="h-5 w-5" />
                                        )}
                                      </button>
                                      <button
                                        onClick={handleCancelDelete}
                                        className="text-gray-600 hover:text-gray-900"
                                        title="Cancel"
                                        disabled={isSubmitting}
                                      >
                                        <X className="h-5 w-5" />
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => handleDeleteConfirm(item.id)}
                                      className="text-red-600 hover:text-red-900"
                                      title="Delete"
                                      disabled={isSubmitting}
                                    >
                                      <Trash2 className="h-5 w-5" />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}

                          {getSortedAndFilteredData(activeTab).length === 0 && (
                            <tr>
                              <td
                                colSpan={activeTab === "news" ? 5 : 4}
                                className="px-6 py-8 text-center text-gray-500"
                              >
                                <div className="flex flex-col items-center">
                                  <Search className="h-10 w-10 text-gray-300 mb-2" />
                                  <p className="text-lg font-medium">No items found</p>
                                  <p className="text-sm">Try adjusting your search or filters</p>
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* HR Management Section */}
          {activeSection === "hr" && (
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold">Team Overview</h3>
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full">
                      <UserPlus className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <p className="text-gray-500">Total Members</p>
                      <p className="font-bold">{hrData.team.length}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-gray-500">Departments</p>
                      <p className="font-bold">{hrData.departments.length}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-gray-500">Active Projects</p>
                      <p className="font-bold">{hrData.projects.length}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-gray-500">New Applications</p>
                      <p className="font-bold">{hrData.applications.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-bold mb-4">Department Distribution</h3>
                  <div className="space-y-3">
                    {hrData.departments.map((dept, index) => (
                      <div key={index}>
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-sm text-gray-600">{dept.name}</p>
                          <p className="text-sm font-medium">{dept.members} members</p>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-secondary h-2 rounded-full"
                            style={{ width: `${(dept.members / hrData.team.length) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-bold mb-4">Recent Applications</h3>
                  <div className="space-y-3">
                    {hrData.applications.map((app, index) => (
                      <div key={index} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-md">
                        <div>
                          <p className="font-medium">{app.name}</p>
                          <p className="text-xs text-gray-500">{app.position}</p>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            app.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : app.status === "interview"
                                ? "bg-blue-100 text-blue-800"
                                : app.status === "accepted"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                          }`}
                        >
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold">Team Members</h3>
                    <button className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary-light transition-all duration-300 flex items-center">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add Member
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Position
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Department
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Join Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {hrData.team.map((member, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <User className="h-5 w-5 text-gray-500" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{member.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.position}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-secondary/10 text-secondary">
                              {member.department}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Active
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(member.joinDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button className="text-blue-600 hover:text-blue-900">
                                <Edit className="h-5 w-5" />
                              </button>
                              <button className="text-red-600 hover:text-red-900">
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Settings Section */}
          {activeSection === "settings" && (
            <div className="p-6">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-bold">Account Settings</h3>
                </div>

                <div className="p-6">
                  <div className="max-w-2xl">
                    <div className="mb-6">
                      <h4 className="text-md font-medium mb-4">Profile Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                          <input
                            type="text"
                            value="admin"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                            disabled
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                          <input
                            type="email"
                            value="admin@enitje.com"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-md font-medium mb-4">Change Password</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                          <input
                            type="password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                          <input
                            type="password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                          <input
                            type="password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-md font-medium mb-4">Security Settings</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Two-Factor Authentication</p>
                            <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                          </div>
                          <div className="relative">
                            <input type="checkbox" id="toggle" className="sr-only" />
                            <div className="block bg-gray-200 w-14 h-8 rounded-full"></div>
                            <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"></div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Session Timeout</p>
                            <p className="text-sm text-gray-500">Automatically log out after inactivity</p>
                          </div>
                          <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary">
                            <option value="15">15 minutes</option>
                            <option value="30" selected>
                              30 minutes
                            </option>
                            <option value="60">60 minutes</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button className="px-6 py-2 bg-secondary text-white rounded-md hover:bg-secondary-light transition-all duration-300">
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit/Create Modal */}
      {isEditing && currentItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-bold text-navy">
                {activeTab === "gallery"
                  ? "Edit Image"
                  : activeTab === "projects"
                    ? "Edit Project"
                    : "Edit News Article"}
              </h3>
              <button
                onClick={() => {
                  setIsEditing(false)
                  setCurrentItem(null)
                  setUploadedImage(null)
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={currentItem.title}
                    onChange={(e) => setCurrentItem({ ...currentItem, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                    required
                  />
                </div>

                {activeTab !== "gallery" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={currentItem.category}
                      onChange={(e) => setCurrentItem({ ...currentItem, category: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                      required
                    />
                  </div>
                )}

                {activeTab === "gallery" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={currentItem.category}
                      onChange={(e) => setCurrentItem({ ...currentItem, category: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                      required
                    >
                      <option value="">Select a category</option>
                      <option value="Events">Events</option>
                      <option value="Projects">Projects</option>
                      <option value="Workshops">Workshops</option>
                      <option value="Team">Team</option>
                    </select>
                  </div>
                )}

                {activeTab === "news" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="text"
                      value={currentItem.date}
                      onChange={(e) => setCurrentItem({ ...currentItem, date: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                  <div className="mt-1 flex items-center">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-all duration-300 flex items-center"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <RefreshCw className="animate-spin h-4 w-4 mr-2" />
                      ) : (
                        <Upload className="h-4 w-4 mr-2" />
                      )}
                      Upload Image
                    </button>
                  </div>
                  <div className="mt-2 p-2 border border-gray-200 rounded-md">
                    <p className="text-xs text-gray-500 mb-1">Image Preview:</p>
                    <div className="relative h-40 bg-gray-100 rounded overflow-hidden">
                      <Image
                        src={
                          uploadedImage ||
                          (activeTab === "gallery" ? currentItem.src : currentItem.image) ||
                          "/placeholder.svg"
                        }
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>

                {activeTab !== "gallery" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {activeTab === "news" ? "Excerpt" : "Description"} <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={activeTab === "news" ? currentItem.excerpt : currentItem.description}
                      onChange={(e) =>
                        setCurrentItem({
                          ...currentItem,
                          [activeTab === "news" ? "excerpt" : "description"]: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                      required
                    />
                  </div>
                )}

                {activeTab === "news" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                    <textarea
                      value={currentItem.content || ""}
                      onChange={(e) => setCurrentItem({ ...currentItem, content: e.target.value })}
                      rows={10}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                    <p className="text-xs text-gray-500 mt-1">You can use HTML tags for formatting.</p>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setIsEditing(false)
                    setCurrentItem(null)
                    setUploadedImage(null)
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveItem}
                  className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary-light transition-all duration-300 flex items-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <RefreshCw className="animate-spin h-4 w-4 mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

