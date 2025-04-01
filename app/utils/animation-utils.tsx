"use client"

import { useEffect, useState, useRef } from "react"

// Optimized intersection observer hook
export const useInView = (options = { threshold: 0.1, triggerOnce: true }) => {
  const [isInView, setIsInView] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          if (options.triggerOnce) {
            observer.disconnect()
          }
        } else if (!options.triggerOnce) {
          setIsInView(false)
        }
      },
      { threshold: options.threshold, rootMargin: "0px" },
    )

    const currentRef = ref.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [options.threshold, options.triggerOnce])

  return { ref, isInView }
}

// Throttle function for performance optimization
export const throttle = (func: Function, delay: number) => {
  let lastCall = 0
  return (...args: any[]) => {
    const now = Date.now()
    if (now - lastCall < delay) return
    lastCall = now
    return func(...args)
  }
}

// Debounce function for performance optimization
export const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout
  return (...args: any[]) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      func(...args)
    }, delay)
  }
}

