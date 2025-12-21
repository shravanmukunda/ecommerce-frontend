"use client"

import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="border-t border-[#1a1a1a] text-[#e5e5e5] py-12 px-4 md:px-6 lg:px-8 relative bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Company Info */}
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2 group">
          <Image
            src="/logo.png"
            alt="Logo"
            width={350}
            height={150}
            className="h-[9rem] w-auto transition-all duration-300 group-hover:scale-105"
          />
          </Link>
          <p className="text-[#999] text-sm">
            Discover exclusive fashion that blends luxury with an edgy aesthetic. AuraGaze offers unique designs
            for the modern individual.
          </p>
          <div className="flex space-x-4">
            <Link href="#" aria-label="Facebook" className="text-[#999] hover:text-[#00bfff] transition-colors">
              <Facebook className="h-6 w-6" />
            </Link>
            <Link href="#" aria-label="Instagram" className="text-[#999] hover:text-[#00bfff] transition-colors">
              <Instagram className="h-6 w-6" />
            </Link>
            <Link href="#" aria-label="Youtube" className="text-[#999] hover:text-[#00bfff] transition-colors">
              <Youtube className="h-6 w-6" />
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold uppercase tracking-wide text-[#e5e5e5]">Quick Links</h3>
          <ul className="space-y-2 text-[#999] text-sm">
            <li>
              <Link href="/shop" className="hover:text-[#00bfff] transition-colors">
                Shop
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-[#00bfff] transition-colors">
                About Us
              </Link>
            </li>
            <li>
              {/* Blog link removed */}
            </li>
            <li>
              <Link href="/contact" className="hover:text-[#00bfff] transition-colors">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer Service */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold uppercase tracking-wide text-[#e5e5e5]">Customer Service</h3>
          <ul className="space-y-2 text-[#999] text-sm">
            <li>
              <Link href="/faq" className="hover:text-[#00bfff] transition-colors">
                FAQ
              </Link>
            </li>
            <li>
              <Link href="/shipping-returns" className="hover:text-[#00bfff] transition-colors">
                Shipping & Returns
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy" className="hover:text-[#00bfff] transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms-of-service" className="hover:text-[#00bfff] transition-colors">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[#1a1a1a] mt-8 pt-8 text-center text-[#666] text-sm">
        &copy; {new Date().getFullYear()} All rights reserved.
      </div>
    </footer>
  )
}
