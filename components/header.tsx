"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, ShoppingCart, Heart, User } from "lucide-react"
import Image from "next/image"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"

export function Header() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <header className="flex h-20 w-full items-center justify-between px-4 md:px-6 lg:px-8 border-b border-gray-200 bg-white shadow-sm">
      <div className="flex items-center gap-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden bg-transparent">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 bg-white p-6">
            <Link href="#" className="flex items-center gap-2 mb-6">
              <Image
                src="/placeholder.svg?height=40&width=40"
                alt="Sacred Mayhem Logo"
                width={40}
                height={40}
                className="rounded-full"
              />
              <span className="text-xl font-black uppercase tracking-wider">Sacred Mayhem</span>
            </Link>
            <nav className="grid gap-4 text-lg font-medium">
              <Link href="/" className="hover:text-gray-900">
                Home
              </Link>
              <Link href="/shop" className="hover:text-gray-900">
                Shop
              </Link>
              {/* Blog link removed */}
              <Link href="/contact" className="hover:text-gray-900">
                Contact
              </Link>
              {user ? (
                <>
                  <Link href="/dashboard" className="hover:text-gray-900">
                    Dashboard
                  </Link>
                  <Button onClick={handleLogout} variant="ghost" className="justify-start px-0">
                    Logout
                  </Button>
                </>
              ) : (
                <Link href="/login" className="hover:text-gray-900">
                  Login
                </Link>
              )}
            </nav>
          </SheetContent>
        </Sheet>
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/sacred-mayhem-logo.png"
            alt="Sacred Mayhem Logo"
            width={50}
            height={50}
            className="rounded-full"
          />
          <span className="text-2xl font-black uppercase tracking-wider hidden md:block">Sacred Mayhem</span>
        </Link>
      </div>
      <nav className="hidden lg:flex items-center gap-6 text-lg font-medium">
        <Link href="/" className="hover:text-gray-900 transition-colors">
          Home
        </Link>
        <Link href="/shop" className="hover:text-gray-900 transition-colors">
          Shop
        </Link>
        {/* Blog link removed */}
        <Link href="/contact" className="hover:text-gray-900 transition-colors">
          Contact
        </Link>
      </nav>
      <div className="flex items-center gap-4">
        <Link href="/cart">
          <Button variant="ghost" size="icon">
            <ShoppingCart className="h-6 w-6" />
            <span className="sr-only">Shopping Cart</span>
          </Button>
        </Link>
        {user ? (
          <div className="flex items-center gap-2">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <User className="h-6 w-6" />
                <span className="sr-only">Dashboard</span>
              </Button>
            </Link>
            <Button onClick={handleLogout} variant="ghost" className="hidden md:inline-flex">
              Logout
            </Button>
          </div>
        ) : (
          <Link href="/login">
            <Button variant="ghost" className="hidden md:inline-flex">
              Login
            </Button>
          </Link>
        )}
      </div>
    </header>
  )
}
