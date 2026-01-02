import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { RefundPolicyPage } from "@/components/refund-policy-page"

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <Header />
      <main>
        <RefundPolicyPage />
      </main>
      <Footer />
    </div>
  )
}

