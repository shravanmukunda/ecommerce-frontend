"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardSidebar } from "./dashboard-sidebar"
import { Footer } from "@/components/footer"
import { useAuth } from "@/context/auth-context"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login") // Redirect to login if not authenticated
    }
  }, [user, router])

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-lg font-semibold uppercase tracking-wide">Loading dashboard...</p>
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
