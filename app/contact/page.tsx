"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { MapPin, Phone, Mail, Send, Linkedin, Facebook, Instagram, CheckCircle } from "lucide-react"

import Header from "../components/Header"
import PageHeader from "../components/PageHeader"
import Footer from "../components/Footer"

// Import translations and context
import { translations } from "../translations"
import { getThemePreference, setThemePreference } from '../utils/theme'
import { useLanguage } from "../contexts/LanguageContext"
import { createClient } from '@/lib/supabase-server'
import ContactForm from './ContactForm'

interface FormData {
  name: string
  email: string
  subject: string
  message: string
  category: string
}

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
        <ContactForm categories={categories || []} />
      </div>
    </div>
  )
}



