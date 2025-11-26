import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { LookbookDetail } from "@/components/lookbook-detail"
import type { Metadata } from "next"

const lookbookCollections = [
  {
    id: "1",
    title: "URBAN MINIMALISM",
    subtitle: "Fall/Winter 2024",
    description:
      "Where concrete meets couture. A study in architectural fashion, blending harsh urban landscapes with refined, minimalist silhouettes. This collection explores the beauty in stark contrasts and the power of understated elegance.",
    images: [
      "/placeholder.svg?height=1080&width=1920&text=Urban+Minimalism+1",
      "/placeholder.svg?height=1080&width=1920&text=Urban+Minimalism+2",
      "/placeholder.svg?height=1080&width=1920&text=Urban+Minimalism+3",
    ],
    relatedProducts: [],
  },
  {
    id: "2",
    title: "STREET ELEGANCE",
    subtitle: "Capsule Collection",
    description:
      "Refined rebellion. Luxury meets the underground. This capsule collection redefines street style with elevated fabrics and sophisticated cuts, proving that comfort and high fashion can coexist.",
    images: [
      "/placeholder.svg?height=1080&width=1920&text=Street+Elegance+1",
      "/placeholder.svg?height=1080&width=1920&text=Street+Elegance+2",
    ],
    relatedProducts: [],
  },
  {
    id: "3",
    title: "MONOCHROME DREAMS",
    subtitle: "Editorial Series",
    description:
      "Black and white. Nothing more, nothing less. An editorial series that celebrates the timeless power of monochrome, showcasing how depth and emotion can be conveyed through the absence of color.",
    images: [
      "/placeholder.svg?height=1080&width=1920&text=Monochrome+Dreams+1",
      "/placeholder.svg?height=1080&width=1920&text=Monochrome+Dreams+2",
      "/placeholder.svg?height=1080&width=1920&text=Monochrome+Dreams+3",
      "/placeholder.svg?height=1080&width=1920&text=Monochrome+Dreams+4",
    ],
    relatedProducts: [],
  },
  {
    id: "4",
    title: "UNDERGROUND CULTURE",
    subtitle: "Collaboration",
    description:
      "Born from the streets, elevated to art. A unique collaboration that fuses raw street energy with high-end design, creating pieces that are both authentic and luxurious.",
    images: [
      "/placeholder.svg?height=1080&width=1920&text=Underground+Culture+1",
      "/placeholder.svg?height=1080&width=1920&text=Underground+Culture+2",
    ],
    relatedProducts: [],
  },
  {
    id: "5",
    title: "MIDNIGHT SESSIONS",
    subtitle: "Behind the Scenes",
    description:
      "The creative process unveiled. A rare glimpse into the late-night sessions and meticulous craftsmanship that go into every BLVCK collection, revealing the passion behind the brand.",
    images: [
      "/placeholder.svg?height=1080&width=1920&text=Midnight+Sessions+1",
      "/placeholder.svg?height=1080&width=1920&text=Midnight+Sessions+2",
    ],
    relatedProducts: [],
  },
  {
    id: "6",
    title: "FUTURE NOIR",
    subtitle: "Spring/Summer 2025",
    description:
      "Tomorrow's darkness, today's vision. This collection anticipates future trends, blending dystopian aesthetics with sleek, functional designs for the modern urban explorer.",
    images: [
      "/placeholder.svg?height=1080&width=1920&text=Future+Noir+1",
      "/placeholder.svg?height=1080&width=1920&text=Future+Noir+2",
      "/placeholder.svg?height=1080&width=1920&text=Future+Noir+3",
    ],
    relatedProducts: [],
  },
]

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const collection = lookbookCollections.find((col) => col.id === params.id)

  if (!collection) {
    return {
      title: "Lookbook Collection Not Found - Sacred Mayhem",
      description: "The requested lookbook collection could not be found.",
    }
  }

  return {
    title: `${collection.title} - Sacred Mayhem Lookbook`,
    description: collection.description,
    keywords: [`${collection.title}`, "Sacred Mayhem Lookbook", "fashion collection", "editorial", "campaign"],
    openGraph: {
      title: `${collection.title} - Sacred Mayhem Lookbook`,
      description: collection.description,
      url: `https://www.sacredmayhem.com/lookbook/${params.id}`,
      images: [
        {
          url: collection.images[0],
          width: 1920,
          height: 1080,
          alt: `${collection.title} campaign image`,
        },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${collection.title} - Sacred Mayhem Lookbook`,
      description: collection.description,
      images: [collection.images[0]],
    },
  }
}

export default function LookbookDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <LookbookDetail collectionId={params.id} />
      </main>
      <Footer />
    </div>
  )
}
