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
        return "bg-gradient-to-r from-[#0f0f0f] via-[#121212] to-[#0f0f0f]"
      case "checkerboard":
        return "bg-[#0f0f0f]"
      case "stripes":
        return "bg-gradient-to-r from-[#0f0f0f] to-[#121212]"
      default:
        return "bg-[#0f0f0f]"
    }
  }

  return (
    <section className={`relative py-16 lg:py-24 border-b border-[#1a1a1a] ${getPatternClass()}`}>
      {pattern === "checkerboard" && (
        <div className="absolute inset-0 opacity-5">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `
              linear-gradient(45deg, transparent 25%, rgba(229,229,229,0.1) 25%, rgba(229,229,229,0.1) 75%, transparent 75%),
              linear-gradient(45deg, transparent 25%, rgba(229,229,229,0.1) 25%, rgba(229,229,229,0.1) 75%, transparent 75%)
            `,
              backgroundSize: "20px 20px",
              backgroundPosition: "0 0, 10px 10px",
            }}
          />
        </div>
      )}

      <ScrollReveal direction="scale" delay={200}>
        <div className="container relative mx-auto px-4 text-center">
          <h2 className="mb-4 text-4xl font-black uppercase tracking-wider md:text-6xl lg:text-8xl text-[#e5e5e5]">{title}</h2>
          <p className="text-lg uppercase tracking-wide md:text-xl lg:text-2xl text-[#999]">{subtitle}</p>
        </div>
      </ScrollReveal>
    </section>
  )
}
