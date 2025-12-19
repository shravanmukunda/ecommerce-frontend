"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, ShoppingCart, User } from "lucide-react"
import Image from "next/image"
import { useCart } from "@/src/hooks/use-cart"
import { useUser, SignInButton, SignOutButton } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

export function Header() {
  const { user } = useUser()
  const { cart } = useCart()
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)

  const cartCount = cart?.items?.length || 0

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 flex h-20 w-full items-center justify-between px-4 md:px-6 lg:px-8 transition-all duration-300 ${
        isScrolled
          ? "bg-[#0f0f0f]/95 backdrop-blur-md border-b border-[#1a1a1a] shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
          : "bg-[#0f0f0f]/80 backdrop-blur-sm border-b border-[#1a1a1a]/50"
      }`}
    >
      {/* Logo Section - Left */}
      <div className="flex items-center gap-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden bg-transparent hover:bg-[#1a1a1a] text-[#e5e5e5] border-0"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-80 bg-[#121212] border-r border-[#1a1a1a] p-6 backdrop-blur-xl [&>button]:text-[#e5e5e5] [&>button]:hover:text-[#00bfff] [&>button]:hover:bg-[#1a1a1a] [&>button]:rounded-lg"
          >
            <div className="flex items-center justify-between mb-8">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00bfff] to-[#0099ff] flex items-center justify-center">
                  {/* Space for SVG logo - user will add later */}
                </div>
                <span className="text-xl font-bold uppercase tracking-wider text-[#e5e5e5]">
                  AuraGaze
                </span>
              </Link>
            </div>
            <nav className="grid gap-2">
              <Link
                href="/"
                className="px-4 py-3 text-lg font-medium text-[#e5e5e5] rounded-lg transition-all duration-300 hover:bg-[#1a1a1a] hover:text-[#00bfff] hover:shadow-[0_0_15px_rgba(0,191,255,0.3)] relative group"
              >
                <span className="relative z-10">Home</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#00bfff] transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                href="/shop"
                className="px-4 py-3 text-lg font-medium text-[#e5e5e5] rounded-lg transition-all duration-300 hover:bg-[#1a1a1a] hover:text-[#00bfff] hover:shadow-[0_0_15px_rgba(0,191,255,0.3)] relative group"
              >
                <span className="relative z-10">Shop</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#00bfff] transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                href="/contact"
                className="px-4 py-3 text-lg font-medium text-[#e5e5e5] rounded-lg transition-all duration-300 hover:bg-[#1a1a1a] hover:text-[#00bfff] hover:shadow-[0_0_15px_rgba(0,191,255,0.3)] relative group"
              >
                <span className="relative z-10">Contact</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#00bfff] transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <div className="mt-4 pt-4 border-t border-[#1a1a1a]">
                {user ? (
                  <div className="space-y-2">
                    <div className="px-4 py-2 text-sm text-[#999]">
                      Hi, {user.firstName || user.username}
                    </div>
                    <Link href="/dashboard">
                      <Button
                        variant="ghost"
                        className="w-full justify-start px-4 py-3 text-[#e5e5e5] hover:bg-[#1a1a1a] hover:text-[#00bfff]"
                      >
                        <User className="h-5 w-5 mr-3" />
                        Dashboard
                      </Button>
                    </Link>
                    <SignOutButton>
                      <Button
                        variant="ghost"
                        className="w-full justify-start px-4 py-3 text-[#e5e5e5] hover:bg-[#1a1a1a] hover:text-[#00bfff]"
                      >
                        Logout
                      </Button>
                    </SignOutButton>
                  </div>
                ) : (
                  <SignInButton mode="modal">
                    <Button className="w-full bg-gradient-to-r from-[#00bfff] to-[#0099ff] text-white hover:from-[#0099ff] hover:to-[#00bfff] hover:shadow-[0_0_20px_rgba(0,191,255,0.5)] transition-all duration-300">
                      Login
                    </Button>
                  </SignInButton>
                )}
              </div>
            </nav>
          </SheetContent>
        </Sheet>
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00bfff] to-[#0099ff] flex items-center justify-center transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(0,191,255,0.5)] group-hover:scale-105">
            {/* Space for SVG logo - user will add later */}
            <Image
              src="/images/aura-gaze-logo.png"
              alt="AuraGaze Logo"
              width={40}
              height={40}
              className="rounded-full"
            />
          </div>
          <span className="text-2xl font-bold uppercase tracking-wider text-[#e5e5e5] hidden md:block transition-colors group-hover:text-[#00bfff]">
            AuraGaze
          </span>
        </Link>
      </div>

      {/* Navigation Links - Center/Right */}
      <nav className="hidden lg:flex items-center gap-8 text-base font-medium">
        <Link
          href="/"
          className="text-[#e5e5e5] relative group transition-all duration-300 hover:text-[#00bfff]"
        >
          <span className="relative z-10">Home</span>
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#00bfff] transition-all duration-300 group-hover:w-full group-hover:shadow-[0_0_10px_rgba(0,191,255,0.8)]"></span>
        </Link>
        <Link
          href="/shop"
          className="text-[#e5e5e5] relative group transition-all duration-300 hover:text-[#00bfff]"
        >
          <span className="relative z-10">Shop</span>
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#00bfff] transition-all duration-300 group-hover:w-full group-hover:shadow-[0_0_10px_rgba(0,191,255,0.8)]"></span>
        </Link>
        <Link
          href="/contact"
          className="text-[#e5e5e5] relative group transition-all duration-300 hover:text-[#00bfff]"
        >
          <span className="relative z-10">Contact</span>
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#00bfff] transition-all duration-300 group-hover:w-full group-hover:shadow-[0_0_10px_rgba(0,191,255,0.8)]"></span>
        </Link>
      </nav>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        <Link href="/cart" className="relative group">
          <Button
            variant="ghost"
            size="icon"
            className="bg-transparent hover:bg-[#1a1a1a] text-[#e5e5e5] border-0 transition-all duration-300 group-hover:text-[#00bfff] group-hover:shadow-[0_0_15px_rgba(0,191,255,0.3)]"
          >
            <ShoppingCart className="h-6 w-6" />
            <span className="sr-only">Shopping Cart</span>
          </Button>
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-gradient-to-r from-[#00bfff] to-[#0099ff] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-[0_0_10px_rgba(0,191,255,0.6)] animate-pulse">
              {cartCount}
            </span>
          )}
        </Link>
        {user ? (
          <div className="flex items-center gap-2">
            <Link href="/dashboard">
              <Button
                variant="ghost"
                size="icon"
                className="bg-transparent hover:bg-[#1a1a1a] text-[#e5e5e5] border-0 transition-all duration-300 hover:text-[#00bfff] hover:shadow-[0_0_15px_rgba(0,191,255,0.3)]"
              >
                <User className="h-6 w-6" />
                <span className="sr-only">Dashboard</span>
              </Button>
            </Link>
            <SignOutButton>
              <Button
                variant="ghost"
                className="hidden md:inline-flex bg-transparent hover:bg-[#1a1a1a] text-[#e5e5e5] border-0 transition-all duration-300 hover:text-[#00bfff] hover:shadow-[0_0_15px_rgba(0,191,255,0.3)]"
              >
                Logout
              </Button>
            </SignOutButton>
          </div>
        ) : (
          <SignInButton mode="modal">
            <Button className="hidden md:inline-flex bg-gradient-to-r from-[#00bfff] to-[#0099ff] text-white hover:from-[#0099ff] hover:to-[#00bfff] hover:shadow-[0_0_20px_rgba(0,191,255,0.5)] transition-all duration-300 border-0">
              Login
            </Button>
          </SignInButton>
        )}
      </div>
    </header>
  )
}
