import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ShippingReturnsPage } from "@/components/shipping-returns-page"

export default function ShippingReturns() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <ShippingReturnsPage />
      </main>
      <Footer />
    </div>
  )
}
