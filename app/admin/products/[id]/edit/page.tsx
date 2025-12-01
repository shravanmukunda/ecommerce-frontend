"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery, useMutation } from "@apollo/client/react"
import { GET_PRODUCT } from "@/graphql/product-queries"
import { UPDATE_PRODUCT } from "@/graphql/product-mutations"
import type { Product } from "@/lib/types"
import Link from "next/link"
import { ArrowLeft, Upload } from "lucide-react"

// Define TypeScript interfaces for our data
interface ProductVariant {
  id: string;
  size: string;
  color: string;
  price: number;
  inventory: {
    availableQuantity: number;
  };
}

interface ProductData {
  id: string;
  name: string;
  description: string;
  designImageURL: string;
  basePrice: number;
  isActive: boolean;
  variants: ProductVariant[];
}

export default function EditProductPage() {
  const { id } = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: ""
  })

  // Fetch product data
  const { data, loading, error } = useQuery<{ product: ProductData }>(GET_PRODUCT, {
    variables: { id }
  })

  // Update product mutation
  const [updateProduct, { loading: updateLoading }] = useMutation(UPDATE_PRODUCT)

  // Populate form when data loads
  useEffect(() => {
    if (data?.product) {
      const productData = data.product
      setProduct({
        id: parseInt(productData.id),
        name: productData.name,
        price: productData.basePrice,
        image: productData.designImageURL || "/placeholder.svg"
      })
      setFormData({
        name: productData.name,
        description: productData.description,
        price: productData.basePrice.toString(),
        image: productData.designImageURL || ""
      })
    }
  }, [data])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateProduct({
        variables: {
          input: {
            id,
            name: formData.name,
            description: formData.description,
            basePrice: parseFloat(formData.price),
            designImageURL: formData.image
          }
        }
      })
      router.push("/admin/products")
    } catch (err) {
      console.error("Error updating product:", err)
    }
  }

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  if (error) return <div className="flex items-center justify-center min-h-screen text-red-500">Error: {error.message}</div>
  if (!product) return <div className="flex items-center justify-center min-h-screen">Product not found</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-black uppercase tracking-tight">Edit Product</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
          <CardDescription>Update your product information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter product description"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Image URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                  />
                  <Button type="button" variant="outline" size="icon">
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Link href="/admin/products">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={updateLoading}>
                {updateLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}