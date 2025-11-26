import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ShopPage } from "@/components/shop-page"

export default function Shop() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <ShopPage />
      </main>
      <Footer />
    </div>
  )
}
