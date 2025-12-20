"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ScrollReveal } from "@/components/scroll-reveal"
import { ChevronLeft, ChevronRight, Truck, Shield, Ruler, Share2 } from "lucide-react"
import { useCart } from "@/src/hooks/use-cart"
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

export function ProductDetail({ productData }: { productData: any }) {
  const [currentImage, setCurrentImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const router = useRouter()
  const { addToCart } = useCart()

  // Extract available sizes from product variants
  // Only show sizes that were added by admin in the dashboard
  const availableSizes = useMemo(() => {
    if (!productData?.variants || productData.variants.length === 0) {
      return []
    }
    
    // Get unique sizes from variants
    const uniqueSizes = [...new Set(productData.variants.map((v: any) => v.size).filter(Boolean))] as string[]
    
    // Sort sizes in a logical order (XS, S, M, L, XL, XXL, XXXL)
    const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']
    return uniqueSizes.sort((a: string, b: string) => {
      const indexA = sizeOrder.indexOf(a)
      const indexB = sizeOrder.indexOf(b)
      // If size not in order list, put it at the end
      if (indexA === -1 && indexB === -1) return a.localeCompare(b)
      if (indexA === -1) return 1
      if (indexB === -1) return -1
      return indexA - indexB
    })
  }, [productData?.variants])

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % productData.images.length)
  }

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + productData.images.length) % productData.images.length)
  }

  const { isSignedIn } = useAuth();
  
  const handleAddToCart = async () => {
    if (!isSignedIn) {
      router.push(`/login?redirect=/product/${productData.id}`);
      return;
    }
  
    if (!selectedSize) {
      alert("Please select a size first.");
      return;
    }
  
    const matchingVariant = productData.variants?.find(
      (v: any) => v.size === selectedSize
    );
  
    if (!matchingVariant) {
      alert("Selected size is not available.");
      return;
    }
  
    setIsAddingToCart(true);
  
    try {
      await addToCart(
        String(productData.id),
        String(matchingVariant.id),
        quantity
      );
  
      alert("Added to cart!");
    } finally {
      setIsAddingToCart(false);
    }
  };
  
  

  return (
    <div className="min-h-screen pt-16 lg:pt-20 bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Breadcrumb */}
      <ScrollReveal direction="up">
        <div className="border-b border-[#000000] py-4">
          <div className="container mx-auto px-4">
            <nav className="flex items-center space-x-2 text-sm">
              <Link href="/" className="text-[#666] hover:text-[#e5e5e5] transition-colors">
                Home
              </Link>
              <span className="text-[#000]">/</span>
              <Link href="/shop" className="text-[#666] hover:text-[#e5e5e5] transition-colors">
                Shop
              </Link>
              <span className="text-[#333]">/</span>
              <span className="text-[#e5e5e5]">{productData.name}</span>
            </nav>
          </div>
        </div>
      </ScrollReveal>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Image Gallery */}
          <ScrollReveal direction="left">
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-[3/4] overflow-hidden bg-[#1a1a1a]">
                <Image
                  src={productData.images[currentImage] || "/placeholder.svg"}
                  alt={`${productData.name} - View ${currentImage + 1}`}
                  fill
                  className="object-cover"
                  priority={currentImage === 0}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                />

                {/* Navigation Arrows */}
                {productData.images.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-[#1a1a1a]/80 text-[#e5e5e5] hover:bg-[#1a1a1a] border border-[#333] transition-all duration-300"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#1a1a1a]/80 text-[#e5e5e5] hover:bg-[#1a1a1a] border border-[#333] transition-all duration-300"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </>
                )}

                {/* Image Indicators */}
                {productData.images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 space-x-2">
                    {productData.images.map((_: any, index: number) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImage(index)}
                        aria-label={`View image ${index + 1}`}
                        className={`h-1 w-8 transition-all duration-300 ${
                          index === currentImage ? "bg-[#e5e5e5]" : "bg-[#666] hover:bg-[#999]"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {productData.images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto">
                  {productData.images.map((image: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImage(index)}
                      aria-label={`Select thumbnail ${index + 1}`}
                      className={`relative h-20 w-16 flex-shrink-0 overflow-hidden transition-all duration-300 ${
                        currentImage === index ? "ring-1 ring-[#e5e5e5]" : "opacity-60 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`Product thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </ScrollReveal>

          {/* Product Info */}
          <ScrollReveal direction="right">
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-light uppercase tracking-wider md:text-4xl text-[#e5e5e5] mb-4">{productData.name}</h1>
                <p className="text-2xl font-light text-[#e5e5e5]">${productData.price}</p>
              </div>

              <div className="border-t border-[#1a1a1a] pt-6">
                <p className="text-[#999] leading-relaxed text-sm">{productData.description}</p>
              </div>

              {/* Size Selection */}
              <div className="border-t border-[#1a1a1a] pt-6">
                <h3 className="mb-4 text-xs font-light uppercase tracking-widest text-[#999]">Size</h3>
                {availableSizes.length > 0 ? (
                  <>
                    <div className="flex flex-wrap gap-2">
                      {availableSizes.map((size) => (
                        <Button
                          key={size}
                          variant="outline"
                          onClick={() => setSelectedSize(size)}
                          className={`h-12 w-12 transition-all duration-300 border border-[#333] ${
                            selectedSize === size
                              ? "bg-[#e5e5e5] text-[#0f0f0f] border-[#e5e5e5]"
                              : "bg-transparent text-[#999] hover:text-[#e5e5e5] hover:border-[#666]"
                          }`}
                        >
                          {size}
                        </Button>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-[#666] text-sm">No sizes available for this product.</p>
                )}
              </div>

              {/* Quantity */}
              <div className="border-t border-[#1a1a1a] pt-6">
                <h3 className="mb-4 text-xs font-light uppercase tracking-widest text-[#999]">Quantity</h3>
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="border border-[#333] text-[#e5e5e5] hover:bg-[#1a1a1a] hover:border-[#666] transition-all duration-300 bg-transparent"
                    aria-label="Decrease quantity"
                  >
                    -
                  </Button>
                  <span className="text-lg font-light w-8 text-center text-[#e5e5e5]">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    className="border border-[#333] text-[#e5e5e5] hover:bg-[#1a1a1a] hover:border-[#666] transition-all duration-300 bg-transparent"
                    aria-label="Increase quantity"
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3 border-t border-[#1a1a1a] pt-6">
                <Button
                  onClick={handleAddToCart}
                  disabled={!selectedSize || isAddingToCart}
                  size="lg"
                  className="w-full bg-[#e5e5e5] py-6 text-sm font-light uppercase tracking-widest text-[#0f0f0f] hover:bg-[#ccc] transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed border-0"
                >
                  {isAddingToCart ? "Adding..." : "Add to Cart"}
                </Button>
                <Link href="/checkout">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full border border-[#333] py-6 text-sm font-light uppercase tracking-widest text-[#e5e5e5] hover:bg-[#1a1a1a] hover:border-[#666] transition-all duration-300 bg-transparent"
                    disabled={!selectedSize}
                  >
                    Buy Now
                  </Button>
                </Link>
                <div className="flex justify-center pt-2">
                  <Button
                    variant="ghost"
                    className="text-[#666] hover:text-[#999] transition-colors"
                    aria-label="Share product"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Product Features */}
              <div className="space-y-4 border-t border-[#1a1a1a] pt-6">
                <div className="flex items-center space-x-3">
                  <Truck className="h-4 w-4 text-[#666]" />
                  <span className="text-xs text-[#666]">Free shipping on orders over $100</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="h-4 w-4 text-[#666]" />
                  <span className="text-xs text-[#666]">30-day return guarantee</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Ruler className="h-4 w-4 text-[#666]" />
                  <span className="text-xs text-[#666]">Size guide available</span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  )
}