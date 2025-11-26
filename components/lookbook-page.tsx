"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const lookbookCollections = [
  {
    id: 1,
    title: "URBAN MINIMALISM",
    subtitle: "Fall/Winter 2024",
    description: "Where concrete meets couture. A study in architectural fashion.",
    image: "/placeholder.svg?height=800&width=600&text=Urban+Minimalism",
    video: null,
    category: "Editorial",
  },
  {
    id: 2,
    title: "STREET ELEGANCE",
    subtitle: "Capsule Collection",
    description: "Refined rebellion. Luxury meets the underground.",
    image: "/placeholder.svg?height=600&width=800&text=Street+Elegance",
    video: null,
    category: "Campaign",
  },
  {
    id: 3,
    title: "MONOCHROME DREAMS",
    subtitle: "Editorial Series",
    description: "Black and white. Nothing more, nothing less.",
    image: "/placeholder.svg?height=800&width=600&text=Monochrome+Dreams",
    video: null,
    category: "Editorial",
  },
  {
    id: 4,
    title: "UNDERGROUND CULTURE",
    subtitle: "Collaboration",
    description: "Born from the streets, elevated to art.",
    image: "/placeholder.svg?height=600&width=1200&text=Underground+Culture",
    video: null,
    category: "Collaboration",
  },
  {
    id: 5,
    title: "MIDNIGHT SESSIONS",
    subtitle: "Behind the Scenes",
    description: "The creative process unveiled.",
    image: "/placeholder.svg?height=800&width=600&text=Midnight+Sessions",
    video: null,
    category: "BTS",
  },
  {
    id: 6,
    title: "FUTURE NOIR",
    subtitle: "Spring/Summer 2025",
    description: "Tomorrow's darkness, today's vision.",
    image: "/placeholder.svg?height=600&width=800&text=Future+Noir",
    video: null,
    category: "Preview",
  },
]

const categories = ["All", "Editorial", "Campaign", "Collaboration", "BTS", "Preview"]

export function LookbookPage() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [filteredCollections, setFilteredCollections] = useState(lookbookCollections)
  const [hoveredItem, setHoveredItem] = useState<number | null>(null)

  useEffect(() => {
    const filtered =
      activeCategory === "All"
        ? lookbookCollections
        : lookbookCollections.filter((item) => item.category === activeCategory)
    setFilteredCollections(filtered)
  }, [activeCategory])

  return (
    <div className="min-h-screen pt-16 lg:pt-20">
      {/* Hero Section */}
      <section className="relative h-screen bg-black text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/placeholder.svg?height=1080&width=1920&text=Lookbook+Hero')`,
          }}
        >
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 flex h-full items-center justify-center">
          <div className="container mx-auto px-4 text-center">
            <h1 className="mb-6 text-4xl font-black uppercase tracking-wider md:text-6xl lg:text-8xl animate-fade-in-up">
              Visual
              <br />
              Narratives
            </h1>
            <p className="mb-8 text-lg uppercase tracking-wide md:text-xl lg:text-2xl animate-fade-in-up animation-delay-300">
              Stories told through fashion
            </p>
            <Button
              size="lg"
              className="bg-white px-8 py-4 text-lg font-bold uppercase tracking-wide text-black hover:bg-gray-200 hover:scale-105 transition-all duration-300 animate-fade-in-up animation-delay-600"
            >
              Explore Collections
            </Button>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Filter Categories */}
        <div className="mb-16 text-center">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                onClick={() => setActiveCategory(category)}
                className={`transition-all duration-300 ${
                  activeCategory === category
                    ? "bg-black text-white hover:bg-gray-800 scale-105"
                    : "border-black text-black hover:bg-black hover:text-white hover:scale-105"
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredCollections.map((collection, index) => (
            <Link
              key={collection.id}
              href={`/lookbook/${collection.id}`}
              className={`group relative overflow-hidden animate-fade-in-up ${
                collection.id === 4 ? "md:col-span-2 lg:col-span-3" : ""
              }`}
              style={{ animationDelay: `${index * 150}ms` }}
              onMouseEnter={() => setHoveredItem(collection.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div className={`relative overflow-hidden ${collection.id === 4 ? "aspect-[3/1]" : "aspect-[3/4]"}`}>
                <Image
                  src={collection.image || "/placeholder.svg"}
                  alt={collection.title}
                  fill
                  className={`object-cover transition-all duration-700 ${
                    hoveredItem === collection.id ? "scale-110" : "scale-100"
                  }`}
                />

                {/* Overlay */}
                <div
                  className={`absolute inset-0 bg-black transition-opacity duration-500 ${
                    hoveredItem === collection.id ? "bg-opacity-70" : "bg-opacity-40"
                  }`}
                />

                {/* Content */}
                <div className="absolute inset-0 flex items-center justify-center text-center text-white p-8">
                  <div
                    className={`transition-all duration-500 ${
                      hoveredItem === collection.id ? "transform scale-105" : ""
                    }`}
                  >
                    <h3 className="mb-2 text-2xl font-black uppercase tracking-wider md:text-3xl lg:text-4xl">
                      {collection.title}
                    </h3>
                    <p className="mb-4 text-sm uppercase tracking-wide md:text-base opacity-90">
                      {collection.subtitle}
                    </p>
                    <p
                      className={`text-sm md:text-base transition-all duration-500 ${
                        hoveredItem === collection.id ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                      }`}
                    >
                      {collection.description}
                    </p>
                  </div>
                </div>

                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-white/20 backdrop-blur-sm px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                    {collection.category}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-24 text-center">
          <h2 className="mb-8 text-3xl font-black uppercase tracking-wider md:text-4xl">Be Part of the Story</h2>
          <p className="mb-8 text-lg text-gray-600">
            Submit your own BLVCK moments and get featured in our community gallery.
          </p>
          <Button
            variant="outline"
            size="lg"
            className="border-black px-8 py-4 text-lg font-bold uppercase tracking-wide text-black hover:bg-black hover:text-white hover:scale-105 transition-all duration-300 bg-transparent"
          >
            Submit Your Story
          </Button>
        </div>
      </div>
    </div>
  )
}
