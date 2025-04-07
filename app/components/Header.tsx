"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Sun, Moon, ChevronDown, Globe, Mail } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useLanguage } from "../contexts/LanguageContext"

interface HeaderProps {
  darkMode: boolean
  toggleDarkMode: () => void
  language: "fr" | "en"
  toggleLanguage: (lang?: "fr" | "en") => void
}

export default function Header({ darkMode, toggleDarkMode, language, toggleLanguage }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null)
  const [isInMobileView, setIsInMobileView] = useState(false)
  const pathname = usePathname()
  const { setLanguage } = useLanguage()
  const headerRef = useRef<HTMLElement>(null)

  // Force all dropdowns to stay open in mobile view
  useEffect(() => {
    if (isInMobileView) {
      setDropdownOpen("all")
    }
  }, [isInMobileView, darkMode, language]) // Re-run when these change

  // Check if page is scrolled
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false)
    setIsInMobileView(false)
    setDropdownOpen(null)
  }, [pathname])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownOpen && !(event.target as Element).closest(".dropdown-trigger")) {
        setDropdownOpen(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [dropdownOpen])

  // Preserve mobile view state when toggling theme or language
  const handleThemeToggle = () => {
    if (typeof toggleDarkMode === 'function') {
      toggleDarkMode()
    }
  }

  const handleLanguageToggle = () => {
    setLanguage(language === "fr" ? "en" : "fr")
  }

  // Navigation items with translations and dropdowns
  const navItems = [
    {
      path: "/",
      labelFr: "ACCUEIL",
      labelEn: "HOME",
      dropdown: false,
    },
    {
      path: "/about",
      labelFr: "À PROPOS",
      labelEn: "ABOUT",
      dropdown: true,
      dropdownItems: [
        { path: "/about#story", labelFr: "Notre Histoire", labelEn: "Our Story" },
        { path: "/about#timeline", labelFr: "Parcours", labelEn: "Journey" },
        { path: "/about#values", labelFr: "Valeurs", labelEn: "Values" },
        { path: "/about#mission", labelFr: "Mission", labelEn: "Mission" },
        { path: "/about#team", labelFr: "Notre Équipe", labelEn: "Our Team" },
        { path: "/about#gallery", labelFr: "Galerie", labelEn: "Gallery" },
        { path: "/about/financial-statement", labelFr: "État Financier", labelEn: "Financial Statement" },
        { path: "/about/quality-policy", labelFr: "Politique Qualité", labelEn: "Quality Policy" }
      ],
    },
    {
      path: "/services",
      labelFr: "SERVICES",
      labelEn: "SERVICES",
      dropdown: true,
      dropdownItems: [
        { path: "/services/it", labelFr: "TIC", labelEn: "ICT" },
        { path: "/services/consulting", labelFr: "Consulting", labelEn: "Consulting" },
        { path: "/services/mechanical", labelFr: "Mécanique", labelEn: "Mechanical" },
        { path: "/services/electrical", labelFr: "Électrique", labelEn: "Electrical" },
      ],
    },
    {
      path: "/projects",
      labelFr: "PROJETS",
      labelEn: "PROJECTS",
      dropdown: false,
    },
    {
      path: "/news",
      labelFr: "ACTUALITÉS",
      labelEn: "NEWS",
      dropdown: false,
    },
    {
      path: "/contact",
      labelFr: "CONTACT",
      labelEn: "CONTACT",
      dropdown: false,
    },
  ]

  // Check if link is active
  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname.startsWith(path)) return true
    return false
  }

  // Check if we're on one of the special pages
  const isSpecialPage = pathname === "/etats-financiers" || pathname === "/politique-qualite" || pathname === "/contact"

  // Toggle dropdown
  const toggleDropdown = (key: string) => {
    if (dropdownOpen === key) {
      setDropdownOpen(null)
    } else {
      setDropdownOpen(key)
    }
  }

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-[9998] transition-all duration-300 ${
        scrolled || mobileMenuOpen
          ? darkMode
            ? "py-4 bg-[#28384d]/95 shadow-md backdrop-blur-md"
            : "py-4 bg-white/95 shadow-md backdrop-blur-md"
          : "py-6 bg-transparent"
      } ${isSpecialPage ? "bg-opacity-80" : ""}`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link href="/" className="relative z-[9999] flex-shrink-0">
          {darkMode ? (
            <Image
              src="/images/logow.webp"
              alt="ENIT Junior Entreprise Logo"
              width={130}
              height={45}
              className={`h-9 w-auto ${isSpecialPage ? "opacity-90" : ""}`}
              priority
            />
          ) : (
            <Image
              src="/images/logo.webp"
              alt="ENIT Junior Entreprise Logo"
              width={130}
              height={45}
              className={`h-9 w-auto ${isSpecialPage ? "opacity-90" : ""}`}
              priority
            />
          )}
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center">
          <ul className="flex flex-wrap justify-center">
            {navItems.map((item) => (
              <li key={item.path} className="relative group px-2">
                {item.dropdown ? (
                  <div className="dropdown-trigger">
                    <div className="flex items-center">
                      <Link
                        href={item.path}
                        className={`flex items-center text-sm ${isSpecialPage ? "font-medium" : "font-semibold"} tracking-wide transition-colors duration-300 px-4 py-2 ${
                          isActive(item.path) || dropdownOpen === item.path
                            ? "text-[#00adb5]"
                            : darkMode
                              ? "text-white hover:text-[#00adb5]"
                              : "text-[#28384d] hover:text-[#00adb5]"
                        }`}
                      >
                        {language === "fr" ? item.labelFr : item.labelEn}
                      </Link>
                      <button
                        onClick={() => toggleDropdown(item.path)}
                        className={`p-1 transition-colors duration-300 ${
                          isActive(item.path) || dropdownOpen === item.path
                            ? "text-[#00adb5]"
                            : darkMode
                              ? "text-white hover:text-[#00adb5]"
                              : "text-[#28384d] hover:text-[#00adb5]"
                        }`}
                        aria-expanded={dropdownOpen === item.path}
                      >
                        <ChevronDown
                          className={`h-4 w-4 transition-transform duration-300 ${
                            dropdownOpen === item.path ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    </div>

                    <AnimatePresence>
                      {dropdownOpen === item.path && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className={`absolute left-0 mt-2 w-56 ${
                            darkMode ? "bg-[#28384d]/95 backdrop-blur-md" : "bg-white"
                          } rounded-md shadow-lg overflow-hidden z-20 border ${
                            darkMode ? "border-white/10" : "border-gray-200"
                          }`}
                        >
                          <div className="py-1">
                            {item.path === "/about" ? (
                              <>
                                <Link
                                  href="/about#story"
                                  className={`block px-4 py-2 text-sm ${isSpecialPage ? "font-normal" : "font-medium"} ${
                                    darkMode
                                      ? "text-white hover:bg-white/10"
                                      : "text-[#28384d] hover:bg-white/10"
                                  } hover:text-[#00adb5]`}
                                >
                                  {language === "fr" ? "Notre Histoire" : "Our Story"}
                                </Link>
                                <Link
                                  href="/about#timeline"
                                  className={`block px-4 py-2 text-sm ${isSpecialPage ? "font-normal" : "font-medium"} ${
                                    darkMode
                                      ? "text-white hover:bg-white/10"
                                      : "text-[#28384d] hover:bg-white/10"
                                  } hover:text-[#00adb5]`}
                                >
                                  {language === "fr" ? "Parcours" : "Journey"}
                                </Link>
                                <Link
                                  href="/about#values"
                                  className={`block px-4 py-2 text-sm ${isSpecialPage ? "font-normal" : "font-medium"} ${
                                    darkMode
                                      ? "text-white hover:bg-white/10"
                                      : "text-[#28384d] hover:bg-white/10"
                                  } hover:text-[#00adb5]`}
                                >
                                  {language === "fr" ? "Valeurs" : "Values"}
                                </Link>
                                <Link
                                  href="/about#mission"
                                  className={`block px-4 py-2 text-sm ${isSpecialPage ? "font-normal" : "font-medium"} ${
                                    darkMode
                                      ? "text-white hover:bg-white/10"
                                      : "text-[#28384d] hover:bg-white/10"
                                  } hover:text-[#00adb5]`}
                                >
                                  {language === "fr" ? "Mission" : "Mission"}
                                </Link>
                                <Link
                                  href="/about#team"
                                  className={`block px-4 py-2 text-sm ${isSpecialPage ? "font-normal" : "font-medium"} ${
                                    darkMode
                                      ? "text-white hover:bg-white/10"
                                      : "text-[#28384d] hover:bg-white/10"
                                  } hover:text-[#00adb5]`}
                                >
                                  {language === "fr" ? "Notre Équipe" : "Our Team"}
                                </Link>
                                <Link
                                  href="/about#gallery"
                                  className={`block px-4 py-2 text-sm ${isSpecialPage ? "font-normal" : "font-medium"} ${
                                    darkMode
                                      ? "text-white hover:bg-white/10"
                                      : "text-[#28384d] hover:bg-white/10"
                                  } hover:text-[#00adb5]`}
                                >
                                  {language === "fr" ? "Galerie" : "Gallery"}
                                </Link>
                                <Link
                                  href="/etats-financiers"
                                  className={`block px-4 py-2 text-sm ${isSpecialPage ? "font-normal" : "font-medium"} ${
                                    darkMode
                                      ? "text-white hover:bg-white/10"
                                      : "text-[#28384d] hover:bg-white/10"
                                  } hover:text-[#00adb5]`}
                                >
                                  {language === "fr" ? "États Financiers" : "Financial Statements"}
                                </Link>
                                <Link
                                  href="/politique-qualite"
                                  className={`block px-4 py-2 text-sm ${isSpecialPage ? "font-normal" : "font-medium"} ${
                                    darkMode
                                      ? "text-white hover:bg-white/10"
                                      : "text-[#28384d] hover:bg-white/10"
                                  } hover:text-[#00adb5]`}
                                >
                                  {language === "fr" ? "Politique Qualité" : "Quality Policy"}
                                </Link>
                              </>
                            ) : (
                              item.dropdownItems?.map((dropdownItem) => (
                              <Link
                                key={dropdownItem.path}
                                href={dropdownItem.path}
                                className={`block px-4 py-2 text-sm ${isSpecialPage ? "font-medium" : "font-semibold"} ${
                                  darkMode
                                    ? "text-white hover:bg-white/10"
                                    : "text-[#28384d] hover:bg-white/10"
                                } hover:text-[#00adb5]`}
                              >
                                {language === "fr" ? dropdownItem.labelFr : dropdownItem.labelEn}
                              </Link>
                              ))
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    href={item.path}
                    className={`text-sm ${isSpecialPage ? "font-medium" : "font-semibold"} tracking-wide transition-colors duration-300 px-4 py-2 block ${
                      isActive(item.path)
                        ? "text-[#00adb5]"
                        : darkMode
                          ? "text-white hover:text-[#00adb5]"
                          : "text-[#28384d] hover:text-[#00adb5]"
                    }`}
                  >
                    {language === "fr" ? item.labelFr : item.labelEn}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center space-x-5">
          {/* Theme toggle */}
          <button
            onClick={handleThemeToggle}
            className={`p-2 rounded-full transition-colors duration-300 ${
              darkMode ? "text-white hover:bg-white/10" : "text-[#28384d] hover:bg-[#28384d]/10"
            }`}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {/* Language toggle */}
          <button
            onClick={handleLanguageToggle}
            className={`p-2 rounded-full transition-colors duration-300 font-semibold ${
              darkMode ? "text-white hover:bg-white/10" : "text-[#28384d] hover:bg-[#28384d]/10"
            }`}
          >
            {language === "fr" ? "EN" : "FR"}
          </button>

          {/* Mobile menu button */}
          <button
            className={`lg:hidden z-[9999] p-2 rounded-full transition-colors duration-300 ${
              darkMode ? "text-white hover:bg-white/10" : "text-[#28384d] hover:bg-[#28384d]/10"
            }`}
            onClick={() => {
              const newState = !mobileMenuOpen
              setMobileMenuOpen(newState)
              setIsInMobileView(newState)

              // Auto-expand all dropdowns when opening mobile menu
              if (newState) {
                setDropdownOpen("all")
              } else {
                setDropdownOpen(null)
              }
            }}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu - modern slide-in drawer style */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/70 backdrop-blur-md z-[9999]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Drawer - now coming from right with improved animation */}
            <motion.div
              className={`fixed top-0 right-0 w-full h-screen max-h-screen shadow-2xl flex flex-col overflow-hidden z-[10000] ${
                darkMode ? "bg-[#28384d]" : "bg-white"
              }`}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ 
                type: "spring", 
                damping: 25, 
                stiffness: 200,
                mass: 0.8
              }}
            >
              {/* Header with improved styling */}
              <div
                className={`flex justify-between items-center p-6 border-b ${
                  darkMode ? "border-white/10 bg-[#28384d]/30" : "border-[#28384d]/10 bg-white/80"
                } backdrop-blur-md`}
              >
                <Image
                  src={darkMode ? "/images/logow.webp" : "/images/logo.webp"}
                  alt="ENIT Junior Entreprise Logo"
                  width={120}
                  height={35}
                  className="h-8 w-auto"
                  priority
                />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className={`p-2.5 rounded-full transition-all duration-300 ${
                    darkMode 
                      ? "bg-white/10 text-white hover:bg-white/20 hover:scale-105" 
                      : "bg-[#28384d]/10 text-[#28384d] hover:bg-[#28384d]/20 hover:scale-105"
                  }`}
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Navigation - with improved spacing and animations */}
              <div className="flex-1 overflow-y-auto py-6 px-6 h-full">
                <nav className="flex flex-col space-y-6">
                    {navItems.map((item, index) => (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ 
                        delay: index * 0.1,
                        duration: 0.4,
                        ease: "easeOut"
                      }}
                      className="relative"
                    >
                        {item.dropdown ? (
                        <div className="space-y-3">
                            <div
                            className={`flex items-center justify-between w-full text-lg font-bold transition-all duration-300 py-3 border-b ${
                                darkMode ? "border-white/10" : "border-gray-100"
                              } ${darkMode ? "text-white hover:text-[#00adb5]" : "text-[#28384d] hover:text-[#00adb5]"}`}
                          >
                            <Link 
                              href={item.path} 
                              className="flex-1 hover:translate-x-1 transition-transform duration-300"
                            >
                              {language === "fr" ? item.labelFr : item.labelEn}
                            </Link>
                            <button
                              onClick={() => toggleDropdown(item.path)}
                              className={`p-2 transition-all duration-300 ${
                                darkMode 
                                  ? "text-white hover:text-[#00adb5] hover:scale-110" 
                                  : "text-[#28384d] hover:text-[#00adb5] hover:scale-110"
                              }`}
                            >
                              <ChevronDown 
                                className={`h-4 w-4 transition-transform duration-300 ${
                                  dropdownOpen === item.path ? "rotate-180" : ""
                                }`}
                              />
                            </button>
                          </div>

                          <div className="py-1">
                            {item.path === "/about" ? (
                              <>
                                <Link
                                  href="/about#story"
                                  className={`block px-4 py-2 text-sm ${isSpecialPage ? "font-normal" : "font-medium"} ${
                                    darkMode
                                      ? "text-white hover:bg-white/10"
                                      : "text-[#28384d] hover:bg-white/10"
                                  } hover:text-[#00adb5]`}
                                >
                                  {language === "fr" ? "Notre Histoire" : "Our Story"}
                                </Link>
                                <Link
                                  href="/about#timeline"
                                  className={`block px-4 py-2 text-sm ${isSpecialPage ? "font-normal" : "font-medium"} ${
                                    darkMode
                                      ? "text-white hover:bg-white/10"
                                      : "text-[#28384d] hover:bg-white/10"
                                  } hover:text-[#00adb5]`}
                                >
                                  {language === "fr" ? "Parcours" : "Journey"}
                                </Link>
                                <Link
                                  href="/about#values"
                                  className={`block px-4 py-2 text-sm ${isSpecialPage ? "font-normal" : "font-medium"} ${
                                    darkMode
                                      ? "text-white hover:bg-white/10"
                                      : "text-[#28384d] hover:bg-white/10"
                                  } hover:text-[#00adb5]`}
                                >
                                  {language === "fr" ? "Valeurs" : "Values"}
                                </Link>
                                <Link
                                  href="/about#mission"
                                  className={`block px-4 py-2 text-sm ${isSpecialPage ? "font-normal" : "font-medium"} ${
                                    darkMode
                                      ? "text-white hover:bg-white/10"
                                      : "text-[#28384d] hover:bg-white/10"
                                  } hover:text-[#00adb5]`}
                                >
                                  {language === "fr" ? "Mission" : "Mission"}
                                </Link>
                                <Link
                                  href="/about#team"
                                  className={`block px-4 py-2 text-sm ${isSpecialPage ? "font-normal" : "font-medium"} ${
                                    darkMode
                                      ? "text-white hover:bg-white/10"
                                      : "text-[#28384d] hover:bg-white/10"
                                  } hover:text-[#00adb5]`}
                                >
                                  {language === "fr" ? "Notre Équipe" : "Our Team"}
                                </Link>
                                <Link
                                  href="/about#gallery"
                                  className={`block px-4 py-2 text-sm ${isSpecialPage ? "font-normal" : "font-medium"} ${
                                    darkMode
                                      ? "text-white hover:bg-white/10"
                                      : "text-[#28384d] hover:bg-white/10"
                                  } hover:text-[#00adb5]`}
                                >
                                  {language === "fr" ? "Galerie" : "Gallery"}
                                </Link>
                                <Link
                                  href="/etats-financiers"
                                  className={`block px-4 py-2 text-sm ${isSpecialPage ? "font-normal" : "font-medium"} ${
                                    darkMode
                                      ? "text-white hover:bg-white/10"
                                      : "text-[#28384d] hover:bg-white/10"
                                  } hover:text-[#00adb5]`}
                                >
                                  {language === "fr" ? "États Financiers" : "Financial Statements"}
                                </Link>
                                <Link
                                  href="/politique-qualite"
                                  className={`block px-4 py-2 text-sm ${isSpecialPage ? "font-normal" : "font-medium"} ${
                                    darkMode
                                      ? "text-white hover:bg-white/10"
                                      : "text-[#28384d] hover:bg-white/10"
                                  } hover:text-[#00adb5]`}
                                >
                                  {language === "fr" ? "Politique Qualité" : "Quality Policy"}
                                </Link>
                              </>
                            ) : (
                              item.dropdownItems?.map((dropdownItem) => (
                                  <Link
                                    key={dropdownItem.path}
                                    href={dropdownItem.path}
                                  className={`block px-4 py-2 text-sm ${isSpecialPage ? "font-medium" : "font-semibold"} ${
                                      darkMode
                                      ? "text-white hover:bg-white/10"
                                      : "text-[#28384d] hover:bg-white/10"
                                  } hover:text-[#00adb5]`}
                                  >
                                    {language === "fr" ? dropdownItem.labelFr : dropdownItem.labelEn}
                                  </Link>
                              ))
                            )}
                          </div>
                          </div>
                        ) : (
                          <Link
                            href={item.path}
                          className={`text-sm ${isSpecialPage ? "font-medium" : "font-semibold"} tracking-wide transition-colors duration-300 px-4 py-2 block ${
                              isActive(item.path)
                                ? "text-[#00adb5]"
                                : darkMode
                                  ? "text-white hover:text-[#00adb5]"
                                  : "text-[#28384d] hover:text-[#00adb5]"
                            }`}
                          >
                            {language === "fr" ? item.labelFr : item.labelEn}
                          </Link>
                        )}
                    </motion.div>
                    ))}
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}