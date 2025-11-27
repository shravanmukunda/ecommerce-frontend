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
  const [miniDescription, setMiniDescription] = useState(product?.description || "")
  const [mainDescription, setMainDescription] = useState("")
  const [price, setPrice] = useState(product?.price.toString() || "")
  const [images, setImages] = useState<string[]>(product?.images || ["", "", "", "", ""])
  const [hoverImage, setHoverImage] = useState(product?.hoverImage || "")
  const [sizes, setSizes] = useState<{ name: string; quantity: number }[]>(product?.sizes || [])
  const [materials, setMaterials] = useState<string[]>(product?.materials || [""])
  const [reviews, setReviews] = useState<string[]>([""])
  const [shippingInfo, setShippingInfo] = useState("")
  const [expectedDelivery, setExpectedDelivery] = useState("")
  const [returnPolicy, setReturnPolicy] = useState("")
  const [sizeGuideLink, setSizeGuideLink] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Add a new size field
  const addSize = () => {
    setSizes([...sizes, { name: "", quantity: 0 }])
  }

  // Update a size field
  const updateSize = (index: number, field: 'name' | 'quantity', value: string | number) => {
    const newSizes = [...sizes]
    if (field === 'name') {
      newSizes[index].name = value as string
    } else {
      newSizes[index].quantity = value as number
    }
    setSizes(newSizes)
  }

  // Remove a size field
  const removeSize = (index: number) => {
    setSizes(sizes.filter((_, i) => i !== index))
  }

  // Add a new image field
  const addImage = () => {
    setImages([...images, ""])
  }

  // Update an image field
  const updateImage = (index: number, value: string) => {
    const newImages = [...images]
    newImages[index] = value
    setImages(newImages)
  }

  // Remove an image field
  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  // Add a new material field
  const addMaterial = () => {
    setMaterials([...materials, ""])
  }

  // Update a material field
  const updateMaterial = (index: number, value: string) => {
    const newMaterials = [...materials]
    newMaterials[index] = value
    setMaterials(newMaterials)
  }

  // Remove a material field
  const removeMaterial = (index: number) => {
    setMaterials(materials.filter((_, i) => i !== index))
  }

  // Add a new review field
  const addReview = () => {
    setReviews([...reviews, ""])
  }

  // Update a review field
  const updateReview = (index: number, value: string) => {
    const newReviews = [...reviews]
    newReviews[index] = value
    setReviews(newReviews)
  }

  // Remove a review field
  const removeReview = (index: number) => {
    setReviews(reviews.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Filter out empty images
    const filteredImages = images.filter(img => img.trim() !== "")
    
    // Combine mini description and main description
    const fullDescription = `${miniDescription}\n\n${mainDescription}`
    
    const productData = {
      name,
      description: fullDescription,
      price: parseFloat(price),
      image: filteredImages[0] || "", // Set first image as main image
      hoverImage,
      images: filteredImages,
      sizes: sizes.filter(size => size.name.trim() !== ""),
      materials: materials.filter(mat => mat.trim() !== ""),
      careInstructions: reviews.filter(review => review.trim() !== ""), // Using careInstructions for reviews
      shippingPrice: 0, // We'll store shipping info in a custom field
      category: shippingInfo, // Using category for shipping info temporarily
    }
    
    onSubmit(productData)
    
    // Reset form after submission (only for new products)
    if (!product) {
      setName("")
      setMiniDescription("")
      setMainDescription("")
      setPrice("")
      setImages(["", "", "", "", ""])
      setHoverImage("")
      setSizes([])
      setMaterials([""])
      setReviews([""])
      setShippingInfo("")
      setExpectedDelivery("")
      setReturnPolicy("")
      setSizeGuideLink("")
    }
    
    setIsSubmitting(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{product ? "Edit Product" : "Add New Product"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 1. Add/Edit Photos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Product Images</h3>
            <p className="text-sm text-gray-600">Add up to 5 product images. The first image will be used as the main image.</p>
            
            {images.map((image, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  value={image}
                  onChange={(e) => updateImage(index, e.target.value)}
                  placeholder={`Image ${index + 1} URL`}
                />
                {images.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => removeImage(index)}
                    className="shrink-0"
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              onClick={addImage}
              className="w-full"
            >
              Add Another Image
            </Button>
            
            {/* Hover Image */}
            <div className="space-y-2">
              <Label htmlFor="hoverImage">Hover Image URL</Label>
              <Input
                id="hoverImage"
                value={hoverImage}
                onChange={(e) => setHoverImage(e.target.value)}
                placeholder="https://example.com/hover-image.jpg"
              />
            </div>
          </div>
          
          {/* 2. Title, Mini Description */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Product Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="name">Product Title *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter product title"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="miniDescription">Mini Description</Label>
              <Textarea
                id="miniDescription"
                value={miniDescription}
                onChange={(e) => setMiniDescription(e.target.value)}
                placeholder="Enter a brief product description"
                rows={2}
              />
            </div>
          </div>
          
          {/* 3. Price */}
          <div className="space-y-2">
            <Label htmlFor="price">Price ($) *</Label>
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
          
          {/* 4. Sizes Available */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Sizes Available</h3>
            
            {sizes.map((size, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-2 items-end">
                <div className="space-y-2">
                  <Label>Size Name</Label>
                  <Input
                    value={size.name}
                    onChange={(e) => updateSize(index, 'name', e.target.value)}
                    placeholder="e.g., S, M, L"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    value={size.quantity}
                    onChange={(e) => updateSize(index, 'quantity', parseInt(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => removeSize(index)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              onClick={addSize}
              className="w-full"
            >
              Add Size
            </Button>
          </div>
          
          {/* 5. Quantity Selector - Already included in sizes section above */}
          
          {/* 6. Cart Button - This is for frontend display, not admin data entry */}
          
          {/* 7. Shipping Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Shipping Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="shippingInfo">Shipping Details</Label>
              <Input
                id="shippingInfo"
                value={shippingInfo}
                onChange={(e) => setShippingInfo(e.target.value)}
                placeholder="Enter shipping information"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="expectedDelivery">Expected Delivery Date</Label>
              <Input
                id="expectedDelivery"
                value={expectedDelivery}
                onChange={(e) => setExpectedDelivery(e.target.value)}
                placeholder="e.g., 3-5 business days"
              />
            </div>
          </div>
          
          {/* 8. Return Policy */}
          <div className="space-y-2">
            <Label htmlFor="returnPolicy">Return Policy</Label>
            <Input
              id="returnPolicy"
              value={returnPolicy}
              onChange={(e) => setReturnPolicy(e.target.value)}
              placeholder="Enter return policy in one line"
            />
          </div>
          
          {/* 9. Size Guide Link */}
          <div className="space-y-2">
            <Label htmlFor="sizeGuideLink">Size Guide Link</Label>
            <Input
              id="sizeGuideLink"
              value={sizeGuideLink}
              onChange={(e) => setSizeGuideLink(e.target.value)}
              placeholder="https://example.com/size-guide"
            />
          </div>
          
          {/* 10. Main Description | Materials | Reviews */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Product Details</h3>
            
            <div className="space-y-2">
              <Label htmlFor="mainDescription">Main Description</Label>
              <Textarea
                id="mainDescription"
                value={mainDescription}
                onChange={(e) => setMainDescription(e.target.value)}
                placeholder="Enter detailed product description"
                rows={4}
              />
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Materials</h4>
              {materials.map((material, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={material}
                    onChange={(e) => updateMaterial(index, e.target.value)}
                    placeholder="e.g., 100% Organic Cotton"
                  />
                  {materials.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => removeMaterial(index)}
                      className="shrink-0"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              
              <Button
                type="button"
                variant="outline"
                onClick={addMaterial}
                className="w-full"
              >
                Add Material
              </Button>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Reviews</h4>
              {reviews.map((review, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={review}
                    onChange={(e) => updateReview(index, e.target.value)}
                    placeholder="Enter customer review"
                  />
                  {reviews.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => removeReview(index)}
                      className="shrink-0"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              
              <Button
                type="button"
                variant="outline"
                onClick={addReview}
                className="w-full"
              >
                Add Review
              </Button>
            </div>
          </div>
          
          {/* Form Actions */}
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