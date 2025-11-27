"use client"

import { ProductForm } from "../../form"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { products as initialProducts } from "@/lib/data/products"
import { Product } from "@/context/store-context"

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)

  // Find product by ID
  useEffect(() => {
    const productId = parseInt(params.id)
    const foundProduct = initialProducts.find(p => p.id === productId) || null
    setProduct(foundProduct)
  }, [params.id])

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg font-semibold">Product not found</p>
      </div>
    )
  }

  const handleSubmit = (productData: Omit<Product, 'id'>) => {
    // In a real app, this would be an API call
    console.log("Updating product:", { ...productData, id: product.id })
    alert("Product updated successfully!")
    router.push("/admin")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tight">Edit Product</h1>
        <p className="text-gray-600 mt-2">Update the details for your product</p>
      </div>
      
      <ProductForm product={product} onSubmit={handleSubmit} />
    </div>
  )
}