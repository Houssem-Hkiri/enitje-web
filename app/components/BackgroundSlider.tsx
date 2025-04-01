"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"

const images = [
  "/images/fo2.webp",
  "/images/fee23.webp",
  "/images/ENITJE Team.webp",
  "/images/jobs24.webp",
  "/images/jobs25.webp",
  "/images/rgo2.webp",
  "/images/xpo.webp"
]

export default function BackgroundSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Auto-change images
  useEffect(() => {
    const changeImage = () => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
        setIsTransitioning(false)
      }, 500) // Match this with the CSS transition time
    }

    // Set up the interval for auto-changing
    const interval = setInterval(changeImage, 5000) // Change image every 5 seconds

    return () => {
      clearInterval(interval)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  // Handle image loading
  useEffect(() => {
    const img = new window.Image()
    img.src = images[currentIndex]
    img.onload = () => {
      setIsLoaded(true)
    }

    return () => {
      img.onload = null
    }
  }, [currentIndex])

  return (
    <div className="relative w-full h-full overflow-hidden">
      {images.map((src, index) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          } ${isTransitioning ? "transition-opacity duration-500" : ""}`}
        >
          <Image
            src={src || "/placeholder.svg"}
            alt={`Background ${index + 1}`}
            fill
            priority={index === currentIndex}
            className="object-cover"
            sizes="100vw"
          />
        </div>
      ))}
    </div>
  )
}

