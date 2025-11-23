import { ScrollReveal } from "@/components/scroll-reveal"

interface EditorialBannerProps {
  title: string
  subtitle: string
  pattern: "chevron" | "checkerboard" | "stripes"
}

export function EditorialBanner({ title, subtitle, pattern }: EditorialBannerProps) {
  const getPatternClass = () => {
    switch (pattern) {
      case "chevron":
        return "bg-gradient-to-r from-black via-gray-800 to-black"
      case "checkerboard":
        return "bg-black"
      case "stripes":
        return "bg-gradient-to-r from-black to-gray-900"
      default:
        return "bg-black"
    }
  }

  return (
    <section className={`relative py-16 lg:py-24 ${getPatternClass()}`}>
      {pattern === "checkerboard" && (
        <div className="absolute inset-0 opacity-10">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `
              linear-gradient(45deg, transparent 25%, white 25%, white 75%, transparent 75%),
              linear-gradient(45deg, transparent 25%, white 25%, white 75%, transparent 75%)
            `,
              backgroundSize: "20px 20px",
              backgroundPosition: "0 0, 10px 10px",
            }}
          />
        </div>
      )}

      <ScrollReveal direction="scale" delay={200}>
        <div className="container relative mx-auto px-4 text-center text-white">
          <h2 className="mb-4 text-4xl font-black uppercase tracking-wider md:text-6xl lg:text-8xl">{title}</h2>
          <p className="text-lg uppercase tracking-wide md:text-xl lg:text-2xl">{subtitle}</p>
        </div>
      </ScrollReveal>
    </section>
  )
}
