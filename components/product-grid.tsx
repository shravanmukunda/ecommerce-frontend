"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"
import { ScrollReveal } from "@/components/scroll-reveal"
import { useQuery } from "@apollo/client/react"
import { GET_PRODUCTS } from "@/graphql/product-queries"

const filters = ["All", "Tops", "Bottoms", "Outerwear"] // Removed "Footwear" and "Accessories"

export function ProductGrid() {
  const [activeFilter, setActiveFilter] = useState("All")
  
  const { loading, error, data } = useQuery(GET_PRODUCTS, {
    variables: { isActive: true }
  })

  if (loading) return <div className="py-16 text-center">Loading products...</div>
  if (error) return <div className="py-16 text-center text-red-500">Error loading products: {error.message}</div>

  // Transform GraphQL data to match the existing product structure
  const products = (data as any)?.products?.map((product: any) => ({
    id: parseInt(product.id),
    name: product.name,
    price: product.basePrice,
    image: product.designImageURL,
    description: product.description,
  })) || []

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
          {products.map((product: any, index: number) => (
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