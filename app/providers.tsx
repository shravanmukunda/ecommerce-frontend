"use client"

import type { ReactNode } from "react"
import { ApolloProvider } from "@apollo/client/react"
import { createApolloClient, setGetCurrentToken } from "@/lib/apolloClient"
import { useAuth } from "@clerk/nextjs"
import { useEffect, useState } from "react"

export function Providers({ children }: { children: ReactNode }) {
  const { isLoaded, getToken } = useAuth()
  const [client, setClient] = useState<ReturnType<typeof createApolloClient> | null>(null)

  useEffect(() => {
    if (isLoaded) {
      // Set up the function that Apollo Client will use to get the current token
      const apolloClient = createApolloClient();
      setClient(apolloClient);
      
      // Set the token getter function
      setGetCurrentToken(async () => {
        try {
          const token = await getToken();
          return token || null;
        } catch (error) {
          console.error("Error getting Clerk token:", error);
          return null;
        }
      });
    }
  }, [isLoaded, getToken])

  // Don't render children until the client is ready
  if (!client) {
    return <div>Loading...</div>;
  }

  return (
    <ApolloProvider client={client}>
      {children}
    </ApolloProvider>
  )
}