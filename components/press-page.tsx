"use client"

import Link from "next/link"
import Image from "next/image"
import { ExternalLink, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollReveal } from "@/components/scroll-reveal"

const pressReleases = [
  {
    id: 1,
    title: "AuraGaze Unveils Fall/Winter 2024 Collection: Urban Minimalism",
    date: "2024-09-15",
    source: "Vogue",
    link: "#",
    image: "/placeholder.svg?height=300&width=400&text=Vogue+Article",
  },
  {
    id: 2,
    title: "The Rise of Monochrome: AuraGaze Leads the Trend",
    date: "2024-08-20",
    source: "Hypebeast",
    link: "#",
    image: "/placeholder.svg?height=300&width=400&text=Hypebeast+Article",
  },
  {
    id: 3,
    title: "AuraGaze Announces Sustainable Manufacturing Initiative",
    date: "2024-07-10",
    source: "Fashion Revolution",
    link: "#",
    image: "/placeholder.svg?height=300&width=400&text=Fashion+Revolution",
  },
  {
    id: 4,
    title: "Exclusive Interview with AuraGaze Creative Director",
    date: "2024-06-01",
    source: "GQ",
    link: "#",
    image: "/placeholder.svg?height=300&width=400&text=GQ+Interview",
  },
]

export function PressPage() {
  return (
    <div className="min-h-screen pt-16 lg:pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-black via-gray-900 to-black py-16 border-b border-[#1a1a1a]">
        <div className="container mx-auto px-4 text-center">
          <ScrollReveal direction="up">
            <h1 className="mb-4 text-4xl font-black uppercase tracking-wider md:text-6xl lg:text-8xl text-[#e5e5e5]">Press</h1>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={200}>
            <p className="text-lg uppercase tracking-wide md:text-xl text-[#999]">AuraGaze in the media</p>
          </ScrollReveal>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Introduction */}
        <ScrollReveal direction="up">
          <div className="mb-16 max-w-3xl mx-auto text-center">
            <h2 className="mb-6 text-3xl font-black uppercase tracking-wider text-[#e5e5e5]">Our Story, Told by Others</h2>
            <p className="text-lg leading-relaxed text-[#999]">
              Welcome to the AuraGaze press room. Here you'll find our latest news, press releases, and media
              coverage. For all media inquiries, please contact us directly.
            </p>
          </div>
        </ScrollReveal>

        {/* Press Releases */}
        <section className="mb-16">
          <ScrollReveal direction="up">
            <h2 className="mb-12 text-center text-3xl font-black uppercase tracking-wider text-[#e5e5e5]">Latest Coverage</h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {pressReleases.map((release, index) => (
              <ScrollReveal key={release.id} direction="up" delay={index * 100}>
                <div className="group bg-[#121212] border border-[#1a1a1a] rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_30px_rgba(0,191,255,0.2)] transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={release.image || "/placeholder.svg"}
                      alt={release.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-6">
                    <p className="text-sm text-[#666] mb-2">
                      {release.date} | {release.source}
                    </p>
                    <h3 className="mb-4 text-xl font-bold uppercase tracking-wide line-clamp-2 text-[#e5e5e5]">{release.title}</h3>
                    <Link href={release.link} target="_blank" rel="noopener noreferrer">
                      <Button
                        variant="outline"
                        className="border-[#1a1a1a] text-[#e5e5e5] hover:border-[#00bfff]/50 hover:bg-[#00bfff]/10 hover:text-[#00bfff] hover:scale-105 transition-all duration-300 bg-transparent"
                      >
                        Read Article
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Media Kit */}
        <section className="bg-[#121212] border border-[#1a1a1a] rounded-xl p-12 text-center">
          <ScrollReveal direction="scale">
            <h2 className="mb-4 text-3xl font-black uppercase tracking-wider md:text-4xl text-[#e5e5e5]">Media Kit</h2>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={200}>
            <p className="mb-8 text-lg text-[#999]">
              Download our official press kit, including high-resolution images, brand guidelines, and company facts.
            </p>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={400}>
            <Button
              size="lg"
              className="bg-gradient-to-r from-[#00bfff] to-[#0099ff] text-white hover:from-[#0099ff] hover:to-[#00bfff] hover:shadow-[0_0_20px_rgba(0,191,255,0.5)] hover:scale-105 transition-all duration-300 border-0"
            >
              Download Press Kit
              <Download className="ml-2 h-5 w-5" />
            </Button>
          </ScrollReveal>
        </section>
      </div>
    </div>
  )
}
