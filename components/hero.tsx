"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollReveal } from "@/components/scroll-reveal"

// Reduced to 3 distinct image URLs
const heroImages = [
  "/placeholder.svg?height=1080&width=1920&text=Minimal+Hero+1",
  "/placeholder.svg?height=1080&width=1920&text=Urban+Hero+2",
  "/placeholder.svg?height=1080&width=1920&text=Abstract+Hero+3",
]

// Reduced to 3 distinct content entries, corresponding to the images
const heroContent = [
  {
    title: "MINIMAL\nESSENTIALS",
    subtitle: "Refined simplicity redefined",
  },
  {
    title: "STREET\nCOUTURE",
    subtitle: "Luxury meets rebellion",
  },
  {
    title: "FUTURE\nNOIR",
    subtitle: "Tomorrow's vision today",
  },
]

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % heroImages.length)
        setIsTransitioning(false)
      }, 500)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {/* Background Images */}
      {heroImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ${
            index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105"
          }`}
          style={{
            backgroundImage: `url('${image}')`,
          }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="container mx-auto px-4 text-center text-white">
          <ScrollReveal direction="up" delay={200}>
            <h1
              className={`mb-6 text-4xl font-black uppercase tracking-wider md:text-6xl lg:text-8xl transition-all duration-700 ${
                isTransitioning ? "opacity-0 transform translate-y-8" : "opacity-100 transform translate-y-0"
              }`}
            >
              {heroContent[currentSlide].title.split("\n").map((line, i) => (
                <span key={i}>
                  {line}
                  {i === 0 && <br />}
                </span>
              ))}
            </h1>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={400}>
            <p
              className={`mb-8 text-lg uppercase tracking-wide md:text-xl lg:text-2xl transition-all duration-700 delay-200 ${
                isTransitioning ? "opacity-0 transform translate-y-8" : "opacity-100 transform translate-y-0"
              }`}
            >
              {heroContent[currentSlide].subtitle}
            </p>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={600}>
            <div
              className={`flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0 transition-all duration-700 delay-400 ${
                isTransitioning ? "opacity-0 transform translate-y-8" : "opacity-100 transform translate-y-0"
              }`}
            >
              <Button
                size="lg"
                className="bg-white px-8 py-4 text-lg font-bold uppercase tracking-wide text-black hover:bg-gray-200 hover:scale-105 transition-all duration-300"
              >
                Shop New Drop
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white px-8 py-4 text-lg font-bold uppercase tracking-wide text-white hover:bg-white hover:text-black hover:scale-105 transition-all duration-300 bg-transparent"
              >
                Subscribe
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 space-x-2">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setIsTransitioning(true)
              setTimeout(() => {
                setCurrentSlide(index)
                setIsTransitioning(false)
              }, 500)
            }}
            className={`h-2 w-8 transition-all duration-300 ${
              index === currentSlide ? "bg-white" : "bg-white/50 hover:bg-white/75"
            }`}
          />
        ))}
      </div>
    </section>
  )
}

import { useAuth } from "@clerk/nextjs"

export default function Debug() {
  const { getToken } = useAuth()

  async function test() {
    const token = await getToken()
    console.log("CLERK TOKEN:", token)
  }

  return <button onClick={test} className="px-4 py-2 text-white bg-black rounded-md">TEST TOKEN</button>
}
