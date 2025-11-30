"use client"

import Image from "next/image"
import { Leaf, Recycle, Factory, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollReveal } from "@/components/scroll-reveal"

const initiatives = [
  {
    icon: <Leaf className="h-12 w-12 text-black" />,
    title: "Eco-Friendly Materials",
    description: "Utilizing 95% organic, recycled, and innovative sustainable fabrics.",
  },
  {
    icon: <Factory className="h-12 w-12 text-black" />,
    title: "Ethical Production",
    description: "Ensuring fair wages and safe working conditions across our supply chain.",
  },
  {
    icon: <Recycle className="h-12 w-12 text-black" />,
    title: "Circular Fashion",
    description: "Designing for durability and exploring recycling programs for end-of-life products.",
  },
  {
    icon: <Heart className="h-12 w-12 text-black" />,
    title: "Community Impact",
    description: "Investing in local communities and supporting environmental education.",
  },
]

export function SustainabilityPage() {
  return (
    <div className="min-h-screen pt-16 lg:pt-20">
      {/* Hero Section */}
      <section className="relative h-[70vh] bg-black text-white overflow-hidden">
        <Image
          src="/placeholder.svg?height=1080&width=1920&text=Sustainability+Hero"
          alt="Sustainable Fashion"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 flex h-full items-center justify-center">
          <div className="container mx-auto px-4 text-center">
            <ScrollReveal direction="up">
              <h1 className="mb-4 text-4xl font-black uppercase tracking-wider md:text-6xl lg:text-8xl">
                Sustainability
              </h1>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={200}>
              <p className="text-lg uppercase tracking-wide md:text-xl">Fashion with a conscience</p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Mission Statement */}
        <ScrollReveal direction="up">
          <div className="mb-16 max-w-4xl mx-auto text-center">
            <h2 className="mb-6 text-3xl font-black uppercase tracking-wider">Our Commitment to a Better Future</h2>
            <p className="text-lg leading-relaxed text-gray-700">
              At AuraGaze, sustainability is not just a buzzword; it's woven into the very fabric of our brand. We
              are dedicated to minimizing our environmental footprint and maximizing our positive social impact, from
              the raw materials we source to the hands that craft our garments.
            </p>
          </div>
        </ScrollReveal>

        {/* Key Initiatives */}
        <section className="mb-16">
          <ScrollReveal direction="up">
            <h2 className="mb-12 text-center text-3xl font-black uppercase tracking-wider">Our Key Initiatives</h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {initiatives.map((item, index) => (
              <ScrollReveal key={item.title} direction="up" delay={index * 150}>
                <div className="text-center p-8 bg-gray-50 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <div className="mb-6 flex justify-center">{item.icon}</div>
                  <h3 className="mb-4 text-xl font-bold uppercase tracking-wide">{item.title}</h3>
                  <p className="text-gray-700">{item.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Transparency Section */}
        <section className="mb-16 bg-black p-12 text-white">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 items-center">
            <ScrollReveal direction="left">
              <div>
                <h2 className="mb-6 text-3xl font-black uppercase tracking-wider md:text-4xl">
                  Transparency & Traceability
                </h2>
                <p className="text-lg leading-relaxed text-gray-300">
                  We believe in full transparency. We meticulously trace our supply chain to ensure ethical practices
                  and sustainable sourcing at every step. Learn more about where our materials come from.
                </p>
                <Button
                  variant="outline"
                  className="mt-6 border-white text-white hover:bg-white hover:text-black hover:scale-105 transition-all duration-300 bg-transparent"
                >
                  Explore Our Supply Chain
                </Button>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right">
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src="/placeholder.svg?height=400&width=600&text=Supply+Chain"
                  alt="Supply Chain"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Certifications */}
        <section>
          <ScrollReveal direction="up">
            <h2 className="mb-12 text-center text-3xl font-black uppercase tracking-wider">Our Certifications</h2>
          </ScrollReveal>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { name: "GOTS", image: "/placeholder.svg?height=100&width=100&text=GOTS" },
              { name: "Fair Trade", image: "/placeholder.svg?height=100&width=100&text=Fair+Trade" },
              { name: "OEKO-TEX", image: "/placeholder.svg?height=100&width=100&text=OEKO-TEX" },
              { name: "BCI", image: "/placeholder.svg?height=100&width=100&text=BCI" },
            ].map((cert, index) => (
              <ScrollReveal key={cert.name} direction="up" delay={index * 100}>
                <div className="text-center p-4 bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
                  <Image
                    src={cert.image || "/placeholder.svg"}
                    alt={cert.name}
                    width={100}
                    height={100}
                    className="mx-auto mb-4"
                  />
                  <p className="font-semibold uppercase tracking-wide">{cert.name}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="mt-24 bg-gray-50 p-12 text-center">
          <ScrollReveal direction="scale">
            <h2 className="mb-4 text-3xl font-black uppercase tracking-wider md:text-4xl">Join the Movement</h2>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={200}>
            <p className="mb-8 text-lg text-gray-700">
              Every purchase supports our commitment to a more sustainable and ethical fashion industry.
            </p>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={400}>
            <Button
              size="lg"
              className="bg-black px-8 py-4 text-lg font-bold uppercase tracking-wide text-white hover:bg-gray-800 hover:scale-105 transition-all duration-300"
            >
              Shop Sustainable Collection
            </Button>
          </ScrollReveal>
        </section>
      </div>
    </div>
  )
}
