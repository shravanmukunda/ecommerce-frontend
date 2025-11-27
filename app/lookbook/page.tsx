import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { LookbookPage } from "@/components/lookbook-page"

export default function Lookbook() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <LookbookPage />
      </main>
      <Footer />
    </div>
  )
}
