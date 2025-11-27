"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { User, Package, Repeat, MapPin, CreditCard, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"

export function DashboardSidebar() {
  const pathname = usePathname()
  const { user } = useAuth()

  const navItems = [
    { name: "Profile", href: "/dashboard/profile", icon: User },
    { name: "My Orders", href: "/dashboard/orders", icon: Package },
    { name: "Returns / Exchange", href: "/dashboard/returns", icon: Repeat },
    { name: "Addresses", href: "/dashboard/addresses", icon: MapPin },
    { name: "Wallet", href: "/dashboard/wallet", icon: CreditCard },
  ]

  const adminNavItems = [
    { name: "Admin Dashboard", href: "/dashboard/admin", icon: Shield },
  ]

  return (
    <aside className="w-full lg:w-64 p-4 lg:p-8 bg-gray-50 lg:bg-white border-r border-gray-200">
      <h2 className="text-2xl font-black uppercase tracking-wider mb-6 text-black">User Menu</h2>
      <nav className="space-y-4">
        {navItems.map((item) => (
          <Link key={item.name} href={item.href} passHref>
            <Button
              variant="outline"
              className={`w-full justify-start px-6 py-4 text-base font-bold uppercase tracking-wide rounded-lg transition-all duration-200
                ${
                  pathname === item.href
                    ? "bg-black text-white hover:bg-gray-800 border-black"
                    : "bg-white text-black border-gray-200 hover:bg-gray-100"
                }`}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Button>
          </Link>
        ))}
      </nav>

      {/* Admin Section - now visible to all users */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-bold uppercase tracking-wider mb-4 text-red-600">Admin Tools</h3>
        <nav className="space-y-4">
          {adminNavItems.map((item) => (
            <Link key={item.name} href={item.href} passHref>
              <Button
                variant="outline"
                className={`w-full justify-start px-6 py-4 text-base font-bold uppercase tracking-wide rounded-lg transition-all duration-200
                  ${
                    pathname === item.href
                      ? "bg-red-600 text-white hover:bg-red-700 border-red-600"
                      : "bg-white text-red-600 border-red-200 hover:bg-red-50"
                  }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Button>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  )
}