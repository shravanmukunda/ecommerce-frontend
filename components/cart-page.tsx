"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, X, ShoppingBag, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollReveal } from "@/components/scroll-reveal"
import { useCart } from "@/src/hooks/use-cart" // Import useCart instead of useStore

export function CartPage() {
  const { cart, loading, addToCart, removeItem, clearCart, updateQuantity } = useCart() // Use cart items and actions from GraphQL cart
  const [promoCode, setPromoCode] = useState("")
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set())

  // Handle loading state
  if (loading) {
    return (
      <div className="min-h-screen pt-16 lg:pt-20">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <p>Loading cart...</p>
          </div>
        </div>
      </div>
    )
  }

  const cartItems = cart?.items || []
  
  const subtotal = cartItems.reduce((sum: number, item: any) => sum + item.unitPrice * item.quantity, 0)
  const shipping = subtotal > 100 ? 0 : 15 // Example: Free shipping over $100
  const tax = subtotal * 0.08 // Example: 8% tax
  const total = subtotal + shipping + tax

  const handleCheckout = async () => {
    setIsCheckingOut(true)
    // Simulate checkout process
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsCheckingOut(false)
    if (cart?.id) {
      clearCart(cart.id) // Clear cart after successful checkout simulation
    }
    alert("Redirecting to secure checkout! Your cart has been cleared.")
    // In a real app, redirect to payment processor or confirmation page
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen pt-16 lg:pt-20">
        <div className="container mx-auto px-4 py-16">
          <ScrollReveal direction="up">
            <div className="text-center">
              <ShoppingBag className="mx-auto mb-8 h-24 w-24 text-gray-400" />
              <h1 className="mb-4 text-3xl font-black uppercase tracking-wider">Your Cart is Empty</h1>
              <p className="mb-8 text-lg text-gray-600">
                Discover our latest collection and add some items to your cart.
              </p>
              <Link href="/shop">
                <Button
                  size="lg"
                  className="bg-black px-8 py-4 text-lg font-bold uppercase tracking-wide text-white hover:bg-gray-800 hover:scale-105 transition-all duration-300"
                >
                  Continue Shopping
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
            <h1 className="mb-4 text-4xl font-black uppercase tracking-wider md:text-6xl lg:text-8xl">Shopping Cart</h1>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={200}>
            <p className="text-lg uppercase tracking-wide md:text-xl">Review your selected items</p>
          </ScrollReveal>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <ScrollReveal direction="left">
              <h2 className="mb-8 text-2xl font-black uppercase tracking-wider">Cart Items ({cartItems.length})</h2>
            </ScrollReveal>

            <div className="space-y-6">
              {cartItems.map((item: any, index: number) => (
                <ScrollReveal key={item.id} direction="up" delay={index * 100}>
                  <div className="flex items-center space-x-4 border-b border-gray-200 pb-6">
                    <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden">
                      <Image
                        src="/placeholder.svg" // Placeholder since we don't have image data in cart items
                        alt={`Product ${item.productId}`}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="mb-1 text-lg font-bold uppercase tracking-wide">Product #{item.productId}</h3>
                      <p className="mb-2 text-sm text-gray-600">
                        Variant: {item.variantId} | Quantity: {item.quantity}
                      </p>
                      <p className="text-lg font-semibold">${item.unitPrice}</p>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={async () => {
                          if (cart?.id && !updatingItems.has(item.id)) {
                            setUpdatingItems(prev => new Set(prev).add(item.id))
                            try {
                              const newQuantity = item.quantity - 1
                              if (newQuantity === 0) {
                                // Remove item if quantity becomes 0
                                await removeItem(item.id, cart.id)
                              } else {
                                // Update quantity to decreased value
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
                        className="h-8 w-8 border-black text-black hover:bg-black hover:text-white"
                        aria-label={`Decrease quantity of product ${item.productId}`}
                        disabled={updatingItems.has(item.id)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={async () => {
                          if (cart?.id && !updatingItems.has(item.id)) {
                            setUpdatingItems(prev => new Set(prev).add(item.id))
                            try {
                              // Use addToCart with quantity 1 - backend will increment existing item
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
                        className="h-8 w-8 border-black text-black hover:bg-black hover:text-white"
                        aria-label={`Increase quantity of product ${item.productId}`}
                        disabled={updatingItems.has(item.id)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="text-right">
                      <p className="mb-2 text-lg font-bold">${(item.unitPrice * item.quantity).toFixed(2)}</p>
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
                        className="text-red-500 hover:bg-red-50 hover:text-red-700"
                        aria-label={`Remove product ${item.productId} from cart`}
                        disabled={updatingItems.has(item.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal direction="up" delay={300}>
              <div className="mt-8 flex justify-between items-center">
                <Link href="/shop">
                  <Button
                    variant="outline"
                    className="border-black text-black hover:bg-black hover:text-white hover:scale-105 transition-all duration-300 bg-transparent"
                  >
                    <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
                    Continue Shopping
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={() => cart?.id && clearCart(cart.id)}
                  className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-700 transition-all duration-300 bg-transparent"
                >
                  Clear Cart
                </Button>
              </div>
            </ScrollReveal>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <ScrollReveal direction="right">
              <div className="sticky top-24 bg-gray-50 p-8">
                <h2 className="mb-6 text-2xl font-black uppercase tracking-wider">Order Summary</h2>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-300 pt-4">
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Promo Code */}
                <div className="mt-6">
                  <label htmlFor="promoCode" className="mb-2 block text-sm font-semibold uppercase tracking-wide">
                    Promo Code
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      id="promoCode"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter code"
                      className="flex-1 border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                    />
                    <Button className="bg-black text-white hover:bg-gray-800">Apply</Button>
                  </div>
                </div>

                {/* Checkout Button */}
                <Link href="/checkout">
                  <Button
                    disabled={isCheckingOut || cartItems.length === 0}
                    size="lg"
                    className="mt-8 w-full bg-black py-4 text-lg font-bold uppercase tracking-wide text-white hover:bg-gray-800 hover:scale-105 transition-all duration-300"
                  >
                    {isCheckingOut ? "Processing..." : "Order Now"}
                  </Button>
                </Link>

                {/* Secure Checkout Button */}
                <Button
                  onClick={handleCheckout}
                  disabled={isCheckingOut || cartItems.length === 0}
                  variant="outline"
                  size="lg"
                  className="mt-4 w-full border-black py-4 text-lg font-bold uppercase tracking-wide text-black hover:bg-black hover:text-white transition-all duration-300 bg-transparent"
                >
                  {isCheckingOut ? "Processing..." : "Secure Checkout"}
                </Button>

                {/* Security Info */}
                <div className="mt-4 text-center text-xs text-gray-500">
                  <p>🔒 Secure SSL encrypted checkout</p>
                  <p>Free shipping on orders over $100</p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </div>
  )
}