"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface Product {
  id: number
  name: string
  price: number
  image: string
  hoverImage?: string
  images?: string[]
  size?: string
  color?: string
}

export interface CartItem extends Product {
  quantity: number
}

export interface WishlistItem extends Product {
  inStock?: boolean
}

interface StoreContextType {
  cartItems: CartItem[]
  wishlistItems: WishlistItem[]
  addToCart: (product: Product, quantity?: number, size?: string, color?: string) => void
  removeFromCart: (productId: number) => void
  updateCartQuantity: (productId: number, quantity: number) => void
  addToWishlist: (product: Product) => void
  removeFromWishlist: (productId: number) => void
  clearCart: () => void
  clearWishlist: () => void
}

const StoreContext = createContext<StoreContextType | undefined>(undefined)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem("blvck_cart")
      if (storedCart) {
        setCartItems(JSON.parse(storedCart))
      }
      const storedWishlist = localStorage.getItem("blvck_wishlist")
      if (storedWishlist) {
        setWishlistItems(JSON.parse(storedWishlist))
      }
    } catch (error) {
      console.error("Failed to load store from localStorage", error)
    }
  }, [])

  // Save to localStorage whenever cartItems or wishlistItems change
  useEffect(() => {
    localStorage.setItem("blvck_cart", JSON.stringify(cartItems))
  }, [cartItems])

  useEffect(() => {
    localStorage.setItem("blvck_wishlist", JSON.stringify(wishlistItems))
  }, [wishlistItems])

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

  const addToWishlist = (product: Product) => {
    setWishlistItems((prevItems) => {
      if (!prevItems.find((item) => item.id === product.id)) {
        return [...prevItems, product]
      }
      return prevItems
    })
  }

  const removeFromWishlist = (productId: number) => {
    setWishlistItems((prevItems) => prevItems.filter((item) => item.id !== productId))
  }

  const clearCart = () => setCartItems([])
  const clearWishlist = () => setWishlistItems([])

  return (
    <StoreContext.Provider
      value={{
        cartItems,
        wishlistItems,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        addToWishlist,
        removeFromWishlist,
        clearCart,
        clearWishlist,
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
