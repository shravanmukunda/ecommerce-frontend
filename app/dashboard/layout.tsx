import type React from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Header } from "@/components/header"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <DashboardLayout>{children}</DashboardLayout>
      {/* <Footer /> removed to prevent duplicate footer */}
    </div>
  )
}
