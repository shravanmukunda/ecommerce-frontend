import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { StoreProvider } from "@/context/store-context"
import { AuthProvider } from "@/context/auth-context" // Import AuthProvider

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Sacred Mayhem - Underground Luxury Fashion",
  description:
    "Discover Sacred Mayhem, the leading luxury streetwear brand. Minimalist designs, premium quality, and exclusive collections. Where darkness meets elegance.",
  keywords: [
    "Sacred Mayhem",
    "luxury streetwear",
    "black fashion",
    "minimalist clothing",
    "designer clothing",
    "Paris fashion",
    "urban fashion",
    "premium apparel",
  ],
  openGraph: {
    title: "Sacred Mayhem - Underground Luxury Fashion",
    description:
      "Discover Sacred Mayhem, the leading luxury streetwear brand. Minimalist designs, premium quality, and exclusive collections. Where darkness meets elegance.",
    url: "https://www.sacredmayhem.com", // Updated domain for Sacred Mayhem
    siteName: "Sacred Mayhem",
    images: [
      {
        url: "/placeholder.svg?height=630&width=1200&text=Sacred+Mayhem+OpenGraph",
        width: 1200,
        height: 630,
        alt: "Sacred Mayhem - Underground Luxury Fashion",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sacred Mayhem - Underground Luxury Fashion",
    description:
      "Discover Sacred Mayhem, the leading luxury streetwear brand. Minimalist designs, premium quality, and exclusive collections. Where darkness meets elegance.",
    images: ["/placeholder.svg?height=675&width=1200&text=Sacred+Mayhem+Twitter"],
  },
    // ...removed v0.dev generator...
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {" "}
          {/* Wrap with AuthProvider */}
          <StoreProvider>{children}</StoreProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
