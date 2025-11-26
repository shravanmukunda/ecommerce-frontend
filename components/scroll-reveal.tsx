"use client"

import type React from "react"

import { useScrollAnimation } from "@/hooks/use-scroll-animation"

interface ScrollRevealProps {
  children: React.ReactNode
  direction?: "up" | "down" | "left" | "right" | "fade" | "scale"
  delay?: number
  duration?: number
  className?: string
}

export function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.8,
  className = "",
}: ScrollRevealProps) {
  const { ref, isVisible } = useScrollAnimation()

  const getAnimationClass = () => {
    const baseClass = "transition-all ease-out"
    const durationClass = `duration-[${Math.round(duration * 1000)}ms]`
    const delayClass = delay > 0 ? `delay-[${delay}ms]` : ""

    if (!isVisible) {
      switch (direction) {
        case "up":
          return `${baseClass} ${durationClass} ${delayClass} opacity-0 translate-y-8`
        case "down":
          return `${baseClass} ${durationClass} ${delayClass} opacity-0 -translate-y-8`
        case "left":
          return `${baseClass} ${durationClass} ${delayClass} opacity-0 translate-x-8`
        case "right":
          return `${baseClass} ${durationClass} ${delayClass} opacity-0 -translate-x-8`
        case "scale":
          return `${baseClass} ${durationClass} ${delayClass} opacity-0 scale-95`
        case "fade":
        default:
          return `${baseClass} ${durationClass} ${delayClass} opacity-0`
      }
    }

    return `${baseClass} ${durationClass} ${delayClass} opacity-100 translate-y-0 translate-x-0 scale-100`
  }

  return (
    <div ref={ref} className={`${getAnimationClass()} ${className}`}>
      {children}
    </div>
  )
}
