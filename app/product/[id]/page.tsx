import { ProductDetail } from "@/components/product-detail"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import type { Metadata } from "next"
import { client } from "@/lib/apolloClient"
import { GET_PRODUCT } from "@/graphql/product-queries"

// Update to fetch product data from GraphQL
async function getProductData(id: string) {
  try {
    const { data } = await client.query({
      query: GET_PRODUCT,
      variables: { id },
    })

    const product = (data as any).product
    if (!product) {
      return null
    }

    return {
      id: product.id,
      name: product.name,
      price: product.basePrice,
      description: product.description,
      image: product.designImageURL,
      images: [product.designImageURL], // For now, just use the main image
      materials: product.materials || ["Premium organic cotton", "Sustainable materials"],
      careInstructions: product.careInstructions || ["Machine wash cold", "Tumble dry low", "Do not bleach"],
    }
  } catch (error) {
    console.error("Error fetching product:", error)
    return null
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params
  const product = await getProductData(resolvedParams.id)

  if (!product) {
    return {
      title: "Product Not Found - AuraGaze",
    }
  }

  return {
    title: `${product.name} - AuraGaze`,
    description: product.description,
    keywords: [`${product.name}`, "AuraGaze", "luxury streetwear", "minimalist clothing"],
    openGraph: {
      title: `${product.name} - AuraGaze`,
      description: product.description,
      url: `https://www.auragaze.com/product/${resolvedParams.id}`,
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
      title: `${product.name} - AuraGaze`,
      description: product.description,
      images: [product.image],
    },
  }
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const product = await getProductData(resolvedParams.id)

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-8">The product you're looking for doesn't exist or has been removed.</p>
          <a href="/shop" className="text-blue-600 hover:underline">Back to Shop</a>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <ProductDetail productData={product} />
      </main>
      <Footer />
    </div>
  )
}