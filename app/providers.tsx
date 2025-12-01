"use client"

import type { ReactNode } from "react"
import { ApolloProvider } from "@apollo/client/react"
import { client } from "@/lib/apolloClient"
import { AuthProvider } from "@/context/auth-context"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ApolloProvider>
  )
}