import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ShippingReturnsPage } from "@/components/shipping-returns-page"

export default function ShippingReturns() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <Header />
      <main>
        <ShippingReturnsPage />
      </main>
      <Footer />
    </div>
  )
}
