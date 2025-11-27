"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Instagram, Twitter, Youtube, Mail, MapPin, Phone } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-black text-white py-16 px-4 md:px-8">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand Info */}
        <div className="space-y-4">
          <h2 className="text-2xl font-black uppercase tracking-wider">Sacred Mayhem</h2>
          <p className="text-gray-400 text-sm">
            Luxury streetwear that transcends trends. Crafted for the underground, celebrated by the avant-garde.
          </p>
          <div className="flex space-x-4">
            <Link href="#" className="text-gray-400 hover:text-white transition-colors">
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white transition-colors">
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white transition-colors">
              <Youtube className="h-5 w-5" />
              <span className="sr-only">YouTube</span>
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold uppercase tracking-wide">Quick Links</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link href="/shop" className="hover:text-white transition-colors">
                Shop
              </Link>
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