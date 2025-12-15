"use client"

import { useState } from "react"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollReveal } from "@/components/scroll-reveal"
import { useQuery } from "@apollo/client/react"
import { GET_PRODUCTS } from "@/graphql/product-queries"
import { GooeyText } from "@/components/ui/gooey-text-morphing"
import AnimatedShaderBackground from "@/components/ui/animated-shader-background"

export function ShopPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedSort, setSelectedSort] = useState("featured")

  const { loading, error, data } = useQuery(GET_PRODUCTS, {
    variables: { isActive: true }
  })

  if (loading) return <div className="py-16 text-center">Loading products...</div>
  if (error) return <div className="py-16 text-center text-red-500">Error loading products: {error.message}</div>

  // Transform GraphQL data to match the existing product structure
  const allProducts = (data as any)?.products?.map((product: any) => ({
    id: parseInt(product.id),
    name: product.name,
    price: product.basePrice,
    image: product.designImageURL,
    description: product.description,
  })) || []

  const categories = ["All", "T-Shirts", "Hoodies", "Jeans", "Jackets", "Pants"] // Updated categories

  const filteredProducts = allProducts.filter((product: any) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const sortedProducts = filteredProducts.sort((a: any, b: any) => {
    if (selectedSort === "price-asc") {
      return a.price - b.price
    }
    if (selectedSort === "price-desc") {
      return b.price - a.price
    }
    // Default or 'featured' sort (no specific order)
    return 0
  })

  return (
    <div className="min-h-screen pt-16 lg:pt-20">
      {/* Hero Section */}
      <section className="relative h-[70vh] bg-black text-white flex items-center justify-center overflow-hidden">
        <AnimatedShaderBackground />
        <div className="relative z-10 text-center w-full">
          <ScrollReveal direction="scale" delay={200}>
            <div className="h-[200px] flex items-center justify-center w-full">
              <GooeyText
                texts={["Buy It.", "Love It."]}
                morphTime={2}
                cooldownTime={1}
                className="font-black uppercase tracking-wider"
                textClassName="text-white text-4xl md:text-6xl lg:text-7xl"
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Filters and Product Grid */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Filter and Sort Controls */}
          <div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="w-full md:w-auto">
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white text-black placeholder:text-gray-500"
              />
            </div>
            <div className="flex w-full flex-col gap-4 sm:flex-row md:w-auto">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-[180px] bg-white text-black">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedSort} onValueChange={setSelectedSort}>
                <SelectTrigger className="w-full sm:w-[180px] bg-white text-black">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex space-x-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  onClick={() => setViewMode("grid")}
                  className="bg-black text-white hover:bg-gray-800 border-black hover:text-white"
                >
                  Grid
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  onClick={() => setViewMode("list")}
                  className="bg-black text-white hover:bg-gray-800 border-black hover:text-white"
                >
                  List
                </Button>
              </div>
            </div>
          </div>

          {/* Product Grid/List */}
          {sortedProducts.length === 0 ? (
            <div className="text-center text-gray-600 text-lg py-10">No products found matching your criteria.</div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid grid-cols-1 gap-8"
              }
            >
              {sortedProducts.map((product: any) => (
                <ScrollReveal key={product.id} direction="up">
                  <ProductCard product={product} viewMode={viewMode} />
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}