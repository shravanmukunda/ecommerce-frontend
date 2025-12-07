"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, ShoppingCart, Heart, User } from "lucide-react"
import Image from "next/image"
import { useCart } from "@/src/hooks/use-cart"
import { useUser, SignInButton, SignOutButton } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

export function Header() {
  const { user } = useUser()
  const { cart } = useCart()
  const router = useRouter()

  const cartCount = cart?.items?.length || 0

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
                alt="AuraGaze Logo"
                width={40}
                height={40}
                className="rounded-full"
              />
              <span className="text-xl font-black uppercase tracking-wider">AuraGaze</span>
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
                <div className="flex items-center gap-3">
                  <span className="hidden md:block font-semibold">
                    Hi, {user.firstName || user.username}
                  </span>

                  <Link href="/dashboard">
                    <Button variant="ghost" size="icon">
                      <User className="h-6 w-6" />
                    </Button>
                  </Link>

                  <SignOutButton>
                    <Button variant="ghost" className="hidden md:inline-flex">
                      Logout
                    </Button>
                  </SignOutButton>
                </div>
              ) : (
                <SignInButton mode="modal">
                  <button className="text-left hover:text-gray-900">Login</button>
                </SignInButton>
              )}
            </nav>
          </SheetContent>
        </Sheet>
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/aura-gaze-logo.png"
            alt="AuraGaze Logo"
            width={50}
            height={50}
            className="rounded-full"
          />
          <span className="text-2xl font-black uppercase tracking-wider hidden md:block">AuraGaze</span>
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
        <Link href="/cart" className="relative">
          <Button variant="ghost" size="icon">
            <ShoppingCart className="h-6 w-6" />
            <span className="sr-only">Shopping Cart</span>
          </Button>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Link>
        {user ? (
          <div className="flex items-center gap-2">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <User className="h-6 w-6" />
                <span className="sr-only">Dashboard</span>
              </Button>
            </Link>
            <SignOutButton>
              <Button variant="ghost" className="hidden md:inline-flex">
                Logout
              </Button>
            </SignOutButton>
          </div>
        ) : (
          <SignInButton mode="modal">
            <Button variant="ghost" className="hidden md:inline-flex">
              Login
            </Button>
          </SignInButton>
        )}
      </div>
    </header>
  )
}
