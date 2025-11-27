"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useStore, type Product } from "@/context/store-context"

interface ProductCardProps {
  product: Product
  viewMode?: "grid" | "list"
}

export function ProductCard({ product, viewMode = "grid" }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Determine the current image based on hover state
  const currentImage = isHovered && product.hoverImage ? product.hoverImage : product.image

  if (viewMode === "list") {
    return (
      <div
        className="group flex overflow-hidden bg-white shadow-lg hover:shadow-xl transition-all duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link href={`/product/${product.id}`} className="relative w-1/3 aspect-[3/4] overflow-hidden flex-shrink-0">
          <Image
            src={currentImage || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-all duration-300 group-hover:scale-105" // Shorter transition for instant feel
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            <Link href={`/product/${product.id}`}>
              <h3 className="mb-2 text-xl font-bold uppercase tracking-wide hover:text-gray-600 transition-colors">
                {product.name}
              </h3>
            </Link>
            <p className="mb-4 text-lg font-semibold">${product.price}</p>
            <p className="text-gray-600 text-sm">Premium quality streetwear piece crafted with attention to detail.</p>
          </div>
          <div className="flex space-x-4 mt-4">
            <Link href={`/product/${product.id}`} className="flex-1">
              <Button
                className="w-full bg-black text-white hover:bg-gray-800 hover:scale-105 transition-all duration-300"
              >
                Buy Now
              </Button>
            </Link>
            <Link href={`/product/${product.id}`} className="flex-1">
              <Button
                variant="outline"
                className="w-full border-black text-black hover:bg-black hover:text-white hover:scale-105 transition-all duration-300 bg-transparent"
              >
                View Details
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="group relative overflow-hidden bg-white hover-lift"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/product/${product.id}`}>
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={currentImage || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-all duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </Link>
      <div className="p-4">
        <h3 className="mb-1 text-lg font-bold uppercase tracking-wide">{product.name}</h3>
        <p className="text-sm text-gray-600">${product.price}</p>
        <Link href={`/product/${product.id}`}>
          <Button className="w-full bg-black text-white hover:bg-gray-800 transition-all duration-300">
            Buy Now
          </Button>
        </Link>
      </div>
    </div>
  )
}