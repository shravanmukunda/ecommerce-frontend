import Image from "next/image"
import Link from "next/link"
import { ScrollReveal } from "@/components/scroll-reveal"

const lookbookItems = [
  {
    id: 1,
    title: "URBAN MINIMALISM",
    subtitle: "Fall/Winter 2024",
    image: "/placeholder.svg?height=800&width=600",
    size: "large",
  },
  {
    id: 2,
    title: "STREET ELEGANCE",
    subtitle: "Capsule Collection",
    image: "/placeholder.svg?height=600&width=400",
    size: "medium",
  },
  {
    id: 3,
    title: "MONOCHROME DREAMS",
    subtitle: "Editorial Series",
    image: "/placeholder.svg?height=600&width=400",
    size: "medium",
  },
  {
    id: 4,
    title: "UNDERGROUND CULTURE",
    subtitle: "Collaboration",
    image: "/placeholder.svg?height=800&width=1200",
    size: "wide",
  },
]

export function Lookbook() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <ScrollReveal direction="up">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-black uppercase tracking-wider md:text-4xl lg:text-5xl">Lookbook</h2>
            <p className="text-lg uppercase tracking-wide text-gray-600">Visual narratives of modern luxury</p>
          </div>
        </ScrollReveal>

        {/* Lookbook Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {lookbookItems.map((item, index) => (
            <ScrollReveal key={item.id} direction={index % 2 === 0 ? "left" : "right"} delay={index * 150}>
              <Link
                href={`/lookbook/${item.id}`}
                className={`group relative overflow-hidden ${
                  item.size === "large"
                    ? "md:col-span-2 lg:col-span-2"
                    : item.size === "wide"
                      ? "md:col-span-2 lg:col-span-3"
                      : "md:col-span-1"
                }`}
              >
                <div
                  className={`relative overflow-hidden ${
                    item.size === "large" ? "aspect-[4/3]" : item.size === "wide" ? "aspect-[3/1]" : "aspect-[3/4]"
                  }`}
                >
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/40 transition-opacity duration-300 group-hover:bg-black/60" />

                  {/* Content */}
                  <div className="absolute inset-0 flex items-center justify-center text-center text-white">
                    <div>
                      <h3 className="mb-2 text-2xl font-black uppercase tracking-wider md:text-3xl lg:text-4xl">
                        {item.title}
                      </h3>
                      <p className="text-sm uppercase tracking-wide md:text-base">{item.subtitle}</p>
                    </div>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
