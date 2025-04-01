"use client"
import Link from "next/link"
import type React from "react"

import Image from "next/image"
import { Facebook, Linkedin, Instagram, Youtube, Mail, Phone, MapPin, ArrowRight, Send } from "lucide-react"
import { useLanguage } from "../contexts/LanguageContext"
import { useState } from "react"

export default function Footer() {
  const { language } = useLanguage()
  const currentYear = new Date().getFullYear()
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      // Here you would typically send the email to your API
      setSubscribed(true)
      setTimeout(() => {
        setSubscribed(false)
        setEmail("")
      }, 3000)
    }
  }

  return (
    <footer className="bg-navy text-white">
      {/* Newsletter Section */}
      <div className="bg-navy-light/30 py-10">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto bg-navy-light/50 rounded-xl p-6 sm:p-8 backdrop-blur-sm border border-white/10 shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-3">
                <h3 className="text-2xl sm:text-2xl font-bold">
                  <span className="text-secondary">{language === "fr" ? "Restez" : "Stay"}</span>{" "}
                  {language === "fr" ? "Informé" : "Informed"}
                </h3>
                <p className="text-gray-300 text-sm sm:text-base max-w-md">
                  {language === "fr"
                    ? "Abonnez-vous à notre newsletter pour recevoir les dernières actualités et offres exclusives."
                    : "Subscribe to our newsletter to receive the latest news and exclusive offers."}
                </p>
              </div>
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <div className="relative flex-grow">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={language === "fr" ? "Votre adresse email" : "Your email address"}
                    className="px-4 py-3 rounded-full bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-secondary text-white placeholder-gray-400 w-full pr-10"
                    required
                  />
                  <Mail className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-secondary text-white rounded-full hover:bg-secondary-light transition-all duration-300 whitespace-nowrap flex items-center justify-center gap-2 font-medium group"
                >
                  {language === "fr" ? "S'abonner" : "Subscribe"}
                  <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </div>

            {/* Success Message */}
            {subscribed && (
              <div className="mt-4 bg-green-500/20 border border-green-500/30 text-green-200 px-4 py-2 rounded-lg flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                {language === "fr"
                  ? "Merci pour votre inscription! Vous recevrez bientôt nos actualités."
                  : "Thank you for subscribing! You'll receive our news soon."}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Logo and Description */}
          <div className="space-y-6">
            <Link href="/" className="inline-block">
              <Image
                src="/images/logow.webp"
                alt="ENIT Junior Entreprise Logo"
                width={180}
                height={60}
                className="h-12 w-auto"
              />
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed">
              {language === "fr"
                ? "ENIT Junior Entreprise est une association d'étudiants qui offre des services de conseil et de développement aux entreprises, favorisant l'innovation et l'excellence."
                : "ENIT Junior Entreprise is a student association that offers consulting and development services to businesses, promoting innovation and excellence."}
            </p>
            <div className="flex space-x-3">
              <Link
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary hover:scale-110 transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </Link>
              <Link
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary hover:scale-110 transition-all duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </Link>
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary hover:scale-110 transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </Link>
              <Link
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary hover:scale-110 transition-all duration-300"
                aria-label="YouTube"
              >
                <Youtube size={18} />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-2">
            <h3 className="text-xl text-turquoise font-bold mb-6 flex items-center">
              <span className="w-8 h-0.5 bg-secondary mr-3"></span>
              {language === "fr" ? "Liens Rapides" : "Quick Links"}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-secondary transition-colors duration-300 flex items-center group"
                >
                  <ArrowRight className="w-4 h-4 mr-2 text-secondary opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                  {language === "fr" ? "Accueil" : "Home"}
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-300 hover:text-secondary transition-colors duration-300 flex items-center group"
                >
                  <ArrowRight className="w-4 h-4 mr-2 text-secondary opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                  {language === "fr" ? "À Propos" : "About"}
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-gray-300 hover:text-secondary transition-colors duration-300 flex items-center group"
                >
                  <ArrowRight className="w-4 h-4 mr-2 text-secondary opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                  {language === "fr" ? "Services" : "Services"}
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="text-gray-300 hover:text-secondary transition-colors duration-300 flex items-center group"
                >
                  <ArrowRight className="w-4 h-4 mr-2 text-secondary opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                  {language === "fr" ? "Projets" : "Projects"}
                </Link>
              </li>
              <li>
                <Link
                  href="/news"
                  className="text-gray-300 hover:text-secondary transition-colors duration-300 flex items-center group"
                >
                  <ArrowRight className="w-4 h-4 mr-2 text-secondary opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                  {language === "fr" ? "Actualités" : "News"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Our Services */}
          <div className="mt-2">
            <h3 className="text-xl text-turquoise font-bold mb-6 flex items-center">
              <span className="w-8 h-0.5 bg-secondary mr-3"></span>
              {language === "fr" ? "Nos Services" : "Our Services"}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/services/it"
                  className="text-gray-300 hover:text-secondary transition-colors duration-300 flex items-center group"
                >
                  <ArrowRight className="w-4 h-4 mr-2 text-secondary opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                  {language === "fr" ? "TIC" : "ICT"}
                </Link>
              </li>
              <li>
                <Link
                  href="/services/consulting"
                  className="text-gray-300 hover:text-secondary transition-colors duration-300 flex items-center group"
                >
                  <ArrowRight className="w-4 h-4 mr-2 text-secondary opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                  {language === "fr" ? "Consulting" : "Consulting"}
                </Link>
              </li>
              <li>
                <Link
                  href="/services/mechanical"
                  className="text-gray-300 hover:text-secondary transition-colors duration-300 flex items-center group"
                >
                  <ArrowRight className="w-4 h-4 mr-2 text-secondary opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                  {language === "fr" ? "Conception Mécanique" : "Mechanical Design"}
                </Link>
              </li>
              <li>
                <Link
                  href="/services/electrical"
                  className="text-gray-300 hover:text-secondary transition-colors duration-300 flex items-center group"
                >
                  <ArrowRight className="w-4 h-4 mr-2 text-secondary opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                  {language === "fr" ? "Conception Électrique" : "Electrical Design"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="mt-2">
            <h3 className="text-xl text-turquoise font-bold mb-6 flex items-center">
              <span className="w-8 h-0.5 bg-secondary mr-3"></span>
              {language === "fr" ? "Contact" : "Contact"}
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start group">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-4 group-hover:bg-secondary transition-all duration-300 flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-300 mb-1">{language === "fr" ? "Email" : "Email"}</p>
                  <a
                    href="mailto:contact@enitje.com"
                    className="text-white hover:text-secondary transition-colors duration-300"
                  >
                    contact@enitje.com
                  </a>
                </div>
              </li>
              <li className="flex items-start group">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-4 group-hover:bg-secondary transition-all duration-300 flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-300 mb-1">{language === "fr" ? "Téléphone" : "Phone"}</p>
                  <a href="tel:+21628774416" className="text-white hover:text-secondary transition-colors duration-300">
                    +216 28 774 416
                  </a>
                </div>
              </li>
              <li className="flex items-start group">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-4 group-hover:bg-secondary transition-all duration-300 flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-300 mb-1">{language === "fr" ? "Adresse" : "Address"}</p>
                  <span className="text-white">
                    {language === "fr"
                      ? "École Nationale d'Ingénieurs de Tunis, Campus Universitaire El Manar, 2092 Tunis"
                      : "National Engineering School of Tunis, El Manar University Campus, 2092 Tunis"}
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-white/10 py-6">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6">
              <p className="text-white text-sm">
                © {currentYear} ENIT Junior Entreprise.{" "}
                {language === "fr" ? "Tous droits réservés." : "All rights reserved."}
              </p>
              <div className="flex items-center space-x-2 text-white">
                <span className="hidden sm:inline">•</span>
                <Link
                  href="/etats-financiers"
                  className="text-white hover:text-secondary transition-colors duration-300 text-sm"
                >
                  {language === "fr" ? "États Financiers" : "Financial Statements"}
                </Link>
                <span>•</span>
                <Link
                  href="/politique-qualite"
                  className="text-white hover:text-secondary transition-colors duration-300 text-sm"
                >
                  {language === "fr" ? "Politique Qualité" : "Quality Policy"}
                </Link>
              </div>
            </div>

            <div className="flex items-center">
              <span className="text-sm text-white">
                {language === "fr" ? "Conçu avec" : "Designed with"}{" "}
                <span className="text-red-500 animate-pulse">❤</span> {language === "fr" ? "par" : "by"}{" "}
                <a href="#" className="text-secondary hover:underline">
                  ENIT Junior Entreprise
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

