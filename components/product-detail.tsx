"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Heart, Share2, Truck, Shield, Ruler, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollReveal } from "@/components/scroll-reveal"
import { useStore } from "@/context/store-context" // Import useStore and Product type alias

// Placeholder data for a specific product for the ProductDetail page
// In a real app, this would be fetched from a database based on productId
const dummyProductData = {
  id: 1, // This ID should match what's in your product data elsewhere for context to work
  name: "ESSENTIAL TEE",
  price: 85,
  description:
    "The perfect foundation for any wardrobe. Crafted from premium organic cotton with a relaxed fit that embodies effortless luxury. This essential piece features our signature minimalist design philosophy with attention to every detail.",
  images: [
    "/placeholder.svg?height=800&width=600&text=Essential+Tee+Front",
    "/placeholder.svg?height=800&width=600&text=Essential+Tee+Back",
    "/placeholder.svg?height=800&width=600&text=Essential+Tee+Detail",
    "/placeholder.svg?height=800&width=600&text=Essential+Tee+Lifestyle",
  ],
  category: "Tops",
  materials: ["100% Organic Cotton", "GOTS Certified", "Pre-shrunk fabric", "Weight: 180 GSM"],
  careInstructions: ["Machine wash cold (30°C)", "Tumble dry low", "Do not bleach", "Iron on low heat if needed"],
}

const sizes = ["XS", "S", "M", "L", "XL", "XXL"]

const reviews = [
  {
    id: 1,
    name: "Alex M.",
    rating: 5,
    comment: "Perfect fit and amazing quality. The fabric feels premium and the cut is exactly what I expected.",
    date: "2024-01-15",
  },
  {
    id: 2,
    name: "Jordan K.",
    rating: 5,
    comment: "Love the minimalist design. Goes with everything in my wardrobe.",
    date: "2024-01-10",
  },
  {
    id: 3,
    name: "Sam R.",
    rating: 4,
    comment: "Great quality but runs slightly large. Would recommend sizing down.",
    date: "2024-01-05",
  },
]

const relatedProducts = [
  {
    id: 2,
    name: "OVERSIZED HOODIE",
    price: 165,
    image: "/placeholder.svg?height=400&width=300&text=Hoodie",
  },
  {
    id: 3,
    name: "CARGO PANTS",
    price: 195,
    image: "/placeholder.svg?height=400&width=300&text=Cargo",
  },
  {
    id: 4,
    name: "BOMBER JACKET",
    price: 285,
    image: "/placeholder.svg?height=400&width=300&text=Bomber",
  },
]

interface ProductDetailProps {
  productId: string // This will be the ID from the URL params
}

export function ProductDetail({ productId }: ProductDetailProps) {
  // In a real app, you'd fetch product data based on productId here
  // For now, we'll use dummyProductData
  const product = dummyProductData // Assuming productId maps to this dummy data

  const [currentImage, setCurrentImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState("description")
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  const { addToCart, addToWishlist, wishlistItems, removeFromWishlist } = useStore() // Get functions and state from global store
  const isWishlisted = wishlistItems.some((item) => item.id === product.id)

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % product.images.length)
  }

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + product.images.length) % product.images.length)
  }

  const handleAddToCart = async () => {
    if (!selectedSize) {
      alert("Please select a size first.")
      return
    }
    setIsAddingToCart(true)
    // Simulate API call before adding to context if needed
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Add product to global cart with selected size and quantity
    addToCart(
      {
        ...product,
        size: selectedSize,
        color: "Black", // Assuming default color for simplicity
      },
      quantity,
    )

    setIsAddingToCart(false)
    alert(`${quantity} x ${product.name} (Size: ${selectedSize}) added to cart!`)
  }

  const handleToggleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length

  return (
    <div className="min-h-screen pt-16 lg:pt-20">
      {/* Breadcrumb */}
      <ScrollReveal direction="up">
        <div className="border-b border-gray-200 py-4">
          <div className="container mx-auto px-4">
            <nav className="flex items-center space-x-2 text-sm">
              <Link href="/" className="text-gray-500 hover:text-black">
                Home
              </Link>
              <span className="text-gray-400">/</span>
              <Link href="/shop" className="text-gray-500 hover:text-black">
                Shop
              </Link>
              <span className="text-gray-400">/</span>
              <span className="font-semibold">{product.name}</span>
            </nav>
          </div>
        </div>
      </ScrollReveal>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Image Gallery */}
          <ScrollReveal direction="left">
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                <Image
                  src={product.images[currentImage] || "/placeholder.svg"}
                  alt={`${product.name} - View ${currentImage + 1}`}
                  fill
                  className="object-cover"
                  priority={currentImage === 0} // Prioritize loading the first image
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px" // Responsive image sizes
                />

                {/* Navigation Arrows */}
                {product.images.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 text-black hover:bg-white hover:scale-110 transition-all duration-300"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 text-black hover:bg-white hover:scale-110 transition-all duration-300"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </Button>
                  </>
                )}

                {/* Image Indicators */}
                {product.images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 space-x-2">
                    {product.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImage(index)}
                        aria-label={`View image ${index + 1}`}
                        className={`h-2 w-8 transition-all duration-300 ${
                          index === currentImage ? "bg-white" : "bg-white/50 hover:bg-white/75"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {product.images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto p-1">
                  {" "}
                  {/* Added p-1 for slight padding for ring */}
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImage(index)}
                      aria-label={`Select thumbnail ${index + 1}`}
                      className={`relative h-20 w-16 flex-shrink-0 overflow-hidden transition-all duration-300 hover:scale-105 ${
                        currentImage === index ? "ring-2 ring-black" : ""
                      }`}
                    >
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`Product thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="64px" // Fixed size for thumbnails
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </ScrollReveal>

          {/* Product Info */}
          <ScrollReveal direction="right">
            <div className="space-y-6">
              <div>
                <Badge variant="outline" className="mb-2">
                  New Arrival
                </Badge>
                <h1 className="text-3xl font-black uppercase tracking-wider md:text-4xl">{product.name}</h1>
                <div className="mt-2 flex items-center space-x-4">
                  <p className="text-2xl font-bold">${product.price}</p>
                  <div className="flex items-center space-x-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(averageRating) ? "fill-black text-black" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">({reviews.length} reviews)</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>

              {/* Size Selection */}
              <div>
                <h3 className="mb-3 text-lg font-semibold uppercase tracking-wide">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? "default" : "outline"}
                      onClick={() => setSelectedSize(size)}
                      className={`h-12 w-12 transition-all duration-300 ${
                        selectedSize === size
                          ? "bg-black text-white scale-105"
                          : "border-black text-black hover:bg-black hover:text-white hover:scale-105"
                      }`}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
                <Link href="/size-guide" className="mt-2 inline-block text-sm text-gray-600 underline hover:text-black">
                  Size Guide
                </Link>
              </div>

              {/* Quantity */}
              <div>
                <h3 className="mb-3 text-lg font-semibold uppercase tracking-wide">Quantity</h3>
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="border-black text-black hover:bg-black hover:text-white hover:scale-105 transition-all duration-300"
                    aria-label="Decrease quantity"
                  >
                    -
                  </Button>
                  <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    className="border-black text-black hover:bg-black hover:text-white hover:scale-105 transition-all duration-300"
                    aria-label="Increase quantity"
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={!selectedSize || isAddingToCart}
                  size="lg"
                  className="w-full bg-black py-4 text-lg font-bold uppercase tracking-wide text-white hover:bg-gray-800 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAddingToCart ? "Adding to Cart..." : "Add to Cart"}
                </Button>
                <Link href="/checkout">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full border-black py-4 text-lg font-bold uppercase tracking-wide text-black hover:bg-black hover:text-white hover:scale-105 transition-all duration-300 bg-transparent"
                    disabled={!selectedSize}
                  >
                    Buy Now
                  </Button>
                </Link>
                <div className="flex space-x-4">
                  <Button
                    variant="ghost"
                    onClick={handleToggleWishlist}
                    className="flex-1 text-black hover:bg-gray-100 hover:scale-105 transition-all duration-300"
                    aria-label={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                  >
                    <Heart className={`mr-2 h-5 w-5 ${isWishlisted ? "fill-current text-red-500" : ""}`} />
                    {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
                  </Button>
                  <Button
                    variant="ghost"
                    className="text-black hover:bg-gray-100 hover:scale-105 transition-all duration-300"
                    aria-label="Share product"
                  >
                    <Share2 className="mr-2 h-5 w-5" />
                    Share
                  </Button>
                </div>
              </div>

              {/* Product Features */}
              <div className="space-y-4 border-t pt-6">
                <div className="flex items-center space-x-3">
                  <Truck className="h-5 w-5" />
                  <span className="text-sm">Free shipping on orders over $100</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5" />
                  <span className="text-sm">30-day return guarantee</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Ruler className="h-5 w-5" />
                  <span className="text-sm">Size guide available</span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Product Details Tabs */}
        <ScrollReveal direction="up" delay={200}>
          <div className="mt-16">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8">
                {["description", "materials", "reviews"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-4 text-sm font-semibold uppercase tracking-wide transition-colors ${
                      activeTab === tab ? "border-b-2 border-black text-black" : "text-gray-500 hover:text-black"
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)} {/* Capitalize tab names for display */}
                  </button>
                ))}
              </nav>
            </div>

            <div className="py-8">
              {activeTab === "description" && (
                <div className="prose max-w-none">
                  <h3 className="text-xl font-bold uppercase tracking-wide">Product Description</h3>
                  <p className="mt-4 text-gray-700 leading-relaxed">{product.description}</p>
                  <ul className="mt-4 space-y-2 text-gray-700">
                    <li>• Premium organic cotton construction</li>
                    <li>• Relaxed fit for ultimate comfort</li>
                    <li>• Reinforced seams for durability</li>
                    <li>• Pre-shrunk to maintain shape</li>
                    <li>• Minimalist design aesthetic</li>
                  </ul>
                </div>
              )}

              {activeTab === "materials" && (
                <div>
                  <h3 className="text-xl font-bold uppercase tracking-wide">Materials & Care</h3>
                  <div className="mt-4 grid grid-cols-1 gap-8 md:grid-cols-2">
                    <div>
                      <h4 className="font-semibold uppercase tracking-wide">Materials</h4>
                      <ul className="mt-2 space-y-1 text-gray-700">
                        {product.materials.map((material, i) => (
                          <li key={i}>• {material}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold uppercase tracking-wide">Care Instructions</h4>
                      <ul className="mt-2 space-y-1 text-gray-700">
                        {product.careInstructions.map((instruction, i) => (
                          <li key={i}>• {instruction}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "reviews" && (
                <div>
                  <div className="mb-8 flex items-center justify-between">
                    <h3 className="text-xl font-bold uppercase tracking-wide">Customer Reviews</h3>
                    <div className="flex items-center space-x-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < Math.floor(averageRating) ? "fill-black text-black" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-semibold">{averageRating.toFixed(1)}</span>
                      <span className="text-gray-600">({reviews.length} reviews)</span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-200 pb-6">
                        <div className="mb-2 flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold">{review.name}</span>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${i < review.rating ? "fill-black text-black" : "text-gray-300"}`}
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">{review.date}</span>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </ScrollReveal>

        {/* Related Products */}
        <ScrollReveal direction="up" delay={400}>
          <section className="mt-24">
            <h2 className="mb-8 text-center text-3xl font-black uppercase tracking-wider">You Might Also Like</h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {relatedProducts.map((relatedProduct, index) => (
                <ScrollReveal key={relatedProduct.id} direction="up" delay={index * 100}>
                  <Link href={`/product/${relatedProduct.id}`} className="group block">
                    <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-4">
                      <Image
                        src={relatedProduct.image || "/placeholder.svg"}
                        alt={relatedProduct.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                    <h3 className="mb-1 text-lg font-bold uppercase tracking-wide group-hover:text-gray-600 transition-colors">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-gray-600">${relatedProduct.price}</p>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </section>
        </ScrollReveal>
      </div>
    </div>
  )
}
