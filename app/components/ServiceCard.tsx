"use client"

import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"

interface ServiceCardProps {
  title: string
  description: string
  icon: LucideIcon
  features: string[]
  delay?: number
}

export default function ServiceCard({ title, description, icon: Icon, features, delay = 0 }: ServiceCardProps) {
  return (
    <motion.div
      className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-transparent hover:border-secondary/20"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: delay * 0.2 }}
      whileHover={{ y: -8, scale: 1.02 }}
    >
      <div className="flex items-center mb-4">
        <motion.div
          className="p-3 rounded-full bg-secondary/10 mr-4"
          whileHover={{ rotate: 10, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Icon className="h-7 w-7 text-secondary" />
        </motion.div>
        <h3 className="text-xl font-bold text-navy">{title}</h3>
      </div>
      <p className="text-gray-600 mb-6">{description}</p>
      <ul className="space-y-3">
        {features.map((feature, index) => (
          <motion.li
            key={index}
            className="flex items-start text-gray-600"
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.1 * index + delay }}
          >
            <span className="w-1.5 h-1.5 bg-secondary rounded-full mr-2 mt-2" />
            <span>{feature}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  )
}

