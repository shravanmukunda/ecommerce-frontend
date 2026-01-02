import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { TermsConditionsPage } from "@/components/terms-conditions-page"

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <Header />
      <main>
        <TermsConditionsPage />
      </main>
      <Footer />
    </div>
  )
}

