"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { AnimatedCounter } from "@/components/animated-counter"
import { Button } from "@/components/ui/button"
import { ScrollReveal } from "@/components/scroll-reveal"
import { Play, Pause } from "lucide-react"

const stats = [
  { label: "Years of Excellence", value: 8, suffix: "" },
  { label: "Global Customers", value: 50000, suffix: "+" },
  { label: "Countries Shipped", value: 45, suffix: "" },
  { label: "Sustainable Materials", value: 95, suffix: "%" },
]

const timeline = [
  {
    year: "2016",
    title: "The Beginning",
    description: "Founded in the underground fashion scene of Paris with a vision to redefine luxury streetwear.",
    image: "/placeholder.svg?height=300&width=400&text=2016+Beginning",
  },
  {
    year: "2018",
    title: "Global Recognition",
    description: "First international expansion and collaboration with renowned street artists.",
    image: "/placeholder.svg?height=300&width=400&text=2018+Global",
  },
  {
    year: "2020",
    title: "Sustainable Revolution",
    description: "Committed to 100% sustainable materials and ethical manufacturing processes.",
    image: "/placeholder.svg?height=300&width=400&text=2020+Sustainable",
  },
  {
    year: "2022",
    title: "Digital Innovation",
    description: "Launched immersive digital experiences and virtual fashion shows.",
    image: "/placeholder.svg?height=300&width=400&text=2022+Digital",
  },
  {
    year: "2024",
    title: "Future Vision",
    description: "Pioneering the next generation of luxury streetwear with cutting-edge technology.",
    image: "/placeholder.svg?height=300&width=400&text=2024+Future",
  },
]

const values = [
  {
    title: "Sustainability",
    description: "Every piece is crafted with respect for our planet and future generations.",
    icon: "🌱",
  },
  {
    title: "Quality",
    description: "Uncompromising attention to detail in every stitch, seam, and finish.",
    icon: "✨",
  },
  {
    title: "Innovation",
    description: "Pushing boundaries in design, materials, and manufacturing processes.",
    icon: "🚀",
  },
  {
    title: "Community",
    description: "Building a global community of conscious fashion enthusiasts.",
    icon: "🤝",
  },
]

export function AboutPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeTimelineItem, setActiveTimelineItem] = useState(0)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.5 },
    )

    if (statsRef.current) {
      observer.observe(statsRef.current)
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTimelineItem((prev) => (prev + 1) % timeline.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const toggleVideo = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsVideoPlaying(!isVideoPlaying)
    }
  }

  return (
    <div className="min-h-screen pt-16 lg:pt-20">
      {/* Hero Section with Parallax */}
      <section className="relative h-screen bg-black text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat parallax"
          style={{
            backgroundImage: `url('/placeholder.svg?height=1080&width=1920&text=About+Hero')`,
          }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="relative z-10 flex h-full items-center justify-center">
          <div className="container mx-auto px-4 text-center">
            <ScrollReveal direction="scale" delay={200}>
              <h1 className="mb-6 text-4xl font-black uppercase tracking-wider md:text-6xl lg:text-8xl">Our Story</h1>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={400}>
              <p className="mb-8 text-lg uppercase tracking-wide md:text-xl lg:text-2xl">
                Born from darkness, elevated to art
              </p>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={600}>
              <div className="flex justify-center">
                <div className="animate-bounce">
                  <div className="h-6 w-0.5 bg-white"></div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Mission Section with Video */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
            <ScrollReveal direction="left">
              <div>
                <h2 className="mb-8 text-3xl font-black uppercase tracking-wider md:text-4xl lg:text-5xl">
                  Our Mission
                </h2>
                <p className="mb-6 text-lg leading-relaxed text-gray-700">
                  AuraGaze was born from the belief that luxury should be accessible, sustainable, and
                  unapologetically bold. We create pieces that transcend trends, focusing on timeless design and
                  exceptional quality.
                </p>
                <p className="mb-8 text-lg leading-relaxed text-gray-700">
                  Every garment tells a story of craftsmanship, innovation, and respect for both the wearer and the
                  planet. We're not just making clothes; we're crafting a movement.
                </p>
                <Button
                  size="lg"
                  className="bg-black px-8 py-4 text-lg font-bold uppercase tracking-wide text-white hover:bg-gray-800 hover:scale-105 transition-all duration-300"
                >
                  Our Values
                </Button>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <div className="relative">
                <div className="relative aspect-video overflow-hidden rounded-lg">
                  <video
                    ref={videoRef}
                    className="h-full w-full object-cover"
                    poster="/placeholder.svg?height=400&width=600&text=Mission+Video"
                    loop
                    muted
                  >
                    <source src="/placeholder-video.mp4" type="video/mp4" />
                  </video>
                  <button
                    onClick={toggleVideo}
                    className="absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity hover:bg-black/40"
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-black hover:bg-white hover:scale-110 transition-all duration-300">
                      {isVideoPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
                    </div>
                  </button>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Animated Stats Section */}
      <section className="bg-black py-24 text-white relative overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-pulse-scale"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <ScrollReveal direction="up">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-black uppercase tracking-wider md:text-4xl lg:text-5xl">
                By the Numbers
              </h2>
              <p className="text-lg uppercase tracking-wide text-gray-400">Our impact in the fashion world</p>
            </div>
          </ScrollReveal>

          <div ref={statsRef} className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <ScrollReveal key={stat.label} direction="up" delay={index * 200}>
                <div className="text-center group">
                  <div className="mb-4 text-4xl font-black md:text-5xl lg:text-6xl group-hover:scale-110 transition-transform duration-300">
                    {isVisible && <AnimatedCounter value={stat.value} suffix={stat.suffix} />}
                  </div>
                  <p className="text-sm uppercase tracking-wide text-gray-400 md:text-base">{stat.label}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Timeline */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <ScrollReveal direction="up">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-black uppercase tracking-wider md:text-4xl lg:text-5xl">Our Journey</h2>
              <p className="text-lg uppercase tracking-wide text-gray-600">Milestones that shaped our vision</p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center">
            {/* Timeline Navigation */}
            <ScrollReveal direction="left">
              <div className="space-y-4">
                {timeline.map((item, index) => (
                  <button
                    key={item.year}
                    onClick={() => setActiveTimelineItem(index)}
                    className={`w-full text-left p-6 rounded-lg transition-all duration-300 ${
                      activeTimelineItem === index
                        ? "bg-black text-white scale-105 shadow-lg"
                        : "bg-white hover:bg-gray-100 hover:scale-102"
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`text-2xl font-black ${activeTimelineItem === index ? "text-white" : "text-black"}`}
                      >
                        {item.year}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold uppercase tracking-wide">{item.title}</h3>
                        <p
                          className={`mt-1 text-sm ${activeTimelineItem === index ? "text-gray-300" : "text-gray-600"}`}
                        >
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollReveal>

            {/* Timeline Image */}
            <ScrollReveal direction="right">
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                <Image
                  src={timeline[activeTimelineItem].image || "/placeholder.svg"}
                  alt={timeline[activeTimelineItem].title}
                  fill
                  className="object-cover transition-all duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-2xl font-black uppercase tracking-wider">{timeline[activeTimelineItem].title}</h3>
                  <p className="text-lg">{timeline[activeTimelineItem].year}</p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Values Section with Hover Effects */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <ScrollReveal direction="up">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-black uppercase tracking-wider md:text-4xl lg:text-5xl">Our Values</h2>
              <p className="text-lg uppercase tracking-wide text-gray-600">What drives us forward</p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <ScrollReveal key={value.title} direction="up" delay={index * 150}>
                <div className="group text-center p-8 bg-gray-50 hover:bg-black hover:text-white transition-all duration-500 hover:scale-105 hover:shadow-xl">
                  <div className="mb-6 text-6xl group-hover:scale-110 transition-transform duration-300">
                    {value.icon}
                  </div>
                  <h3 className="mb-4 text-xl font-bold uppercase tracking-wide">{value.title}</h3>
                  <p className="text-gray-600 group-hover:text-gray-300 transition-colors duration-300">
                    {value.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section with Animated Cards */}
      <section className="bg-gray-50 py-24">
        <div className="container mx-auto px-4">
          <ScrollReveal direction="up">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-black uppercase tracking-wider md:text-4xl lg:text-5xl">
                The Visionary
              </h2>
              <p className="text-lg uppercase tracking-wide text-gray-600">The mind behind the movement</p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-1 max-w-md mx-auto">
            {" "}
            {/* Centered single column */}
            {[
              {
                name: "SIDDARTH MURKERJI",
                role: "Founder & Creative Director",
                image: "/placeholder.svg?height=400&width=400&text=Siddarth+Murkerji",
                bio: "The visionary force behind AuraGaze, blending art, fashion, and sustainability.",
              },
            ].map((member, index) => (
              <ScrollReveal key={member.name} direction="up" delay={index * 200}>
                <div className="group text-center bg-white p-8 hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                  <div className="relative mb-6 aspect-square overflow-hidden rounded-full mx-auto w-48">
                    <Image
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="192px"
                    />
                    <div className="absolute inset-0 bg-black/20 transition-opacity duration-300 group-hover:bg-black/40 rounded-full" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold uppercase tracking-wide group-hover:text-gray-600 transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-gray-600 uppercase tracking-wide mb-4">{member.role}</p>
                  <p className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">{member.bio}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action with Animated Background */}
      <section className="relative py-24 bg-black text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black via-gray-900 to-black animate-pulse-scale"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <ScrollReveal direction="scale" delay={200}>
            <h2 className="mb-8 text-3xl font-black uppercase tracking-wider md:text-4xl lg:text-5xl">
              Join Our Movement
            </h2>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={400}>
            <p className="mb-8 text-lg md:text-xl max-w-2xl mx-auto">
              Be part of the revolution that's redefining luxury streetwear. Together, we're building a more sustainable
              and stylish future.
            </p>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={600}>
            <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-x-4 sm:space-y-0">
              <Button
                size="lg"
                className="bg-white px-8 py-4 text-lg font-bold uppercase tracking-wide text-black hover:bg-gray-200 hover:scale-105 transition-all duration-300"
              >
                Shop Collection
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white px-8 py-4 text-lg font-bold uppercase tracking-wide text-white hover:bg-white hover:text-black hover:scale-105 transition-all duration-300 bg-transparent"
              >
                Contact Us
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
