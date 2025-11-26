"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Product } from "@/context/store-context"

interface ProductFormProps {
  product?: Product
  onSubmit: (product: Omit<Product, 'id'>) => void
}

export function ProductForm({ product, onSubmit }: ProductFormProps) {
  const router = useRouter()
  const [name, setName] = useState(product?.name || "")
  const [price, setPrice] = useState(product?.price.toString() || "")
  const [image, setImage] = useState(product?.image || "")
  const [hoverImage, setHoverImage] = useState(product?.hoverImage || "")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const productData = {
      name,
      price: parseFloat(price),
      image,
      hoverImage
    }
    
    onSubmit(productData)
    
    // Reset form after submission
    if (!product) {
      setName("")
      setPrice("")
      setImage("")
      setHoverImage("")
    }
    
    setIsSubmitting(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{product ? "Edit Product" : "Add New Product"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter product name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="price">Price ($)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="image">Main Image URL</Label>
            <Input
              id="image"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://example.com/image.jpg"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="hoverImage">Hover Image URL</Label>
            <Input
              id="hoverImage"
              value={hoverImage}
              onChange={(e) => setHoverImage(e.target.value)}
              placeholder="https://example.com/hover-image.jpg"
            />
          </div>
          
          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : product ? "Update Product" : "Add Product"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}