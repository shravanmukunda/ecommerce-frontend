"use client"

import { ProductForm } from "../form"
import { useRouter } from "next/navigation"

export default function TestProductFormPage() {
  const router = useRouter()

  const handleSubmit = (productData: any, additionalData?: any) => {
    console.log("Product data submitted:", productData, additionalData)
    alert("Product data logged to console. Check developer tools.")
    router.push("/admin")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tight">Test Product Form</h1>
        <p className="text-gray-600 mt-2">Test the enhanced product form with all features</p>
      </div>
      
      <ProductForm onSubmit={handleSubmit} />
    </div>
  )
}