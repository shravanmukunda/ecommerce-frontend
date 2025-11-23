"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollReveal } from "@/components/scroll-reveal"

const lookbookCollections = [
  {
    id: "1",
    title: "URBAN MINIMALISM",
    subtitle: "Fall/Winter 2024",
    description:
      "Where concrete meets couture. A study in architectural fashion, blending harsh urban landscapes with refined, minimalist silhouettes. This collection explores the beauty in stark contrasts and the power of understated elegance.",
    images: [
      "/placeholder.svg?height=1080&width=1920&text=Urban+Minimalism+1",
      "/placeholder.svg?height=1080&width=1920&text=Urban+Minimalism+2",
      "/placeholder.svg?height=1080&width=1920&text=Urban+Minimalism+3",
    ],
    relatedProducts: [
      { id: 1, name: "ESSENTIAL TEE", price: 85, image: "/placeholder.svg?height=400&width=300&text=Tee" },
      { id: 3, name: "CARGO PANTS", price: 195, image: "/placeholder.svg?height=400&width=300&text=Cargo" },
    ],
  },
  {
    id: "2",
    title: "STREET ELEGANCE",
    subtitle: "Capsule Collection",
    description:
      "Refined rebellion. Luxury meets the underground. This capsule collection redefines street style with elevated fabrics and sophisticated cuts, proving that comfort and high fashion can coexist.",
    images: [
      "/placeholder.svg?height=1080&width=1920&text=Street+Elegance+1",
      "/placeholder.svg?height=1080&width=1920&text=Street+Elegance+2",
    ],
    relatedProducts: [
      { id: 2, name: "OVERSIZED HOODIE", price: 165, image: "/placeholder.svg?height=400&width=300&text=Hoodie" },
      { id: 6, name: "MINIMAL SNEAKERS", price: 245, image: "/placeholder.svg?height=400&width=300&text=Sneakers" },
    ],
  },
  {
    id: "3",
    title: "MONOCHROME DREAMS",
    subtitle: "Editorial Series",
    description:
      "Black and white. Nothing more, nothing less. An editorial series that celebrates the timeless power of monochrome, showcasing how depth and emotion can be conveyed through the absence of color.",
    images: [
      "/placeholder.svg?height=1080&width=1920&text=Monochrome+Dreams+1",
      "/placeholder.svg?height=1080&width=1920&text=Monochrome+Dreams+2",
      "/placeholder.svg?height=1080&width=1920&text=Monochrome+Dreams+3",
      "/placeholder.svg?height=1080&width=1920&text=Monochrome+Dreams+4",
    ],
    relatedProducts: [
      { id: 1, name: "ESSENTIAL TEE", price: 85, image: "/placeholder.svg?height=400&width=300&text=Tee" },
      { id: 4, name: "BOMBER JACKET", price: 285, image: "/placeholder.svg?height=400&width=300&text=Bomber" },
    ],
  },
  {
    id: "4",
    title: "UNDERGROUND CULTURE",
    subtitle: "Collaboration",
    description:
      "Born from the streets, elevated to art. A unique collaboration that fuses raw street energy with high-end design, creating pieces that are both authentic and luxurious.",
    images: [
      "/placeholder.svg?height=1080&width=1920&text=Underground+Culture+1",
      "/placeholder.svg?height=1080&width=1920&text=Underground+Culture+2",
    ],
    relatedProducts: [
      { id: 5, name: "TRACK SUIT", price: 325, image: "/placeholder.svg?height=400&width=300&text=Track+Suit" },
      { id: 8, name: "WIDE LEG JEANS", price: 145, image: "/placeholder.svg?height=400&width=300&text=Jeans" },
    ],
  },
  {
    id: "5",
    title: "MIDNIGHT SESSIONS",
    subtitle: "Behind the Scenes",
    description:
      "The creative process unveiled. A rare glimpse into the late-night sessions and meticulous craftsmanship that go into every BLVCK collection, revealing the passion behind the brand.",
    images: [
      "/placeholder.svg?height=1080&width=1920&text=Midnight+Sessions+1",
      "/placeholder.svg?height=1080&width=1920&text=Midnight+Sessions+2",
    ],
    relatedProducts: [
      { id: 7, name: "LEATHER JACKET", price: 485, image: "/placeholder.svg?height=400&width=300&text=Leather" },
    ],
  },
  {
    id: "6",
    title: "FUTURE NOIR",
    subtitle: "Spring/Summer 2025",
    description:
      "Tomorrow's darkness, today's vision. This collection anticipates future trends, blending dystopian aesthetics with sleek, functional designs for the modern urban explorer.",
    images: [
      "/placeholder.svg?height=1080&width=1920&text=Future+Noir+1",
      "/placeholder.svg?height=1080&width=1920&text=Future+Noir+2",
      "/placeholder.svg?height=1080&width=1920&text=Future+Noir+3",
    ],
    relatedProducts: [
      { id: 2, name: "OVERSIZED HOODIE", price: 165, image: "/placeholder.svg?height=400&width=300&text=Hoodie" },
      { id: 5, name: "TRACK SUIT", price: 325, image: "/placeholder.svg?height=400&width=300&text=Track+Suit" },
    ],
  },
]

interface LookbookDetailProps {
  collectionId: string
}

export function LookbookDetail({ collectionId }: LookbookDetailProps) {
  const collection = lookbookCollections.find((col) => col.id === collectionId)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    if (!collection) {
      // Handle case where collection is not found, e.g., redirect to 404 or lookbook page
      console.error("Collection not found")
    }
  }, [collection])

  if (!collection) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <h1 className="text-3xl font-black uppercase tracking-wider">Collection Not Found</h1>
      </div>
    )
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % collection.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + collection.images.length) % collection.images.length)
  }

  return (
    <div className="min-h-screen pt-16 lg:pt-20">
      {/* Hero Section */}
      <section className="relative h-[60vh] bg-black text-white overflow-hidden">
        <Image
          src={collection.images[currentImageIndex] || "/placeholder.svg"}
          alt={collection.title}
          fill
          className="object-cover transition-opacity duration-700"
        />
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 flex h-full items-center justify-center">
          <div className="container mx-auto px-4 text-center">
            <ScrollReveal direction="up" delay={200}>
              <h1 className="mb-4 text-4xl font-black uppercase tracking-wider md:text-6xl lg:text-8xl">
                {collection.title}
              </h1>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={400}>
              <p className="text-lg uppercase tracking-wide md:text-xl lg:text-2xl">{collection.subtitle}</p>
            </ScrollReveal>
          </div>
        </div>

        {/* Image Navigation */}
        {collection.images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 text-black hover:bg-white hover:scale-110 transition-all duration-300 z-20"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 text-black hover:bg-white hover:scale-110 transition-all duration-300 z-20"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
            <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 space-x-2">
              {collection.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`h-2 w-8 transition-all duration-300 ${
                    index === currentImageIndex ? "bg-white" : "bg-white/50 hover:bg-white/75"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Collection Description */}
        <ScrollReveal direction="up">
          <div className="mb-16 max-w-3xl mx-auto text-center">
            <p className="text-lg leading-relaxed text-gray-700">{collection.description}</p>
          </div>
        </ScrollReveal>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {collection.images.map((img, index) => (
            <ScrollReveal key={index} direction="up" delay={index * 100}>
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src={img || "/placeholder.svg"}
                  alt={`${collection.title} image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Related Products */}
        {collection.relatedProducts && collection.relatedProducts.length > 0 && (
          <section className="mt-24">
            <ScrollReveal direction="up">
              <h2 className="mb-8 text-center text-3xl font-black uppercase tracking-wider">Shop the Collection</h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {collection.relatedProducts.map((product, index) => (
                <ScrollReveal key={product.id} direction="up" delay={index * 100}>
                  <Link href={`/product/${product.id}`} className="group block">
                    <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-4">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <h3 className="mb-1 text-lg font-bold uppercase tracking-wide group-hover:text-gray-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-gray-600">${product.price}</p>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </section>
        )}

        {/* Call to Action */}
        <ScrollReveal direction="up" delay={400}>
          <div className="mt-24 text-center">
            <h2 className="mb-8 text-3xl font-black uppercase tracking-wider md:text-4xl">Explore More Lookbooks</h2>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-black px-8 py-4 text-lg font-bold uppercase tracking-wide text-black hover:bg-black hover:text-white hover:scale-105 transition-all duration-300 bg-transparent"
            >
              <Link href="/lookbook">View All Collections</Link>
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </div>
  )
}
