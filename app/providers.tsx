"use client";

import { ReactNode, useEffect } from "react";
import { ApolloProvider } from "@apollo/client/react";
import { ClerkProvider, useSession } from "@clerk/nextjs";
import {
  createApolloClient,
  setGetCurrentToken,
} from "@/lib/apolloClient";
import { PromoProvider } from "@/hooks/use-promo";

// Create client once at module level
const client = createApolloClient();

/**
 * This component bridges Clerk → Apollo
 * so Apollo can send Authorization headers
 */
function ApolloAuthBridge({ children }: { children: ReactNode }) {
  const { session, isLoaded } = useSession();

  useEffect(() => {
    if (!isLoaded) return;
    
    // Set the token getter function whenever session changes
    setGetCurrentToken(async () => {
      return await session?.getToken() ?? null;
    });
  }, [session, isLoaded]);

  // Provide Apollo context even if session isn't loaded yet
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <ApolloAuthBridge>
        <PromoProvider>{children}</PromoProvider>
      </ApolloAuthBridge>
    </ClerkProvider>
  );
}
