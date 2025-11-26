"use client"

import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-black text-white py-12 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Company Info */}
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/public/images/sacred-mayhem-logo.png"
              alt="Sacred Mayhem Logo"
              width={50}
              height={50}
              className="rounded-full"
            />
            <span className="text-2xl font-black uppercase tracking-wider">Sacred Mayhem</span>
          </Link>
          <p className="text-gray-400 text-sm">
            Discover exclusive fashion that blends luxury with an edgy aesthetic. Sacred Mayhem offers unique designs
            for the modern individual.
          </p>
          <div className="flex space-x-4">
            <Link href="#" aria-label="Facebook">
              <Facebook className="h-6 w-6 text-gray-400 hover:text-white transition-colors" />
            </Link>
            <Link href="#" aria-label="Instagram">
              <Instagram className="h-6 w-6 text-gray-400 hover:text-white transition-colors" />
            </Link>
            <Link href="#" aria-label="Twitter">
              <Twitter className="h-6 w-6 text-gray-400 hover:text-white transition-colors" />
            </Link>
            <Link href="#" aria-label="Youtube">
              <Youtube className="h-6 w-6 text-gray-400 hover:text-white transition-colors" />
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold uppercase tracking-wide">Quick Links</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>
              <Link href="/shop" className="hover:text-white transition-colors">
                Shop
              </Link>
            </li>
            <li>
              <Link href="/lookbook" className="hover:text-white transition-colors">
                Lookbook
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-white transition-colors">
                About Us
              </Link>
            </li>
            <li>
              {/* Blog link removed */}
            </li>
            <li>
              <Link href="/contact" className="hover:text-white transition-colors">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer Service */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold uppercase tracking-wide">Customer Service</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>
              <Link href="/faq" className="hover:text-white transition-colors">
                FAQ
              </Link>
            </li>
            <li>
              <Link href="/shipping-returns" className="hover:text-white transition-colors">
                Shipping & Returns
              </Link>
            </li>
            <li>
              <Link href="/size-guide" className="hover:text-white transition-colors">
                Size Guide
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms-of-service" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold uppercase tracking-wide">Newsletter</h3>
          <p className="text-gray-400 text-sm">Subscribe to our newsletter for exclusive updates and offers.</p>
          <form className="flex gap-2">
            <Input
              type="email"
              placeholder="Your email"
              className="flex-1 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-white focus:ring-white"
            />
            <Button type="submit" className="bg-white text-black hover:bg-gray-200">
              Subscribe
            </Button>
          </form>
        </div>
      </div>
      <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Sacred Mayhem. All rights reserved.
      </div>
    </footer>
  )
}
