"use client";

import { SignUp } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import React from "react";

export default function SignupPage() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  return (
    <SignUp
      routing="path"
      path="/signup"
      afterSignUpUrl={redirect}
    />
  );
}
