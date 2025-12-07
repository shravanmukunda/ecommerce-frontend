"use client";

import { ReactNode } from "react";
import { ApolloProvider } from "@apollo/client/react";
import { createApolloClient } from "@/lib/apolloClient";

const client = createApolloClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ApolloProvider client={client}>
      {children}
    </ApolloProvider>
  );
}
