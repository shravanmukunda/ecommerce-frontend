"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface Product {
  id: number
  name: string
  description?: string
  price: number
  image: string
  hoverImage?: string
  images?: string[]
  size?: string
  color?: string
  sizes?: { 
    name: string; 
    quantity: number 
  }[]
  shippingPrice?: number
  category?: string
  materials?: string[]
  careInstructions?: string[]
}

export interface CartItem extends Product {
  quantity: number
}

interface StoreContextType {
  cartItems: CartItem[]
  addToCart: (product: Product, quantity?: number, size?: string, color?: string) => void
  removeFromCart: (productId: number) => void
  updateCartQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
}

const StoreContext = createContext<StoreContextType | undefined>(undefined)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem("blvck_cart")
      if (storedCart) {
        setCartItems(JSON.parse(storedCart))
      }
    } catch (error) {
      console.error("Failed to load store from localStorage", error)
    }
  }, [])

  // Save to localStorage whenever cartItems change
  useEffect(() => {
    localStorage.setItem("blvck_cart", JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = (product: Product, quantity = 1, size?: string, color?: string) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.id === product.id && item.size === size && item.color === color,
      )
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id && item.size === size && item.color === color
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        )
      } else {
        return [...prevItems, { ...product, quantity, size, color }]
      }
    })
  }

  const removeFromCart = (productId: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId))
  }

  const updateCartQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
    } else {
      setCartItems((prevItems) => prevItems.map((item) => (item.id === productId ? { ...item, quantity } : item)))
    }
  }

  const clearCart = () => setCartItems([])

  return (
    <StoreContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context = useContext(StoreContext)
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider")
  }
  return context
}
