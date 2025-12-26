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

  if (loading) return <div className="py-16 text-center text-[#999] bg-gradient-to-b from-black via-gray-900 to-black">Loading products...</div>
  if (error) return <div className="py-16 text-center text-[#666] bg-gradient-to-b from-black via-gray-900 to-black">Error loading products: {error.message}</div>

  // Transform GraphQL data to match the existing product structure
  // Support both new imageURLs array and legacy designImageURL
  const products = (data as any)?.products?.map((product: any) => {
    const images = product.imageURLs && product.imageURLs.length > 0 
      ? product.imageURLs 
      : (product.designImageURL ? [product.designImageURL] : [])
    
    return {
      id: parseInt(product.id),
      name: product.name,
      price: product.basePrice,
      image: images[0] || product.designImageURL || "",
      hoverImage: images[1] || null, // Use second image as hover image if available
      images: images,
      description: product.description,
      limitedEdition: product.limitedEdition || false,
    }
  }) || []

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-black via-gray-900 to-black relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <ScrollReveal direction="up">
          <div className="mb-12 text-center border-b border-[#383737] pb-8">
            <h2 className="mb-4 text-3xl font-light uppercase tracking-wider md:text-4xl lg:text-5xl text-[#e5e5e5]">
              Featured Collection
            </h2>
            <p className="text-xs uppercase tracking-widest text-[#666]">
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
                variant="outline"
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2 text-xs font-light uppercase tracking-widest border border-[#333] transition-all duration-300 ${
                  activeFilter === filter
                    ? "bg-[#e5e5e5] text-[#0f0f0f] border-[#e5e5e5]"
                    : "bg-transparent text-[#999] hover:text-[#e5e5e5] hover:border-[#666]"
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
      </div>
    </section>
  )
}