import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SustainabilityPage } from "@/components/sustainability-page"

export default function Sustainability() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <SustainabilityPage />
      </main>
      <Footer />
    </div>
  )
}
