import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AboutPage } from "@/components/about-page"

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <AboutPage />
      </main>
      <Footer />
    </div>
  )
}
