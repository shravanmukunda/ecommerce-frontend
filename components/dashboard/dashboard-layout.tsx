"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardSidebar } from "./dashboard-sidebar"
import { Footer } from "@/components/footer"
import { useUser } from "@clerk/nextjs"
import { SignInButton } from "@clerk/nextjs"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, isLoaded } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && !user) {
      // Redirect to sign-in if not authenticated
      router.push("/login")
    }
  }, [user, isLoaded, router])

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-lg font-semibold uppercase tracking-wide">Loading dashboard...</p>
      </div>
    )
  }

  if (isLoaded && !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-lg font-semibold uppercase tracking-wide mb-4">You need to be signed in to access the dashboard</p>
          <SignInButton mode="modal">
            <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
              Sign In
            </button>
          </SignInButton>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* <Header /> removed to prevent duplicate header */}
      <div className="flex flex-1 flex-col lg:flex-row">
        <DashboardSidebar />
        <main className="flex-1 p-4 lg:p-8 bg-white">
          <div className="bg-white p-6 md:p-8 rounded-lg shadow-md min-h-[calc(100vh-120px)] lg:min-h-[calc(100vh-64px)]">
            {children}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}