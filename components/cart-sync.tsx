"use client"

import { useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { useCart } from "@/src/hooks/use-cart"

/**
 * Component that syncs guest cart to user cart when user logs in
 * This ensures cart persistence across devices and accounts
 */
export function CartSync() {
  const { user, isLoaded } = useUser()
  const { attachCartToUser, refetch } = useCart()

  useEffect(() => {
    if (!isLoaded) return

    // Only run if user is authenticated and we have a guest cart
    if (user?.id) {
      const guestCartId = typeof window !== "undefined" 
        ? localStorage.getItem("guest_cart_id") 
        : null

      if (guestCartId) {
        // Attach guest cart to user
        attachCartToUser(user.id)
          .then(() => {
            console.log("Guest cart attached to user successfully")
            // Refetch to get updated cart
            refetch()
          })
          .catch((error) => {
            console.error("Error attaching cart to user:", error)
          })
      } else {
        // If no guest cart, just refetch to get user's cart
        refetch()
      }
    }
  }, [user?.id, isLoaded, attachCartToUser, refetch])

  return null
}

