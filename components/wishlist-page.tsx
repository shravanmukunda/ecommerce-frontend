"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingBag, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollReveal } from "@/components/scroll-reveal"
import { useStore } from "@/context/store-context" // Import useStore

export function WishlistPage() {
  const { wishlistItems, removeFromWishlist, addToCart, clearWishlist } = useStore() // Use wishlist items and actions from global store
  const [addingToCartId, setAddingToCartId] = useState<number | null>(null) // State to track which item is being added to cart

  const handleAddToCartFromWishlist = async (item: (typeof wishlistItems)[0]) => {
    setAddingToCartId(item.id)
    await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate network delay
    addToCart(item, 1) // Add to cart
    removeFromWishlist(item.id) // Remove from wishlist after adding to cart
    setAddingToCartId(null)
    alert(`${item.name} added to cart and removed from wishlist!`)
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen pt-16 lg:pt-20">
        <div className="container mx-auto px-4 py-16">
          <ScrollReveal direction="up">
            <div className="text-center">
              <Heart className="mx-auto mb-8 h-24 w-24 text-gray-400" />
              <h1 className="mb-4 text-3xl font-black uppercase tracking-wider">Your Wishlist is Empty</h1>
              <p className="mb-8 text-lg text-gray-600">Save items you love for later by clicking the heart icon.</p>
              <Link href="/shop">
                <Button
                  size="lg"
                  className="bg-black px-8 py-4 text-lg font-bold uppercase tracking-wide text-white hover:bg-gray-800 hover:scale-105 transition-all duration-300"
                >
                  Discover Products
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-16 lg:pt-20">
      {/* Hero Section */}
      <section className="bg-black py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <ScrollReveal direction="up">
            <h1 className="mb-4 text-4xl font-black uppercase tracking-wider md:text-6xl lg:text-8xl">Wishlist</h1>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={200}>
            <p className="text-lg uppercase tracking-wide md:text-xl">Your saved favorites</p>
          </ScrollReveal>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <ScrollReveal direction="up">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-black uppercase tracking-wider">Saved Items ({wishlistItems.length})</h2>
            <Button
              variant="outline"
              onClick={clearWishlist}
              className="border-black text-black hover:bg-black hover:text-white bg-transparent"
            >
              Clear All
            </Button>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {wishlistItems.map((item, index) => (
            <ScrollReveal key={item.id} direction="up" delay={index * 100}>
              <div className="group relative bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-600 hover:bg-white hover:text-red-500 transition-all duration-300"
                    aria-label={`Remove ${item.name} from wishlist`}
                  >
                    <X className="h-4 w-4" />
                  </button>

                  {/* Stock Status */}
                  {!item.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="bg-white px-4 py-2 text-sm font-bold uppercase tracking-wide">Out of Stock</span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <Link href={`/product/${item.id}`}>
                    <h3 className="mb-2 text-lg font-bold uppercase tracking-wide hover:text-gray-600 transition-colors">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="mb-4 text-lg font-semibold">${item.price}</p>

                  <div className="space-y-2">
                    <Button
                      onClick={() => handleAddToCartFromWishlist(item)}
                      disabled={!item.inStock || addingToCartId === item.id}
                      className="w-full bg-black text-white hover:bg-gray-800 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      {addingToCartId === item.id ? "Adding..." : item.inStock ? "Add to Cart" : "Out of Stock"}
                    </Button>
                    <Link href={`/product/${item.id}`}>
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
            </ScrollReveal>
          ))}
        </div>

        {/* Recommendations */}
        <ScrollReveal direction="up" delay={400}>
          <section className="mt-24">
            <h2 className="mb-8 text-center text-3xl font-black uppercase tracking-wider">You Might Also Like</h2>
            <div className="text-center">
              <Link href="/shop">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-black px-8 py-4 text-lg font-bold uppercase tracking-wide text-black hover:bg-black hover:text-white hover:scale-105 transition-all duration-300 bg-transparent"
                >
                  Explore More Products
                </Button>
              </Link>
            </div>
          </section>
        </ScrollReveal>
      </div>
    </div>
  )
}
