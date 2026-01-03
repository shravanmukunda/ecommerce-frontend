"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!isLoaded) return

    // Check if user is authenticated
    if (!user) {
      router.push("/login")
      return
    }

    // Check for admin role in user's public metadata
    const userRole = user.publicMetadata?.role as string | undefined

    // If user doesn't have admin role, redirect to home
    if (userRole !== "admin") {
      router.push("/")
      return
    }
  }, [user, isLoaded, router])

  // Show loading state while checking authentication
  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    )
  }

  // Show unauthorized message if user is not admin
  if (user && (user.publicMetadata?.role as string | undefined) !== "admin") {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="container mx-auto p-4 lg:p-8">
          <div className="flex min-h-[calc(100vh-120px)] items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
              <p className="text-gray-600">You do not have permission to access this page.</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto p-4 lg:p-8">
        <div className="admin-dashboard bg-white p-6 md:p-8 rounded-lg shadow-md min-h-[calc(100vh-120px)]">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  )
}