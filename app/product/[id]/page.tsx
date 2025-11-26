import { ProductDetail } from "@/components/product-detail"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import type { Metadata } from "next"

const getProductData = (id: string) => {
  return {
    id: Number(id),
    name: "ESSENTIAL TEE",
    price: 85,
    description:
      "The perfect foundation for any wardrobe. Crafted from premium organic cotton with a relaxed fit that embodies effortless luxury. This essential piece features our signature minimalist design philosophy with attention to every detail.",
    image: "/placeholder.svg?height=800&width=600&text=Essential+Tee+Front",
  }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const product = getProductData(params.id)

  return {
    title: `${product.name} - Sacred Mayhem`,
    description: product.description,
    keywords: [`${product.name}`, "Sacred Mayhem", "luxury streetwear", "minimalist clothing"],
    openGraph: {
      title: `${product.name} - Sacred Mayhem`,
      description: product.description,
      url: `https://www.sacredmayhem.com/product/${params.id}`,
      images: [
        {
          url: product.image,
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} - Sacred Mayhem`,
      description: product.description,
      images: [product.image],
    },
  }
}

export default function ProductPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <ProductDetail productId={params.id} />
      </main>
      <Footer />
    </div>
  )
}
