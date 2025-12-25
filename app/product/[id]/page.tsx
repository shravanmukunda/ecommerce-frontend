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
      fetchPolicy: "network-only",
    })

    const product = (data as any).product
    if (!product) {
      return null
    }

    // Support both new imageURLs array and legacy designImageURL
    const images = product.imageURLs && product.imageURLs.length > 0 
      ? product.imageURLs 
      : (product.designImageURL ? [product.designImageURL] : [])
    
    return {
      id: product.id,
      name: product.name,
      price: product.basePrice,
      description: product.description,
      image: images[0] || product.designImageURL || "",
      images: images, // Use multiple images for slideshow
      variants: product.variants || [],
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
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
        <Header />
        <main className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4 text-[#e5e5e5]">Product Not Found</h1>
          <p className="text-[#999] mb-8">The product you're looking for doesn't exist or has been removed.</p>
          <a href="/shop" className="text-[#00bfff] hover:text-[#0099ff] hover:underline transition-colors">Back to Shop</a>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <Header />
      <main>
        <ProductDetail productData={product} />
      </main>
      <Footer />
    </div>
  )
}