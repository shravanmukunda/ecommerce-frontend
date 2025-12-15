import { Header } from "@/components/header"
import { HeroScroll } from "@/components/hero-scroll"
import { ProductGrid } from "@/components/product-grid"
import { EditorialBanner } from "@/components/editorial-banner"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main>
        <HeroScroll />
        <div className="bg-white">
          <EditorialBanner title="JUST DROPPED" subtitle="New arrivals from the underground" pattern="chevron" />
          <ProductGrid />
          <EditorialBanner
            title="LIMITED COLLABORATION"
            subtitle="Exclusive pieces. Limited quantities."
            pattern="checkerboard"
          />
        </div>
      </main>
      <Footer />
    </div>
  )
}
