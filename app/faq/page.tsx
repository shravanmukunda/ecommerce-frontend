import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FAQPage } from "@/components/faq-page"

export default function FAQ() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <Header />
      <main>
        <FAQPage />
      </main>
      <Footer />
    </div>
  )
}
