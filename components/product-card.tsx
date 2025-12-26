"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Loader2 } from "lucide-react"
import { useCart } from "@/src/hooks/use-cart"
import type { Product } from "@/lib/types"

interface ProductCardProps {
  product: Product & {
    variants?: Array<{
      id: string
      size?: string
      color?: string
      inventory?: {
        availableQuantity?: number
      }
    }>
  }
  viewMode?: "grid" | "list"
}

export function ProductCard({ product, viewMode = "grid" }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const { addToCart } = useCart()
  
  // Determine the current image based on hover state
  const currentImage = isHovered && product.hoverImage ? product.hoverImage : product.image

  // Get first available variant for quick-add
  const getFirstAvailableVariant = () => {
    if (!product.variants || product.variants.length === 0) return null
    return product.variants.find(
      (v) => !v.inventory || (v.inventory.availableQuantity ?? 0) > 0
    ) || product.variants[0]
  }

  const handleQuickAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const variant = getFirstAvailableVariant()
    if (!variant) {
      // No variant available, redirect to product page
      window.location.href = `/product/${product.id}`
      return
    }

    setIsAddingToCart(true)
    try {
      await addToCart(String(product.id), variant.id, 1)
      // Show success feedback (you could use a toast here)
    } catch (error: any) {
      console.error("Error adding to cart:", error)
      // If quick-add fails, redirect to product page
      window.location.href = `/product/${product.id}`
    } finally {
      setIsAddingToCart(false)
    }
  }

  if (viewMode === "list") {
    return (
      <div
        className="group flex overflow-hidden bg-[#1a1a1a] border border-[#333] transition-all duration-300 hover:border-[#666]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link href={`/product/${product.id}`} className="relative w-1/3 aspect-[3/4] overflow-hidden flex-shrink-0">
          <Image
            src={currentImage || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-all duration-500 group-hover:opacity-90"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {product.limitedEdition && (
            <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-sm shadow-lg z-10">
              Limited Edition
            </div>
          )}
        </Link>
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            <Link href={`/product/${product.id}`}>
              <h3 className="mb-2 text-xl font-light uppercase tracking-wide text-[#e5e5e5] hover:text-[#ccc] transition-colors">
                {product.name}
              </h3>
            </Link>
            <p className="mb-4 text-2xl font-light text-[#e5e5e5]">
              ₹{product.price}
            </p>
            <p className="text-[#666] text-sm">Premium quality streetwear piece crafted with attention to detail.</p>
          </div>
          <div className="flex space-x-4 mt-4">
            <Link href={`/product/${product.id}`} className="flex-1">
              <Button
                className="w-full bg-[#e5e5e5] text-[#0f0f0f] hover:bg-[#ccc] transition-all duration-300 border-0 text-sm font-light uppercase tracking-widest"
              >
                Buy Now
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={handleQuickAddToCart}
              disabled={isAddingToCart}
              className="flex-1 border border-[#333] text-[#e5e5e5] hover:border-[#666] hover:bg-[#1a1a1a] transition-all duration-300 bg-transparent text-sm font-light uppercase tracking-widest"
            >
              {isAddingToCart ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="group relative overflow-hidden bg-[#1a1a1a] border border-[#333] transition-all duration-300 hover:border-[#666]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <Link href={`/product/${product.id}`}>
        <div className="relative aspect-[3/4] overflow-hidden bg-[#0f0f0f]">
          <Image
            src={currentImage || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-all duration-500 group-hover:opacity-90"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {product.limitedEdition && (
            <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-sm shadow-lg z-10">
              Limited Edition
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-5 relative">
        <Link href={`/product/${product.id}`}>
          <h3 className="mb-2 text-lg font-light uppercase tracking-wide text-[#e5e5e5] group-hover:text-[#ccc] transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-xl font-light text-[#e5e5e5] mb-4">
          ₹{product.price}
        </p>

        {/* Add to Cart Button - Appears on hover */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            onClick={handleQuickAddToCart}
            disabled={isAddingToCart}
            className="w-full bg-[#e5e5e5] text-[#0f0f0f] hover:bg-[#ccc] transition-all duration-300 border-0 text-sm font-light uppercase tracking-widest"
          >
            {isAddingToCart ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </>
            )}
          </Button>
        </div>

        {/* Fallback View Details button when not hovered */}
        <Link href={`/product/${product.id}`}>
          <Button
            className="w-full mt-2 bg-transparent border border-[#333] text-[#999] hover:border-[#666] hover:text-[#e5e5e5] transition-all duration-300 group-hover:hidden text-sm font-light uppercase tracking-widest"
          >
            View Details
          </Button>
        </Link>
      </div>
    </div>
  )
}