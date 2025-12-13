"use client"

import { useParams, useRouter } from "next/navigation"
import { ProductForm } from "../../form"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function EditProductPage() {
  const { id } = useParams()
  const router = useRouter()

  const handleSubmit = () => {
    alert("Product updated successfully!")
    router.push("/admin")
  }

  const handleCancel = () => {
    router.push("/admin")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight">Edit Product</h1>
          <p className="text-gray-600 mt-2">Update product details and variants</p>
        </div>
      </div>

      <ProductForm 
        productId={id as string} 
        onSubmit={handleSubmit} 
        onCancel={handleCancel} 
      />
    </div>
  )
}