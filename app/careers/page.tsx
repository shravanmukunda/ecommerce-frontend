import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CareersPage } from "@/components/careers-page"

export default function Careers() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <CareersPage />
      </main>
      <Footer />
    </div>
  )
}
