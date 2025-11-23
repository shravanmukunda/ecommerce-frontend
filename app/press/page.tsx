import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PressPage } from "@/components/press-page"

export default function Press() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <PressPage />
      </main>
      <Footer />
    </div>
  )
}
