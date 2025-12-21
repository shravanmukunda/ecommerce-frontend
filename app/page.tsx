"use client"

// import { MinimalistHero } from "@/components/ui/minimalist-hero"
import { Header } from "@/components/header"
import { ProductGrid } from "@/components/product-grid"
import { Footer } from "@/components/footer"
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react"
import { HeroScroll } from "@/components/hero-scroll"

export default function HomePage() {
  const navLinks = [
    { label: 'HOME', href: '/' },
    { label: 'SHOP', href: '/shop' },
    { label: 'CONTACT', href: '/contact' },
  ]

  const socialLinks = [
    { icon: Facebook, href: '#' },
    { icon: Instagram, href: 'https://www.instagram.com/auragaze.in/' },
    { icon: Twitter, href: '#' },
    { icon: Linkedin, href: '#' },
  ]

  return (
    <div className="min-h-screen">
      {/* <MinimalistHero
        logoText="AuraGaze"
        navLinks={navLinks}
        mainText="Discover exclusive fashion that blends luxury with an edgy aesthetic. AuraGaze offers unique designs for the modern individual who dares to stand out."
        imageSrc="/hero-image.png"
        imageAlt="Fashion model in minimalist style"
        overlayText={{
          part1: 'STREET',
          part2: 'COUTURE',
        }}
        socialLinks={socialLinks}
        locationText="Bangalore, BLR"
      /> */}
      <Header />
      <HeroScroll/>
      <ProductGrid />
      <Footer />
    </div>
  )
}
