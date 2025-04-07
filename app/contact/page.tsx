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

interface FormData {
  name: string
  email: string
  subject: string
  message: string
  category: string
}

export default function ContactPage() {
  const [darkMode, setDarkMode] = useState(true)
  const { language, setLanguage } = useLanguage()
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
    category: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Get translations based on current language
  const t = translations[language]

  // Initialize theme on mount
  useEffect(() => {
    const theme = getThemePreference()
    setDarkMode(theme === 'dark')
    setThemePreference(theme)
    
    // Apply dark mode class immediately
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newTheme = !prev ? "dark" : "light"
      setThemePreference(newTheme)
      return !prev
    })
  }

  // Set language
  const toggleLanguage = (lang?: "fr" | "en") => {
    if (lang) {
      setLanguage(lang)
    } else {
      setLanguage(language === "fr" ? "en" : "fr")
    }
  }

  // Apply dark mode class to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  // Categories for the dropdown
  const categories = language === "fr" 
    ? [
        { value: "", label: "Sélectionnez une catégorie" },
        { value: "general", label: "Demande générale" },
        { value: "project", label: "Proposition de projet" },
        { value: "information", label: "Demande d'information" },
        { value: "service", label: "Service spécifique" },
        { value: "partnership", label: "Partenariat" },
        { value: "other", label: "Autre" }
      ] 
    : [
        { value: "", label: "Select a category" },
        { value: "general", label: "General inquiry" },
        { value: "project", label: "Project proposal" },
        { value: "information", label: "Information request" },
        { value: "service", label: "Specific service" },
        { value: "partnership", label: "Partnership" },
        { value: "other", label: "Other" }
      ]

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Send email function
  const sendEmail = async (data: FormData) => {
    try {
      console.log('Sending form data:', data);
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          subject: data.subject,
          message: data.message,
          category: data.category,
        }),
      });

      const result = await response.json();
      console.log('API Response:', result);
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to send message');
      }
      
      return { success: true, messageId: result.id };
    } catch (error: any) {
      console.error('Error sending email:', error);
      throw new Error(error.message || 'Failed to send message');
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      console.log('Form submission started');
      const result = await sendEmail(formData);
      console.log('Form submission result:', result);
      setSubmitSuccess(true);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        category: ""
      });

      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error: any) {
      console.error('Form submission error:', error);
      setSubmitError(
        language === "fr" 
          ? `Une erreur s'est produite: ${error.message || "Veuillez réessayer."}`
          : `An error occurred: ${error.message || "Please try again."}`
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  // Add the success message component
  const SuccessMessage = () => {
    return (
      <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-500/50 rounded-lg p-4 md:p-6 mb-6">
        <div className="flex items-start space-x-3 md:space-x-4">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-500 dark:text-green-400" />
            </div>
          </div>
          <div className="flex-1">
            <h4 className="text-sm md:text-base font-medium text-green-800 dark:text-green-200 mb-1">
              {language === "fr" ? "Message Envoyé avec Succès!" : "Message Sent Successfully!"}
            </h4>
            <p className="text-sm text-green-700 dark:text-green-300">
              {language === "fr" 
                ? "Nous avons bien reçu votre message. Notre équipe vous répondra dans les plus brefs délais." 
                : "We have received your message. Our team will get back to you as soon as possible."}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#28384d] text-gray-800 dark:text-white transition-colors duration-300">
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} language={language} toggleLanguage={toggleLanguage} />

      <PageHeader
        title={language === "fr" ? "Contactez-Nous" : "Contact Us"}
        subtitle={
          language === "fr"
            ? "Prenez contact avec notre équipe pour discuter de votre projet ou poser des questions"
            : "Get in touch with our team to discuss your project or ask any questions"
        }
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        language={language}
        toggleLanguage={toggleLanguage}
      />

      {/* Contact Form & Info */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Contact Information */}
            <div className="space-y-6 lg:space-y-8">
              <div className="inline-block bg-[#00adb5]/10 px-4 py-1 rounded-full mb-4">
                <span className="text-[#00adb5] font-medium tracking-widest text-sm">
                  {language === "fr" ? "CONTACTEZ-NOUS" : "GET IN TOUCH"}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                {language === "fr" ? "Informations de Contact" : "Contact Information"}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {language === "fr"
                  ? "Vous avez une question ou souhaitez discuter d'un projet potentiel ? Nous serions ravis d'avoir de vos nouvelles !"
                  : "Have a question or want to discuss a potential project? We'd love to hear from you!"}
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-[#00adb5]/10 flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-[#00adb5]" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {language === "fr" ? "Adresse" : "Address"}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {language === "fr" 
                        ? "École Nationale d'Ingénieurs de Tunis, Campus Universitaire El Manar, Tunis, Tunisie" 
                        : "National School of Engineers of Tunis, El Manar University Campus, Tunis, Tunisia"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-[#00adb5]/10 flex items-center justify-center">
                      <Phone className="h-5 w-5 text-[#00adb5]" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {language === "fr" ? "Téléphone" : "Phone"}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">+216 71 874 700</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-[#00adb5]/10 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-[#00adb5]" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {language === "fr" ? "Email" : "Email"}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">contact@enitje.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white dark:bg-[#1a1a1a] rounded-xl shadow-lg p-6 md:p-8">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-6">
                {language === "fr" ? "Envoyez-Nous un Message" : "Send Us a Message"}
              </h3>

              {submitError && (
                <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-500/50 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-6">
                  <p>{submitError}</p>
                </div>
              )}
              
              {submitSuccess && <SuccessMessage />}

              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {language === "fr" ? "Votre Nom" : "Your Name"}
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#00adb5] focus:border-transparent bg-white dark:bg-[#28384d]/30 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {language === "fr" ? "Votre Email" : "Your Email"}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#00adb5] focus:border-transparent bg-white dark:bg-[#28384d]/30 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {language === "fr" ? "Catégorie" : "Category"}
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#00adb5] focus:border-transparent bg-white dark:bg-[#28384d]/30 text-gray-900 dark:text-white"
                  >
                    {categories.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {language === "fr" ? "Sujet" : "Subject"}
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#00adb5] focus:border-transparent bg-white dark:bg-[#28384d]/30 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {language === "fr" ? "Votre Message" : "Your Message"}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#00adb5] focus:border-transparent bg-white dark:bg-[#28384d]/30 text-gray-900 dark:text-white resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-6 rounded-lg bg-[#00adb5] text-white font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
                    isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-[#00adb5]/90"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                      <span>{language === "fr" ? "Envoi en cours..." : "Sending..."}</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      <span>{language === "fr" ? "Envoyer le Message" : "Send Message"}</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-gray-50 dark:bg-[#28384d]/80">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-block bg-[#00adb5]/10 px-4 py-1 rounded-full mb-4">
              <span className="text-[#00adb5] font-medium tracking-widest text-sm">
                {language === "fr" ? "TROUVEZ-NOUS" : "FIND US"}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-6">
              {language === "fr" ? "Notre Emplacement" : "Our Location"}
            </h2>
          </div>

          <div className="rounded-lg overflow-hidden shadow-lg border border-gray-100 dark:border-white/5">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3929.467457613898!2d10.145954299999998!3d36.831168999999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fd3387f340563f%3A0x975dab74a0d561a!2sENIT%20Junior%20Entreprise!5e1!3m2!1sen!2stn!4v1743091624481!5m2!1sen!2stn"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="ENIT Location"
            ></iframe>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}



