"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Sample gallery images
const galleryImages = [
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3M7A3797.jpg-4xIaAstel9xbV1vp4auINgxuEOhJsz.jpeg",
    alt: "ENIT Junior Entreprise Team",
    caption: "Team Building Event 2023",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3M7A3764.jpg-R8CTzh4Kr5W2GDoErCWS9cV1FluTYO.jpeg",
    alt: "ENIT Junior Entreprise Event",
    caption: "Annual Conference",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Cover1.jpg-dU6o5ytm6GGrypJyhxh3V2um4UkU9o.jpeg",
    alt: "Forum ENIT Entreprise",
    caption: "Forum ENIT Entreprise",
  },
  {
    src: "/placeholder.svg?height=600&width=800",
    alt: "Workshop Session",
    caption: "Technical Workshop",
  },
  {
    src: "/placeholder.svg?height=600&width=800",
    alt: "Project Presentation",
    caption: "Project Showcase",
  },
]

export default function GallerySlider() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)

  // Handle auto play
  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(() => {
        setDirection(1)
        setCurrentIndex((prev) => (prev + 1) % galleryImages.length)
      }, 5000)
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
    }
  }, [isAutoPlaying])

  // Pause auto play on hover
  const handleMouseEnter = () => {
    setIsAutoPlaying(false)
  }

  const handleMouseLeave = () => {
    setIsAutoPlaying(true)
  }

  // Navigate to previous slide
  const prevSlide = () => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1))
  }

  // Navigate to next slide
  const nextSlide = () => {
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % galleryImages.length)
  }

  // Go to specific slide
  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1)
    setCurrentIndex(index)
  }

  // Variants for slide animations
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0,
    }),
  }

  return (
    <div className="relative max-w-5xl mx-auto" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className="relative h-[300px] md:h-[500px] overflow-hidden rounded-lg shadow-xl">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="absolute inset-0"
          >
            <Image
              src={galleryImages[currentIndex].src || "/placeholder.svg"}
              alt={galleryImages[currentIndex].alt}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-white text-xl font-bold">{galleryImages[currentIndex].caption}</h3>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all duration-300"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all duration-300"
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Dots navigation */}
      <div className="flex justify-center mt-4 space-x-2">
        {galleryImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex ? "bg-secondary w-6" : "bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

