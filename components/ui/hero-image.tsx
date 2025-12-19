"use client"

import { motion } from 'framer-motion'
import Image from 'next/image'

interface HeroImageProps {
  src: string
  alt: string
  className?: string
}

export function HeroImage({ src, alt, className }: HeroImageProps) {
  const isSvg = src.endsWith('.svg')
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
      className={`relative z-10 ${className || ''}`}
      style={{ background: 'transparent' }}
    >
{isSvg ? (
  <img
    src={src}
    alt={alt}
    className="block max-w-full max-h-full object-contain bg-transparent"
    draggable={false}
  />
) : (
  <Image
    src={src}
    alt={alt}
    width={400}
    height={600}
    className="object-contain bg-transparent"
    priority
  />
)}
    </motion.div>
  )
}

