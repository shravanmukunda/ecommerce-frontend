"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { User, Package, Repeat, MapPin, CreditCard, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DashboardSidebar() {
  const pathname = usePathname()

  const navItems = [
    { name: "Profile", href: "/dashboard/profile", icon: User },
    { name: "My Orders", href: "/dashboard/orders", icon: Package },
    { name: "Returns / Exchange", href: "/dashboard/returns", icon: Repeat },
    { name: "Addresses", href: "/dashboard/addresses", icon: MapPin },
    { name: "Wallet", href: "/dashboard/wallet", icon: CreditCard },
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
    </aside>
  )
}
