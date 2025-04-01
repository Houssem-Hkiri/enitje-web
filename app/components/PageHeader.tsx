"use client"

import { motion } from "framer-motion"

interface PageHeaderProps {
  title: string
  subtitle: string
  bgImage?: string
}

export default function PageHeader({ title, subtitle, bgImage }: PageHeaderProps) {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: bgImage ? `url(${bgImage})` : "url(/placeholder.svg?height=800&width=1600)",
        }}
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 0.3, scale: 1 }}
        transition={{ duration: 1.2 }}
      />
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-navy/80 to-navy/40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      />

      {/* Content */}
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h1
            className="text-4xl md:text-6xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {title}
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {subtitle}
          </motion.p>
        </div>
      </div>
    </section>
  )
}

