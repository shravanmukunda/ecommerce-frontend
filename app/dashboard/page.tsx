"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Package, User, Heart, Repeat, MapPin, CreditCard } from "lucide-react"
import { useQuery } from "@apollo/client/react"
import { MY_ORDERS } from "@/graphql/orders"
import { useUser } from "@clerk/nextjs"

interface Order {
  id: string
  totalAmount: number
  status: string
  createdAt: string
}

interface MyOrdersResponse {
  myOrders: Order[]
}

export default function DashboardHomePage() {
  const { user } = useUser()
  const { data: ordersData, loading: ordersLoading, error: ordersError } = useQuery<MyOrdersResponse>(MY_ORDERS)

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
      <div className="bg-gradient-to-r from-[#0f0f0f] via-[#1a1a1a] to-[#0f0f0f] border border-[#1a1a1a] text-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-wider mb-2 bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
          Welcome, {user.firstName || user.username}!
        </h1>
        <p className="text-lg text-gray-300">Your personal hub for managing everything AuraGaze.</p>
      </div>

      {/* Quick Actions Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-black uppercase tracking-wider text-white">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action) => (
            <Card key={action.name} className="bg-[#0f0f0f] border-[#1a1a1a] hover:border-[#333] hover:shadow-lg transition-all duration-200">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-3 text-xl font-bold uppercase tracking-wide text-white">
                  <action.icon className="h-6 w-6 text-[#00bfff]" />
                  {action.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-4 text-sm">{action.description}</p>
                <Link href={action.href}>
                  <Button
                    variant="outline"
                    className="w-full border-[#333] text-white hover:bg-gradient-to-r hover:from-[#00bfff] hover:to-[#0099ff] hover:text-white hover:border-transparent bg-transparent transition-all duration-300"
                  >
                    Go Now
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Recent Orders Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-black uppercase tracking-wider text-white">Recent Orders</h2>
        <Card className="bg-[#0f0f0f] border-[#1a1a1a]">
          <CardContent className="pt-6">
            {ordersLoading ? (
              <p className="text-gray-400">Loading orders...</p>
            ) : ordersError ? (
              <p className="text-red-400">Error loading orders: {ordersError.message}</p>
            ) : ordersData?.myOrders && ordersData.myOrders.length > 0 ? (
              <div className="space-y-4">
                {ordersData.myOrders.slice(0, 3).map((order) => (
                  <div key={order.id} className="flex justify-between items-center border-b border-[#1a1a1a] pb-4 last:border-0 last:pb-0">
                    <div>
                      <p className="font-semibold text-white">Order #{order.id}</p>
                      <p className="text-gray-400 text-sm">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-white">₹{order.totalAmount.toFixed(2)}</p>
                      <p className="text-gray-400 text-sm">Status: {order.status}</p>
                    </div>
                  </div>
                ))}
                <Link href="/dashboard/orders">
                  <Button variant="outline" className="w-full border-[#333] text-white hover:bg-gradient-to-r hover:from-[#00bfff] hover:to-[#0099ff] hover:text-white hover:border-transparent bg-transparent transition-all duration-300">
                    View All Orders
                  </Button>
                </Link>
              </div>
            ) : (
              <p className="text-gray-400">You haven't placed any orders yet.</p>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Admin Panel Access (if applicable) */}
    </div>
  )
}