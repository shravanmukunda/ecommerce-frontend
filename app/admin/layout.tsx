import type React from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
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