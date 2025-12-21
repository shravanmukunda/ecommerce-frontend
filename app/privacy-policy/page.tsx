import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PrivacyPolicyPage } from "@/components/privacy-policy-page"

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <Header />
      <main>
        <PrivacyPolicyPage />
      </main>
      <Footer />
    </div>
  )
}

