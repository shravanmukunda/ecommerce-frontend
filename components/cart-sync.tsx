"use client"

import { useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { useApolloClient } from "@apollo/client/react"
import { GET_CART } from "@/graphql/cart"

/**
 * Component that syncs guest cart to user cart when user logs in
 * This ensures cart persistence across devices and accounts
 */
export function CartSync() {
  const { user, isLoaded } = useUser()
  const apolloClient = useApolloClient()

  useEffect(() => {
    // Only run after user state is loaded
    if (!isLoaded) return

    // Only run if user is authenticated
    if (!user?.id) return

    // Just refetch the cart when user logs in
    try {
      apolloClient.refetchQueries({
        include: [GET_CART],
      })
    } catch (error) {
      // Silently fail - cart will be fetched on next render
    }
  }, [user?.id, isLoaded, apolloClient])

  return null
}

