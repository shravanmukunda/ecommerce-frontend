"use client"

import { useStore } from "@/context/store-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function TestCartPage() {
  const { cartItems, addToCart, clearCart } = useStore()
  
  const testProduct = {
    id: 999,
    name: "Test Product",
    price: 29.99,
    image: "/placeholder.svg?height=400&width=300&text=Test+Product"
  }

  const handleAddToCart = () => {
    addToCart(testProduct, 1, "M", "Black")
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-black uppercase tracking-wider mb-8">Cart Test Page</h1>
      
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold mb-4">Cart Items: {cartItems.length}</h2>
          {cartItems.map((item, index) => (
            <div key={index} className="border-b py-4">
              <p>{item.name} - Size: {item.size} - Qty: {item.quantity}</p>
            </div>
          ))}
        </div>
        
        <div className="flex space-x-4">
          <Button onClick={handleAddToCart}>
            Add Test Product to Cart
          </Button>
          <Button variant="outline" onClick={clearCart}>
            Clear Cart
          </Button>
        </div>
        
        <div className="flex space-x-4">
          <Link href="/cart">
            <Button variant="outline">
              View Cart Page
            </Button>
          </Link>
          <Link href="/checkout">
            <Button variant="outline">
              Go to Checkout
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}