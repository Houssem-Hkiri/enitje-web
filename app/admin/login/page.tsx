"use client"

import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Lock, User, Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      setError("Please enter both email and password")
      return
    }
    
    try {
      setError(null)
      setLoading(true)
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        throw error
      }
      
      // Redirect to admin dashboard if login was successful
      router.push("/admin")
      router.refresh()
    } catch (error: any) {
      setError(error.message || "Failed to login")
      console.error("Login error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-navy-light to-navy">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white p-8 shadow-xl dark:bg-navy-light">
        <div className="mb-6 flex justify-center">
          <Image
            src="/images/logo.png"
            alt="ENIT Junior Entreprise"
            width={160}
            height={55}
            priority
            className="h-auto w-auto"
          />
        </div>
        
        <h2 className="mb-6 text-center text-3xl font-bold tracking-tight text-navy dark:text-white">
          Admin Login
        </h2>
        
        {error && (
          <div className="mb-4 rounded bg-red-50 p-4 text-red-700 dark:bg-red-900/30 dark:text-red-200">
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 pl-10 pr-4 text-gray-700 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/50 dark:border-gray-700 dark:bg-navy/50 dark:text-white dark:placeholder-gray-400 dark:focus:border-secondary"
                placeholder="admin@example.com"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 pl-10 pr-10 text-gray-700 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/50 dark:border-gray-700 dark:bg-navy/50 dark:text-white dark:placeholder-gray-400 dark:focus:border-secondary"
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" />
                )}
              </button>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-secondary px-5 py-3 text-center text-base font-semibold text-white transition-all hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:ring-offset-2 disabled:opacity-70"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>
      </div>
    </div>
  )
} 