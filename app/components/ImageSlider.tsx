"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

const images = [
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3M7A3797.jpg-4xIaAstel9xbV1vp4auINgxuEOhJsz.jpeg",
    alt: "ENIT Junior Entreprise Team",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3M7A3764.jpg-R8CTzh4Kr5W2GDoErCWS9cV1FluTYO.jpeg",
    alt: "ENIT Junior Entreprise Event",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Cover1.jpg-dU6o5ytm6GGrypJyhxh3V2um4UkU9o.jpeg",
    alt: "Forum ENIT Entreprise",
  },
]

export default function ImageSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, 5000) // Change image every 5 seconds

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }} // Increased opacity for better visibility
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <Image
            src={images[currentIndex].src || "/placeholder.svg"}
            alt={images[currentIndex].alt}
            fill
            className="object-cover"
            priority
          />
          {/* Enhanced gradient overlay for better text visibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-transparent" />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

