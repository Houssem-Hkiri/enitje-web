"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Sun, Moon, ChevronDown, Globe } from "lucide-react"
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
    toggleDarkMode()
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
        { path: "/about/team", labelFr: "Notre Équipe", labelEn: "Our Team" },
        { path: "/about/history", labelFr: "Notre Histoire", labelEn: "Our History" },
        { path: "/about/values", labelFr: "Nos Valeurs", labelEn: "Our Values" },
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
            ? "py-4 bg-navy/95 shadow-md backdrop-blur-md"
            : "py-4 bg-white/95 shadow-md backdrop-blur-md"
          : "py-6 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link href="/" className="relative z-[9999] flex-shrink-0">
          {darkMode ? (
            <Image
              src="/images/logow.webp"
              alt="ENIT Junior Entreprise Logo"
              width={130}
              height={45}
              className="h-9 w-auto"
              priority
            />
          ) : (
            <Image
              src="/images/logo.webp"
              alt="ENIT Junior Entreprise Logo"
              width={130}
              height={45}
              className="h-9 w-auto"
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
                        className={`flex items-center text-sm font-semibold tracking-wide transition-colors duration-300 px-4 py-2 ${
                          isActive(item.path) || dropdownOpen === item.path
                            ? "text-secondary"
                            : darkMode
                              ? "text-white hover:text-secondary"
                              : "text-navy hover:text-secondary"
                        }`}
                      >
                        {language === "fr" ? item.labelFr : item.labelEn}
                      </Link>
                      <button
                        onClick={() => toggleDropdown(item.path)}
                        className={`p-1 transition-colors duration-300 ${
                          isActive(item.path) || dropdownOpen === item.path
                            ? "text-secondary"
                            : darkMode
                              ? "text-white hover:text-secondary"
                              : "text-navy hover:text-secondary"
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
                            darkMode ? "bg-navy/95 backdrop-blur-md" : "bg-white"
                          } rounded-md shadow-lg overflow-hidden z-20 border ${
                            darkMode ? "border-white/10" : "border-gray-200"
                          }`}
                        >
                          <div className="py-1">
                            {item.dropdownItems?.map((dropdownItem) => (
                              <Link
                                key={dropdownItem.path}
                                href={dropdownItem.path}
                                className={`block px-4 py-2 text-sm font-medium ${
                                  darkMode
                                    ? "text-gray-200 hover:bg-white/10"
                                    : "text-gray-800 hover:bg-gray-100"
                                } hover:text-secondary`}
                              >
                                {language === "fr" ? dropdownItem.labelFr : dropdownItem.labelEn}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    href={item.path}
                    className={`text-sm font-semibold tracking-wide transition-colors duration-300 px-4 py-2 block ${
                      isActive(item.path)
                        ? "text-secondary"
                        : darkMode
                          ? "text-white hover:text-secondary"
                          : "text-navy hover:text-secondary"
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
              darkMode ? "text-white hover:bg-white/10" : "text-navy hover:bg-navy/10"
            }`}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {/* Language toggle */}
          <button
            onClick={handleLanguageToggle}
            className={`p-2 rounded-full transition-colors duration-300 font-semibold ${
              darkMode ? "text-white hover:bg-white/10" : "text-navy hover:bg-navy/10"
            }`}
          >
            {language === "fr" ? "EN" : "FR"}
          </button>

          {/* Mobile menu button */}
          <button
            className={`lg:hidden z-[9999] p-2 rounded-full transition-colors duration-300 ${
              darkMode ? "text-white hover:bg-white/10" : "text-navy hover:bg-navy/10"
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

            {/* Drawer - now coming from top with improved animation */}
            <motion.div
              className={`fixed inset-0 w-full h-screen max-h-screen shadow-2xl flex flex-col overflow-hidden z-[10000] ${
                darkMode ? "bg-navy" : "bg-white"
              }`}
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ duration: 0.25 }}
            >
              {/* Header */}
              <div
                className={`flex justify-between items-center p-4 border-b ${
                  darkMode ? "border-white/10 bg-navy-light/50" : "border-gray-200 bg-gray-50"
                }`}
              >
                <Image
                  src={darkMode ? "/images/logow.webp" : "/images/logo.webp"}
                  alt="ENIT Junior Entreprise Logo"
                  width={100}
                  height={30}
                  className="h-7 w-auto"
                  priority
                />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className={`p-2 rounded-full transition-colors duration-200 ${
                    darkMode ? "bg-white/10 text-white hover:bg-white/20" : "bg-gray-100 text-navy hover:bg-gray-200"
                  }`}
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Navigation - with adaptive sizing */}
              <div className="flex-1 overflow-y-auto py-3 px-4 h-full">
                <nav className="flex flex-col">
                  <div className="grid grid-cols-1 gap-y-2 auto-rows-min">
                    {navItems.map((item, index) => (
                      <div key={item.path} className="relative">
                        {item.dropdown ? (
                          <div className="space-y-2">
                            <div
                              className={`flex items-center justify-between w-full text-base sm:text-lg md:text-xl font-bold transition-colors duration-200 py-1.5 border-b ${
                                darkMode ? "border-white/10" : "border-gray-100"
                              } ${darkMode ? "text-white hover:text-secondary" : "text-navy hover:text-secondary"}`}
                            >
                              <span>{language === "fr" ? item.labelFr : item.labelEn}</span>
                              <ChevronDown className={`h-4 w-4 transition-transform duration-200 rotate-180`} />
                            </div>

                            <div
                              className={`pl-3 border-l-2 ${darkMode ? "border-secondary/30" : "border-secondary/50"}`}
                            >
                              <div className="py-1 grid grid-cols-1 gap-y-1.5">
                                {item.dropdownItems?.map((dropdownItem) => (
                                  <Link
                                    key={dropdownItem.path}
                                    href={dropdownItem.path}
                                    className={`block transition-colors duration-200 text-sm sm:text-base font-semibold ${
                                      darkMode
                                        ? "text-gray-300 hover:text-secondary"
                                        : "text-gray-600 hover:text-secondary"
                                    }`}
                                    onClick={() => setMobileMenuOpen(false)}
                                  >
                                    {language === "fr" ? dropdownItem.labelFr : dropdownItem.labelEn}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <Link
                            href={item.path}
                            className={`block text-base sm:text-lg md:text-xl font-bold transition-colors duration-200 py-1.5 border-b ${
                              darkMode ? "border-white/10" : "border-gray-100"
                            } ${
                              isActive(item.path)
                                ? "text-secondary"
                                : darkMode
                                  ? "text-white hover:text-secondary"
                                  : "text-navy hover:text-secondary"
                            }`}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {language === "fr" ? item.labelFr : item.labelEn}
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                </nav>
              </div>

              {/* Footer */}
              <div
                className={`p-4 border-t ${
                  darkMode ? "border-white/10 bg-navy-light/50" : "border-gray-200 bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-center space-x-8">
                  <button
                    onClick={handleThemeToggle}
                    className={`p-2.5 rounded-full transition-colors duration-200 ${
                      darkMode ? "bg-white/10 text-white hover:bg-white/20" : "bg-gray-100 text-navy hover:bg-gray-200"
                    }`}
                  >
                    {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  </button>
                  <button
                    onClick={handleLanguageToggle}
                    className={`p-2.5 rounded-full transition-colors duration-200 ${
                      darkMode ? "bg-white/10 text-white hover:bg-white/20" : "bg-gray-100 text-navy hover:bg-gray-200"
                    }`}
                  >
                    <Globe className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}

