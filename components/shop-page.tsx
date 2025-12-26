"use client"

import { useState } from "react"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollReveal } from "@/components/scroll-reveal"
import { useQuery } from "@apollo/client/react"
import { GET_PRODUCTS } from "@/graphql/product-queries"

export function ShopPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedSort, setSelectedSort] = useState("featured")

  const { loading, error, data } = useQuery(GET_PRODUCTS, {
    variables: { isActive: true }
  })

  if (loading) return <div className="min-h-screen pt-16 lg:pt-20 bg-gradient-to-b from-black via-gray-900 to-black py-16 text-center text-[#999]">Loading products...</div>
  if (error) return <div className="min-h-screen pt-16 lg:pt-20 bg-gradient-to-b from-black via-gray-900 to-black py-16 text-center text-[#666]">Error loading products: {error.message}</div>

  // Transform GraphQL data to match the existing product structure
  // Support both new imageURLs array and legacy designImageURL
  const allProducts = (data as any)?.products?.map((product: any) => {
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
      category: product.category,
      limitedEdition: product.limitedEdition || false,
    }
  }) || []

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
    <div className="min-h-screen pt-16 lg:pt-20 bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Header Section */}
      <section className="border-b border-[#1a1a1a] py-12">
        <div className="container mx-auto px-4">
          <ScrollReveal direction="up">
            <h1 className="text-4xl font-light uppercase tracking-wider md:text-5xl lg:text-6xl text-[#e5e5e5] mb-2">
              Shop
            </h1>
            <p className="text-sm text-[#666] uppercase tracking-widest">
              {sortedProducts.length} {sortedProducts.length === 1 ? 'Product' : 'Products'}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Filters and Product Grid */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          {/* Filter and Sort Controls */}
          <div className="mb-12 flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="w-full md:w-auto">
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#333] text-[#e5e5e5] placeholder:text-[#666] focus:border-[#666] focus:ring-0"
              />
            </div>
            <div className="flex w-full flex-col gap-4 sm:flex-row md:w-auto">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-[180px] bg-[#1a1a1a] border border-[#333] text-[#e5e5e5] hover:border-[#666]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border border-[#333]">
                  {categories.map((category) => (
                    <SelectItem key={category} value={category} className="text-[#e5e5e5] hover:bg-[#0f0f0f]">
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedSort} onValueChange={setSelectedSort}>
                <SelectTrigger className="w-full sm:w-[180px] bg-[#1a1a1a] border border-[#333] text-[#e5e5e5] hover:border-[#666]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border border-[#333]">
                  <SelectItem value="featured" className="text-[#e5e5e5] hover:bg-[#0f0f0f]">Featured</SelectItem>
                  <SelectItem value="price-asc" className="text-[#e5e5e5] hover:bg-[#0f0f0f]">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc" className="text-[#e5e5e5] hover:bg-[#0f0f0f]">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setViewMode("grid")}
                  className={`border border-[#333] transition-all duration-300 ${
                    viewMode === "grid"
                      ? "bg-[#e5e5e5] text-[#0f0f0f] border-[#e5e5e5]"
                      : "bg-transparent text-[#999] hover:text-[#e5e5e5] hover:border-[#666]"
                  }`}
                >
                  Grid
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setViewMode("list")}
                  className={`border border-[#333] transition-all duration-300 ${
                    viewMode === "list"
                      ? "bg-[#e5e5e5] text-[#0f0f0f] border-[#e5e5e5]"
                      : "bg-transparent text-[#999] hover:text-[#e5e5e5] hover:border-[#666]"
                  }`}
                >
                  List
                </Button>
              </div>
            </div>
          </div>

          {/* Product Grid/List */}
          {sortedProducts.length === 0 ? (
            <div className="text-center text-[#666] text-sm py-20 uppercase tracking-widest">
              No products found matching your criteria.
            </div>
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