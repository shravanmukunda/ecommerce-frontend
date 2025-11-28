"use client"

import type { ReactNode } from "react"
import { ApolloProvider } from "@apollo/client/react"
import { client } from "@/lib/apolloClient"
import { StoreProvider } from "@/context/store-context"
import { AuthProvider } from "@/context/auth-context"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <StoreProvider>{children}</StoreProvider>
      </AuthProvider>
    </ApolloProvider>
  )
}
