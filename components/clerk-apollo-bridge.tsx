"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { setGetCurrentToken } from "@/lib/apolloClient";

export default function ClerkApolloBridge() {
  const { isLoaded, getToken } = useAuth();

  useEffect(() => {
    if (!isLoaded) return;

    setGetCurrentToken(async () => {
      const token = await getToken();
      return token || null;
    });

  }, [isLoaded, getToken]);

  return null;
}
