import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import Debug from "@/components/hero"
import { ProductGrid } from "@/components/product-grid"
import { EditorialBanner } from "@/components/editorial-banner"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <Debug />
        <EditorialBanner title="JUST DROPPED" subtitle="New arrivals from the underground" pattern="chevron" />
        <ProductGrid />
        <EditorialBanner
          title="LIMITED COLLABORATION"
          subtitle="Exclusive pieces. Limited quantities."
          pattern="checkerboard"
        />
      </main>
      <Footer />
    </div>
  )
}
