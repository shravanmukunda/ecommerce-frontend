"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { User, Package, Repeat, MapPin, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useUser } from "@clerk/nextjs"
import Image from "next/image"

export function DashboardSidebar() {
  const pathname = usePathname()
  const { user } = useUser()

  const navItems = [
    { name: "Profile", href: "/dashboard/profile", icon: User },
    { name: "My Orders", href: "/dashboard/orders", icon: Package },
    { name: "Returns / Exchange", href: "/dashboard/returns", icon: Repeat },
    { name: "Addresses", href: "/dashboard/addresses", icon: MapPin },
    { name: "Wallet", href: "/dashboard/wallet", icon: CreditCard },
  ]

  return (
    <aside className="w-full lg:w-64 p-4 lg:p-8 bg-gradient-to-b from-black via-gray-900 to-black border-r border-[#1a1a1a]">
      {/* User Profile Section */}
      {user && (
        <div className="mb-8">
          <Link href="/dashboard/profile" className="flex flex-col items-center group">
            <div className="relative w-20 h-20 mb-4">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00bfff] to-[#0099ff] rounded-full p-[3px] transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(0,191,255,0.5)] group-hover:scale-105">
                <div className="w-full h-full rounded-full bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center overflow-hidden">
                  {user.imageUrl ? (
                    <Image
                      src={user.imageUrl}
                      alt={user.firstName || "User"}
                      width={74}
                      height={74}
                      className="rounded-full"
                    />
                  ) : (
                    <User className="h-10 w-10 text-white" />
                  )}
                </div>
              </div>
            </div>
            <h3 className="text-lg font-bold uppercase tracking-wide text-white group-hover:text-[#00bfff] transition-colors">
              {user.firstName || user.username || "User"}
            </h3>
            <p className="text-sm text-gray-400 mt-1">{user.primaryEmailAddress?.emailAddress}</p>
          </Link>
        </div>
      )}

      <h2 className="text-2xl font-black uppercase tracking-wider mb-6 text-white">User Menu</h2>
      <nav className="space-y-4">
        {navItems.map((item) => (
          <Link key={item.name} href={item.href} passHref>
            <Button
              variant="outline"
              className={`w-full justify-start px-6 py-4 text-base font-bold uppercase tracking-wide rounded-lg transition-all duration-200
                ${
                  pathname === item.href
                    ? "bg-gradient-to-r from-[#00bfff] to-[#0099ff] text-white hover:from-[#0099ff] hover:to-[#00bfff] border-0 shadow-[0_0_20px_rgba(0,191,255,0.3)]"
                    : "bg-transparent text-gray-300 border-[#333] hover:bg-white/10 hover:text-white hover:border-[#666]"
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
