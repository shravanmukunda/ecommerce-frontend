"use client";

import React from "react";
import { SignIn } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  return (
    <SignIn
      routing="path"
      path="/login"
      afterSignInUrl={redirect}
    />
  );
} 