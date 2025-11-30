import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AuraGaze - Underground Luxury Fashion",
  description:
    "Discover AuraGaze, the leading luxury streetwear brand. Minimalist designs, premium quality, and exclusive collections. Where darkness meets elegance.",
  keywords: [
    "AuraGaze",
    "luxury streetwear",
    "black fashion",
    "minimalist clothing",
    "designer clothing",
    "Paris fashion",
    "urban fashion",
    "premium apparel",
  ],
  openGraph: {
    title: "AuraGaze - Underground Luxury Fashion",
    description:
      "Discover AuraGaze, the leading luxury streetwear brand. Minimalist designs, premium quality, and exclusive collections. Where darkness meets elegance.",
    url: "https://www.auragaze.com",
    siteName: "AuraGaze",
    images: [
      {
        url: "/placeholder.svg?height=630&width=1200&text=Sacred+Mayhem+OpenGraph",
        width: 1200,
        height: 630,
        alt: "AuraGaze - Underground Luxury Fashion",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AuraGaze - Underground Luxury Fashion",
    description:
      "Discover AuraGaze, the leading luxury streetwear brand. Minimalist designs, premium quality, and exclusive collections. Where darkness meets elegance.",
    images: ["/placeholder.svg?height=675&width=1200&text=Sacred+Mayhem+Twitter"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
