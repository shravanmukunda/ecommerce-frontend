"use client"

import { ProductForm } from "../form"
import { useRouter } from "next/navigation"

export default function NewProductPage() {
  const router = useRouter()

  const handleSubmit = (productData: any) => {
    // In a real app, this would be an API call
    console.log("Adding new product:", productData)
    alert("Product added successfully!")
    router.push("/admin")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tight">Add New Product</h1>
        <p className="text-gray-600 mt-2">Fill in the details for your new product</p>
      </div>
      
      <ProductForm onSubmit={handleSubmit} />
    </div>
  )
}