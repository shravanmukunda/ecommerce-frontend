"use client"

import { ProductForm } from "../form"
import { useRouter } from "next/navigation"
import { useMutation } from "@apollo/client/react"
import { CREATE_PRODUCT } from "@/graphql/product-mutations"
import { GET_PRODUCTS } from "@/graphql/product-queries"

export default function NewProductPage() {
  const router = useRouter()
  const [createProduct, { loading, error }] = useMutation(CREATE_PRODUCT, {
    refetchQueries: [{ query: GET_PRODUCTS, variables: { isActive: true } }],
  })

  const handleSubmit = async () => {
    // The actual form submission is handled by the ProductForm component
    // This is just a callback that gets called when the form is successfully submitted
    alert("Product added successfully!")
    router.push("/admin")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tight">Add New Product</h1>
        <p className="text-gray-600 mt-2">Fill in the details for your new product</p>
        {error && <p className="text-red-500 mt-2">Error: {error.message}</p>}
      </div>
      
      <ProductForm onSubmit={handleSubmit} onCancel={() => router.push("/admin")} />
    </div>
  )
}