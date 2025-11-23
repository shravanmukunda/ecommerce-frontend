import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CheckoutPage } from "@/components/checkout-page"

export default function Checkout() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <CheckoutPage />
      </main>
      <Footer />
    </div>
  )
}
