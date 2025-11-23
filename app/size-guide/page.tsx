import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SizeGuidePage } from "@/components/size-guide-page"

export default function SizeGuide() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <SizeGuidePage />
      </main>
      <Footer />
    </div>
  )
}
