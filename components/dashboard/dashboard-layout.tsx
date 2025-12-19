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
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black">
        <p className="text-lg font-semibold uppercase tracking-wide text-white">Loading dashboard...</p>
      </div>
    )
  }

  if (isLoaded && !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="text-center">
          <p className="text-lg font-semibold uppercase tracking-wide mb-4 text-white">You need to be signed in to access the dashboard</p>
          <SignInButton mode="modal">
            <button className="bg-gradient-to-r from-[#00bfff] to-[#0099ff] text-white px-4 py-2 rounded hover:from-[#0099ff] hover:to-[#00bfff] hover:shadow-[0_0_20px_rgba(0,191,255,0.5)] transition-all duration-300">
              Sign In
            </button>
          </SignInButton>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-black via-gray-900 to-black">
      {/* <Header /> removed to prevent duplicate header */}
      <div className="flex flex-1 flex-col lg:flex-row">
        <DashboardSidebar />
        <main className="flex-1 p-4 lg:p-8 bg-gradient-to-b from-black via-gray-900 to-black">
          <div className="bg-[#0f0f0f]/50 backdrop-blur-sm border border-[#1a1a1a] p-6 md:p-8 rounded-lg shadow-lg min-h-[calc(100vh-120px)] lg:min-h-[calc(100vh-64px)]">
            {children}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}