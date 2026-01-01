"use client"

import { useState, useEffect, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, X, ShoppingBag, ArrowRight, Trash2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollReveal } from "@/components/scroll-reveal"
import { useCart } from "@/src/hooks/use-cart"
import { useRouter } from "next/navigation"
import { useQuery } from "@apollo/client/react"
import { GET_PRODUCT } from "@/graphql/product-queries"
import { client as apolloClientInstance } from "@/lib/apolloClient"

export function CartPage() {
  const { cart, loading, addToCart, removeItem, clearCart, updateQuantity } = useCart()
  const router = useRouter()
  const [promoCode, setPromoCode] = useState("")
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set())
  const [productInventoryMap, setProductInventoryMap] = useState<Map<string, any>>(new Map())

  // Fetch product inventory data for all cart items
  useEffect(() => {
    if (!cart?.items || cart.items.length === 0) {
      setProductInventoryMap(new Map())
      return
    }

    const fetchInventoryData = async () => {
      const map = new Map<string, any>()
      
      try {
        const queries = cart.items.map((item: any) =>
          apolloClientInstance.query({
            query: GET_PRODUCT,
            variables: { id: item.productId },
            fetchPolicy: "cache-first",
          })
        )
        
        const results = await Promise.allSettled(queries)
        results.forEach((result, index) => {
          if (result.status === "fulfilled") {
            const value = result.value as any
            if (value?.data?.product) {
              const product = value.data.product
              const variant = product.variants?.find((v: any) => v.id === cart.items[index].variantId)
              map.set(cart.items[index].id, {
                availableQuantity: variant?.inventory?.availableQuantity ?? 0,
                variant,
              })
            }
          }
        })
      } catch (error) {
        console.error("Error fetching inventory data:", error)
      }
      
      setProductInventoryMap(map)
    }

    fetchInventoryData()
  }, [cart?.items])

  // Check if any cart items are out of stock
  const hasOutOfStockItems = useMemo(() => {
    if (!cart?.items) return false
    return cart.items.some((item: any) => {
      const inventory = productInventoryMap.get(item.id)
      if (!inventory) return false
      return inventory.availableQuantity < item.quantity
    })
  }, [cart?.items, productInventoryMap])

  // Get out of stock items for display
  const outOfStockItems = useMemo(() => {
    if (!cart?.items) return []
    return cart.items.filter((item: any) => {
      const inventory = productInventoryMap.get(item.id)
      if (!inventory) return false
      return inventory.availableQuantity < item.quantity
    })
  }, [cart?.items, productInventoryMap])

  // Handle loading state
  if (loading) {
    return (
      <div className="min-h-screen pt-20 bg-[#0f0f0f]">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center text-[#e5e5e5]">
            <p>Loading cart...</p>
          </div>
        </div>
      </div>
    )
  }

  const cartItems = cart?.items || []
  
  const subtotal = cartItems.reduce((sum: number, item: any) => sum + item.unitPrice * item.quantity, 0)
  const shipping = subtotal > 100 ? 0 : 15
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  const handleCheckout = () => {
    if (hasOutOfStockItems) {
      alert("Some items in your cart are out of stock. Please remove them or adjust quantities before proceeding to checkout.")
      return
    }
    router.push("/checkout")
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen pt-20 bg-[#0f0f0f]">
        <div className="container mx-auto px-4 py-16">
          <ScrollReveal direction="up">
            <div className="text-center max-w-md mx-auto">
              <div className="mb-8 flex justify-center">
                <div className="relative">
                  <ShoppingBag className="h-32 w-32 text-[#1a1a1a]" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-20 w-20 rounded-full bg-gradient-to-br from-[#00bfff]/20 to-[#0099ff]/20 flex items-center justify-center">
                      <ShoppingBag className="h-10 w-10 text-[#00bfff]" />
                    </div>
                  </div>
                </div>
              </div>
              <h1 className="mb-4 text-3xl md:text-4xl font-black uppercase tracking-wider text-[#e5e5e5]">
                Your Cart is Empty
              </h1>
              <p className="mb-8 text-lg text-[#999]">
                Discover our latest collection and add some items to your cart.
              </p>
              <Link href="/shop">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-[#00bfff] to-[#0099ff] text-white px-8 py-6 text-lg font-bold uppercase tracking-wide hover:from-[#0099ff] hover:to-[#00bfff] hover:shadow-[0_0_30px_rgba(0,191,255,0.5)] transition-all duration-300 border-0"
                >
                  Continue Shopping
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 bg-[#0f0f0f]">
      {/* Header */}
      <section className="bg-gradient-to-br from-[#0f0f0f] via-[#121212] to-[#0a0a0a] py-12 border-b border-[#1a1a1a]">
        <div className="container mx-auto px-4">
          <ScrollReveal direction="up">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight text-[#e5e5e5] mb-2">
              Shopping Cart
            </h1>
            <p className="text-[#999] text-lg">
              {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in your cart
            </p>
          </ScrollReveal>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Out of Stock Warning */}
            {hasOutOfStockItems && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-red-400 font-semibold mb-1">Some items are out of stock</h3>
                    <p className="text-red-300 text-sm">
                      Please remove out-of-stock items or adjust quantities before proceeding to checkout.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {cartItems.map((item: any, index: number) => {
              const productName = item.product?.name || `Product #${item.productId}`
              const productImage = item.product?.designImageURL || "/placeholder.svg"
              const variantSize = item.variant?.size || "N/A"
              const variantColor = item.variant?.color || null
              const inventory = productInventoryMap.get(item.id)
              const isOutOfStock = inventory && inventory.availableQuantity < item.quantity
              const availableQty = inventory?.availableQuantity ?? null
              
              return (
                <ScrollReveal key={item.id} direction="up" delay={index * 100}>
                  <div className={`bg-[#121212] border rounded-xl p-6 transition-all duration-300 ${
                    isOutOfStock 
                      ? "border-red-500/50 bg-red-500/5" 
                      : "border-[#1a1a1a] hover:border-[#1a1a1a]/80"
                  }`}>
                    {isOutOfStock && (
                      <div className="mb-4 flex items-center gap-2 text-red-400 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        <span>Only {availableQty} available in stock</span>
                      </div>
                    )}
                    <div className="flex flex-col sm:flex-row gap-6">
                      {/* Product Image */}
                      <Link href={`/product/${item.productId}`} className="flex-shrink-0">
                        <div className="relative h-32 w-32 sm:h-40 sm:w-40 rounded-lg overflow-hidden bg-[#0f0f0f] group">
                          <Image
                            src={productImage}
                            alt={productName}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="160px"
                          />
                        </div>
                      </Link>

                      {/* Product Details */}
                      <div className="flex-1 flex flex-col sm:flex-row sm:justify-between gap-4">
                        <div className="flex-1">
                          <Link href={`/product/${item.productId}`}>
                            <h3 className="text-lg font-bold uppercase tracking-wide text-[#e5e5e5] hover:text-[#00bfff] transition-colors mb-2">
                              {productName}
                            </h3>
                          </Link>
                          <div className="space-y-1 text-sm text-[#999] mb-4">
                            {variantSize !== "N/A" && (
                              <p>Size: <span className="text-[#e5e5e5]">{variantSize}</span></p>
                            )}
                            {variantColor && (
                              <p>Color: <span className="text-[#e5e5e5]">{variantColor}</span></p>
                            )}
                          </div>
                          <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00bfff] to-[#0099ff]">
                            ₹{item.unitPrice.toFixed(2)}
                          </p>
                        </div>

                        {/* Quantity Controls & Actions */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                          {/* Quantity Selector */}
                          <div className="flex items-center gap-3 bg-[#0f0f0f] border border-[#1a1a1a] rounded-lg p-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={async () => {
                                if (cart?.id && !updatingItems.has(item.id)) {
                                  setUpdatingItems(prev => new Set(prev).add(item.id))
                                  try {
                                    const newQuantity = item.quantity - 1
                                    if (newQuantity === 0) {
                                      await removeItem(item.id, cart.id)
                                    } else {
                                      await updateQuantity(item.id, cart.id, newQuantity, item.productId, item.variantId || "")
                                    }
                                  } catch (error) {
                                    console.error("Error decreasing quantity:", error)
                                    alert("Failed to update quantity. Please try again.")
                                  } finally {
                                    setUpdatingItems(prev => {
                                      const next = new Set(prev)
                                      next.delete(item.id)
                                      return next
                                    })
                                  }
                                }
                              }}
                              className="h-8 w-8 text-[#e5e5e5] hover:text-[#00bfff] hover:bg-[#1a1a1a] disabled:opacity-50"
                              disabled={updatingItems.has(item.id)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center font-semibold text-[#e5e5e5]">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={async () => {
                                if (cart?.id && !updatingItems.has(item.id)) {
                                  setUpdatingItems(prev => new Set(prev).add(item.id))
                                  try {
                                    await addToCart(item.productId, item.variantId || "", 1)
                                  } catch (error) {
                                    console.error("Error increasing quantity:", error)
                                    alert("Failed to update quantity. Please try again.")
                                  } finally {
                                    setUpdatingItems(prev => {
                                      const next = new Set(prev)
                                      next.delete(item.id)
                                      return next
                                    })
                                  }
                                }
                              }}
                              className="h-8 w-8 text-[#e5e5e5] hover:text-[#00bfff] hover:bg-[#1a1a1a] disabled:opacity-50"
                              disabled={updatingItems.has(item.id)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* Item Total & Remove */}
                          <div className="flex flex-col items-end sm:items-center gap-2">
                            <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00bfff] to-[#0099ff]">
                              ₹{(item.unitPrice * item.quantity).toFixed(2)}
                            </p>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={async () => {
                                if (cart?.id && !updatingItems.has(item.id)) {
                                  setUpdatingItems(prev => new Set(prev).add(item.id))
                                  try {
                                    await removeItem(item.id, cart.id)
                                  } catch (error) {
                                    console.error("Error removing item:", error)
                                    alert("Failed to remove item. Please try again.")
                                  } finally {
                                    setUpdatingItems(prev => {
                                      const next = new Set(prev)
                                      next.delete(item.id)
                                      return next
                                    })
                                  }
                                }
                              }}
                              className="h-8 w-8 text-[#666] hover:text-red-400 hover:bg-red-400/10 disabled:opacity-50"
                              disabled={updatingItems.has(item.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              )
            })}

            {/* Continue Shopping & Clear Cart */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
              <Link href="/shop">
                <Button
                  variant="outline"
                  className="border-[#1a1a1a] text-[#e5e5e5] hover:border-[#00bfff]/50 hover:text-[#00bfff] hover:bg-[#00bfff]/10 bg-transparent"
                >
                  <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
                  Continue Shopping
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => cart?.id && clearCart(cart.id)}
                className="border-red-400/50 text-red-400 hover:bg-red-400/10 hover:border-red-400 bg-transparent"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Clear Cart
              </Button>
            </div>
          </div>

          {/* Order Summary - Sticky Panel */}
          <div className="lg:col-span-1">
            <ScrollReveal direction="right">
              <div className="sticky top-24 bg-[#121212] border border-[#1a1a1a] rounded-xl p-6 backdrop-blur-xl">
                <h2 className="mb-6 text-xl font-bold uppercase tracking-wide text-[#e5e5e5]">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-[#999]">
                    <span>Subtotal</span>
                    <span className="text-[#e5e5e5]">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[#999]">
                    <span>Shipping</span>
                    <span className="text-[#e5e5e5]">
                      {shipping === 0 ? (
                        <span className="text-[#00bfff]">Free</span>
                      ) : (
                        `₹${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#999]">
                    <span>Tax</span>
                    <span className="text-[#e5e5e5]">₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-[#1a1a1a] pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-[#e5e5e5]">Total</span>
                      <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00bfff] to-[#0099ff]">
                        ₹{total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Promo Code */}
                <div className="mb-6">
                  <label htmlFor="promoCode" className="mb-2 block text-sm font-semibold uppercase tracking-wide text-[#999]">
                    Promo Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="promoCode"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter code"
                      className="flex-1 bg-[#0f0f0f] border border-[#1a1a1a] text-[#e5e5e5] placeholder:text-[#666] px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00bfff] focus:border-[#00bfff]"
                    />
                    <Button className="bg-[#1a1a1a] border border-[#1a1a1a] text-[#e5e5e5] hover:bg-[#00bfff] hover:text-white hover:border-[#00bfff] transition-all duration-300">
                      Apply
                    </Button>
                  </div>
                </div>

                {/* Checkout Button */}
                <Button
                  onClick={handleCheckout}
                  disabled={isCheckingOut || cartItems.length === 0 || hasOutOfStockItems}
                  size="lg"
                  className="w-full bg-gradient-to-r from-[#00bfff] to-[#0099ff] text-white py-6 text-lg font-bold uppercase tracking-wide hover:from-[#0099ff] hover:to-[#00bfff] hover:shadow-[0_0_30px_rgba(0,191,255,0.6)] transition-all duration-300 border-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCheckingOut ? "Processing..." : hasOutOfStockItems ? "Cannot Checkout - Out of Stock Items" : "Proceed to Checkout"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>

                {/* Security Info */}
                <div className="mt-6 text-center text-xs text-[#666] space-y-1">
                  <p>🔒 Secure SSL encrypted checkout</p>
                  {subtotal < 100 && (
                    <p className="text-[#00bfff]">Free shipping on orders over ₹100</p>
                  )}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </div>
  )
}