"use client";

import { ReactNode, useEffect } from "react";
import { ApolloProvider } from "@apollo/client/react";
import { ClerkProvider, useSession } from "@clerk/nextjs";
import {
  createApolloClient,
  setGetCurrentToken,
} from "@/lib/apolloClient";

const client = createApolloClient();

/**
 * This component bridges Clerk → Apollo
 * so Apollo can send Authorization headers
 */
function ApolloAuthBridge({ children }: { children: ReactNode }) {
  const { session } = useSession();

  useEffect(() => {
    setGetCurrentToken(async () => {
      // ✅ IMPORTANT: NO template
      return await session?.getToken() ?? null;
    });
  }, [session]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <ApolloAuthBridge>{children}</ApolloAuthBridge>
    </ClerkProvider>
  );
}
