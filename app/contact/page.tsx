"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { MapPin, Phone, Mail, Send, Linkedin, Facebook, Instagram } from "lucide-react"

import Header from "../components/Header"
import Footer from "../components/Footer"
import PageHeader from "../components/PageHeader"

// Import translations
import { translations } from "../translations"
import { getThemePreference, setThemePreference } from '../utils/theme'

interface FormData {
  name: string
  email: string
  subject: string
  message: string
}

export default function ContactPage() {
  const [darkMode, setDarkMode] = useState(true)
  const [language, setLanguage] = useState<"fr" | "en">("fr")
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // Get translations based on current language
  const t = translations[language]

  // Initialize theme on mount
  useEffect(() => {
    const theme = getThemePreference()
    setDarkMode(theme === 'dark')
    setThemePreference(theme)
  }, [])

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newTheme = !prev ? 'dark' : 'light'
      setThemePreference(newTheme)
      return !prev
    })
  }

  // Set language
  const toggleLanguage = (lang: "fr" | "en") => {
    setLanguage(lang)
  }

  // Apply dark mode class to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitSuccess(true)
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      })

      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false)
      }, 5000)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden transition-colors duration-300">
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} language={language} toggleLanguage={toggleLanguage} />

      <PageHeader
        title={language === "fr" ? "Contactez-Nous" : "Contact Us"}
        subtitle={
          language === "fr"
            ? "Prenez contact avec notre équipe pour discuter de votre projet ou poser des questions"
            : "Get in touch with our team to discuss your project or ask any questions"
        }
      />

      {/* Contact Form & Info */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-block bg-secondary/10 px-4 py-1 rounded-full mb-4">
                <span className="text-secondary font-medium tracking-widest text-sm">
                  {language === "fr" ? "CONTACTEZ-NOUS" : "GET IN TOUCH"}
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 gradient-text">
                {language === "fr" ? "Informations de Contact" : "Contact Information"}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                {language === "fr"
                  ? "Vous avez une question ou souhaitez discuter d'un projet potentiel ? Nous serions ravis d'avoir de vos nouvelles ! Remplissez le formulaire ou utilisez nos coordonnées ci-dessous pour contacter notre équipe."
                  : "Have a question or want to discuss a potential project? We'd love to hear from you! Fill out the form or use our contact information below to get in touch with our team."}
              </p>

              <div className="space-y-6 mb-8">
                <div className="flex items-start">
                  <div className="bg-secondary/10 p-3 rounded-full mr-4">
                    <MapPin className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1 text-navy dark:text-white">
                      {language === "fr" ? "Notre Emplacement" : "Our Location"}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">ENIT Campus, Tunis, Tunisia</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-secondary/10 p-3 rounded-full mr-4">
                    <Mail className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1 text-navy dark:text-white">
                      {language === "fr" ? "Email" : "Email Us"}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">contact@enitjunior.com</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-secondary/10 p-3 rounded-full mr-4">
                    <Phone className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1 text-navy dark:text-white">
                      {language === "fr" ? "Téléphone" : "Call Us"}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">+216 XX XXX XXX</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold mb-4 text-navy dark:text-white">
                  {language === "fr" ? "Suivez-Nous" : "Follow Us"}
                </h3>
                <div className="flex space-x-4">
                  <a
                    href="#"
                    className="bg-secondary/10 p-3 rounded-full text-secondary hover:bg-secondary hover:text-white transition-all duration-300"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                  <a
                    href="#"
                    className="bg-secondary/10 p-3 rounded-full text-secondary hover:bg-secondary hover:text-white transition-all duration-300"
                  >
                    <Facebook className="h-5 w-5" />
                  </a>
                  <a
                    href="#"
                    className="bg-secondary/10 p-3 rounded-full text-secondary hover:bg-secondary hover:text-white transition-all duration-300"
                  >
                    <Instagram className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-white dark:bg-navy/50 p-8 rounded-lg shadow-lg">
                <h3 className="text-2xl font-bold mb-6 text-navy dark:text-white">
                  {language === "fr" ? "Envoyez-Nous un Message" : "Send Us a Message"}
                </h3>

                {submitSuccess && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                    <p>
                      {language === "fr"
                        ? "Votre message a été envoyé avec succès ! Nous vous répondrons bientôt."
                        : "Your message has been sent successfully! We'll get back to you soon."}
                    </p>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
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
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent bg-white dark:bg-navy/30 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div className="mb-4">
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
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent bg-white dark:bg-navy/30 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      {language === "fr" ? "Sujet" : "Subject"}
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent bg-white dark:bg-navy/30 text-gray-900 dark:text-white"
                    >
                      <option value="">{language === "fr" ? "Sélectionnez un sujet" : "Select a subject"}</option>
                      <option value="General Inquiry">
                        {language === "fr" ? "Demande Générale" : "General Inquiry"}
                      </option>
                      <option value="Project Request">
                        {language === "fr" ? "Demande de Projet" : "Project Request"}
                      </option>
                      <option value="Partnership">{language === "fr" ? "Partenariat" : "Partnership"}</option>
                      <option value="Careers">{language === "fr" ? "Carrières" : "Careers"}</option>
                      <option value="Other">{language === "fr" ? "Autre" : "Other"}</option>
                    </select>
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      {language === "fr" ? "Votre Message" : "Your Message"}
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent bg-white dark:bg-navy/30 text-gray-900 dark:text-white"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-6 py-3 bg-secondary text-white rounded-lg hover:bg-secondary-light transition-all duration-300 flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <span>{language === "fr" ? "Envoi en cours..." : "Sending..."}</span>
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        <span>{language === "fr" ? "Envoyer le Message" : "Send Message"}</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-gray-50 dark:bg-navy/80">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-block bg-secondary/10 px-4 py-1 rounded-full mb-4">
              <span className="text-secondary font-medium tracking-widest text-sm">
                {language === "fr" ? "TROUVEZ-NOUS" : "FIND US"}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-6">
              {language === "fr" ? "Notre Emplacement" : "Our Location"}
            </h2>
          </div>

          <div className="rounded-lg overflow-hidden shadow-lg">
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

      <Footer language={language} toggleLanguage={toggleLanguage} />
    </div>
  )
}

