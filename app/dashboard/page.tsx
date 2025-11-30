"use client"

import { useAuth } from "@/context/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Package, User, Heart, Repeat, MapPin, CreditCard } from "lucide-react"

export default function DashboardHomePage() {
  const { user } = useAuth()

  if (!user) {
    return null // Should be redirected by DashboardLayout
  }

  const quickActions = [
    { name: "Update Profile", href: "/dashboard/profile", icon: User, description: "Manage your personal details." },
    { name: "View Orders", href: "/dashboard/orders", icon: Package, description: "Track your purchases." },
    { name: "Initiate Return", href: "/dashboard/returns", icon: Repeat, description: "Start a return or exchange." },
    {
      name: "Manage Addresses",
      href: "/dashboard/addresses",
      icon: MapPin,
      description: "Add or edit shipping addresses.",
    },
    {
      name: "Payment Methods",
      href: "/dashboard/wallet",
      icon: CreditCard,
      description: "Update your payment details.",
    },
  ]

  return (
    <div className="space-y-10">
      {/* Welcome Section */}
      <div className="bg-black text-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-wider mb-2">Welcome, {user.name}!</h1>
        <p className="text-lg text-gray-300">Your personal hub for managing everything AuraGaze.</p>
      </div>

      {/* Quick Actions Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-black uppercase tracking-wider text-black">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action) => (
            <Card key={action.name} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-3 text-xl font-bold uppercase tracking-wide">
                  <action.icon className="h-6 w-6 text-black" />
                  {action.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4 text-sm">{action.description}</p>
                <Link href={action.href}>
                  <Button
                    variant="outline"
                    className="w-full border-black text-black hover:bg-black hover:text-white bg-transparent"
                  >
                    Go Now
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Admin Panel Access (if applicable) */}
      {user.isAdmin && (
        <Card className="border-2 border-red-500 bg-red-50 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-black uppercase tracking-wide text-red-700">
              Administrator Access
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-800 mb-4 text-lg">
              You are logged in as an administrator. Access special admin features and tools here.
            </p>
            <Button className="bg-red-600 text-white hover:bg-red-700 text-lg px-6 py-3">Go to Admin Tools</Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
