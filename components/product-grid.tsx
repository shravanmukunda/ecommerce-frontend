"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"
import { ScrollReveal } from "@/components/scroll-reveal"

const products = [
  {
    id: 1,
    name: "ESSENTIAL TEE",
    price: 85,
    image: "/placeholder.svg?height=600&width=400&text=Essential+Tee+Front",
    hoverImage: "/placeholder.svg?height=600&width=400&text=Essential+Tee+Back",
    images: [
      "/placeholder.svg?height=600&width=400&text=Essential+Tee+Front",
      "/placeholder.svg?height=600&width=400&text=Essential+Tee+Back",
      "/placeholder.svg?height=600&width=400&text=Essential+Tee+Detail",
    ],
  },
  {
    id: 2,
    name: "OVERSIZED HOODIE",
    price: 165,
    image: "/placeholder.svg?height=600&width=400&text=Oversized+Hoodie+Front",
    hoverImage: "/placeholder.svg?height=600&width=400&text=Oversized+Hoodie+Back",
    images: [
      "/placeholder.svg?height=600&width=400&text=Oversized+Hoodie+Front",
      "/placeholder.svg?height=600&width=400&text=Oversized+Hoodie+Back",
      "/placeholder.svg?height=600&width=400&text=Oversized+Hoodie+Detail",
    ],
  },
  {
    id: 3,
    name: "CARGO PANTS",
    price: 195,
    image: "/placeholder.svg?height=600&width=400&text=Cargo+Pants+Front",
    hoverImage: "/placeholder.svg?height=600&width=400&text=Cargo+Pants+Back",
    images: [
      "/placeholder.svg?height=600&width=400&text=Cargo+Pants+Front",
      "/placeholder.svg?height=600&width=400&text=Cargo+Pants+Back",
      "/placeholder.svg?height=600&width=400&text=Cargo+Pants+Detail",
    ],
  },
  {
    id: 4,
    name: "BOMBER JACKET",
    price: 285,
    image: "/placeholder.svg?height=600&width=400&text=Bomber+Jacket+Front",
    hoverImage: "/placeholder.svg?height=600&width=400&text=Bomber+Jacket+Back",
    images: [
      "/placeholder.svg?height=600&width=400&text=Bomber+Jacket+Front",
      "/placeholder.svg?height=600&width=400&text=Bomber+Jacket+Back",
      "/placeholder.svg?height=600&width=400&text=Bomber+Jacket+Detail",
    ],
  },
  {
    id: 5,
    name: "TRACK SUIT",
    price: 325,
    image: "/placeholder.svg?height=600&width=400&text=Track+Suit+Front",
    hoverImage: "/placeholder.svg?height=600&width=400&text=Track+Suit+Back",
    images: [
      "/placeholder.svg?height=600&width=400&text=Track+Suit+Front",
      "/placeholder.svg?height=600&width=400&text=Track+Suit+Back",
      "/placeholder.svg?height=600&width=400&text=Track+Suit+Detail",
    ],
  },
  {
    id: 6,
    name: "MINIMAL SNEAKERS",
    price: 245,
    image: "/placeholder.svg?height=600&width=400&text=Minimal+Sneakers+Side",
    hoverImage: "/placeholder.svg?height=600&width=400&text=Minimal+Sneakers+Top",
    images: [
      "/placeholder.svg?height=600&width=400&text=Minimal+Sneakers+Side",
      "/placeholder.svg?height=600&width=400&text=Minimal+Sneakers+Top",
      "/placeholder.svg?height=600&width=400&text=Minimal+Sneakers+Detail",
    ],
  },
]

const filters = ["All", "Tops", "Bottoms", "Outerwear"] // Removed "Footwear" and "Accessories"

export function ProductGrid() {
  const [activeFilter, setActiveFilter] = useState("All")

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <ScrollReveal direction="up">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-black uppercase tracking-wider md:text-4xl lg:text-5xl">
              Featured Collection
            </h2>
            <p className="text-lg uppercase tracking-wide text-gray-600">
              Curated essentials for the modern minimalist
            </p>
          </div>
        </ScrollReveal>

        {/* Filter Bar */}
        <ScrollReveal direction="up" delay={200}>
          <div className="mb-12 flex flex-wrap justify-center gap-4">
            {filters.map((filter) => (
              <Button
                key={filter}
                variant={activeFilter === filter ? "default" : "outline"}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2 font-semibold uppercase tracking-wide ${
                  activeFilter === filter
                    ? "bg-black text-white hover:bg-gray-800"
                    : "border-black text-black hover:bg-black hover:text-white"
                }`}
              >
                {filter}
              </Button>
            ))}
          </div>
        </ScrollReveal>

        {/* Product Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => (
            <ScrollReveal key={product.id} direction="up" delay={index * 100}>
              <ProductCard product={product} />
            </ScrollReveal>
          ))}
        </div>

        {/* Load More */}
        <ScrollReveal direction="up" delay={200}>
          <div className="mt-16 text-center">
            <Button
              variant="outline"
              size="lg"
              className="border-black px-8 py-4 text-lg font-bold uppercase tracking-wide text-black hover:bg-black hover:text-white bg-transparent"
            >
              Load More
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
