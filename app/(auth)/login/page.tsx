"use client"

import type React from "react"

import { Login } from "@/components/login"
  
export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-12">
      <div className="w-full max-w-md">
        <Login />
      </div>
    </div>
  )
}

