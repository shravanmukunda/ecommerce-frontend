"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)

  useEffect(() => {
    if (!isLoaded) {
      setIsAuthorized(null)
      return
    }

    // Check if user is authenticated
    if (!user) {
      console.log("❌ No user - redirecting to login")
      setIsAuthorized(false)
      router.replace("/login")
      return
    }

    console.log("✅ User authenticated:", user.primaryEmailAddress?.emailAddress)
    console.log("📧 Email:", user.primaryEmailAddress?.emailAddress)
    console.log("🎭 Public metadata:", user.publicMetadata)

    // ✅ ALLOW ALL AUTHENTICATED USERS FOR NOW
    setIsAuthorized(true)
  }, [user, isLoaded, router])

  // Show loading state while checking authentication
  if (!isLoaded || isAuthorized === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    )
  }

  // Show unauthorized message if user is not authenticated
  if (!isAuthorized || !user) {
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
