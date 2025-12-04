"use client"

import { useState, useCallback, useEffect } from "react"
import { useQuery, useMutation } from '@apollo/client/react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react"
import { GET_PRODUCT } from "@/graphql/product-queries"
import { CREATE_PRODUCT, UPDATE_PRODUCT, CREATE_PRODUCT_VARIANT } from "@/graphql/product-mutations"
import { gql } from "@apollo/client"

// Add type definitions for GraphQL responses
interface ProductOption {
  sizes: string[]
  colors: string[]
  materials: string[]
  necklines: string[]
  sleeveTypes: string[]
  fits: string[]
}

interface Inventory {
  id: string
  stockQuantity: number
  reservedQuantity: number
  availableQuantity: number
}

interface ProductVariant {
  id: string
  size: string
  color: string
  priceModifier: number
  sku: string
  price: number
  inventory: Inventory
}

interface Product {
  id: string
  name: string
  description: string
  designImageURL: string
  basePrice: number
  isActive: boolean
  brand: string
  category: string
  material: string
  neckline: string
  sleeveType: string
  fit: string
  weight: number
  careInstructions: string
  featured: boolean
  variants: ProductVariant[]
  createdAt: string
}

interface GetProductOptionsResponse {
  productOptions: ProductOption
}

interface GetProductResponse {
  product: Product
}

interface CreateProductResponse {
  createProduct: Product
}

interface ProductFormProps {
  productId?: string
  onSubmit: () => void
  onCancel: () => void
}

// Query to get dropdown options
const GET_PRODUCT_OPTIONS = gql`
  query GetProductOptions {
    productOptions {
      sizes
      colors
      materials
      necklines
      sleeveTypes
      fits
    }
  }
`

interface Variant {
  size: string
  color: string
  sku: string
  priceModifier: number
  stockQuantity: number
}

export function ProductForm({ productId, onSubmit, onCancel }: ProductFormProps) {
  // Fetch dropdown options from backend
  const { data: optionsData, loading: optionsLoading } = useQuery<GetProductOptionsResponse>(GET_PRODUCT_OPTIONS)
  
  // Fetch existing product if editing
  const { data: productData, loading: productLoading } = useQuery<GetProductResponse>(GET_PRODUCT, {
    variables: { id: productId },
    skip: !productId
  })

  const [createProduct, { loading: creating }] = useMutation<CreateProductResponse>(CREATE_PRODUCT)
  const [updateProduct, { loading: updating }] = useMutation<GetProductResponse>(UPDATE_PRODUCT)
  const [createVariant] = useMutation(CREATE_PRODUCT_VARIANT)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    designImageURL: "",
    basePrice: "",
    brand: "",
    category: "",
    material: "",
    neckline: "",
    sleeveType: "",
    fit: "",
    weight: "",
    careInstructions: "",
    featured: false
  })

  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [variants, setVariants] = useState<Variant[]>([])
  const [isDragging, setIsDragging] = useState(false)

  // Load product data when editing
  useEffect(() => {
    if (productData?.product) {
      const p = productData.product
      setFormData({
        name: p.name || "",
        description: p.description || "",
        designImageURL: p.designImageURL || "",
        basePrice: p.basePrice?.toString() || "",
        brand: p.brand || "",
        category: p.category || "",
        material: p.material || "",
        neckline: p.neckline || "",
        sleeveType: p.sleeveType || "",
        fit: p.fit || "",
        weight: p.weight?.toString() || "",
        careInstructions: p.careInstructions || "",
        featured: p.featured || false
      })

      // Extract unique sizes and colors from variants
      if (p.variants && p.variants.length > 0) {
        const sizes = [...new Set(p.variants.map((v: any) => v.size))] as string[]
        const colors = [...new Set(p.variants.map((v: any) => v.color).filter(Boolean))] as string[]
        setSelectedSizes(sizes)
        setSelectedColors(colors)
        
        // Map variants
        const mappedVariants = p.variants.map((v: any) => ({
          size: v.size,
          color: v.color || "",
          sku: v.sku,
          priceModifier: v.priceModifier,
          stockQuantity: v.inventory?.stockQuantity || 0
        }))
        setVariants(mappedVariants)
      }
    }
  }, [productData])

  // Auto-generate variants when sizes or colors change
  useEffect(() => {
    if (selectedSizes.length > 0 && selectedColors.length > 0) {
      generateVariants()
    }
  }, [selectedSizes, selectedColors])

  const generateVariants = () => {
    const newVariants: Variant[] = []
    
    for (const size of selectedSizes) {
      for (const color of selectedColors) {
        // Check if variant already exists
        const existing = variants.find(v => v.size === size && v.color === color)
        
        if (existing) {
          newVariants.push(existing)
        } else {
          // Generate SKU automatically
          const namePart = formData.name.substring(0, 3).toUpperCase() || "TSH"
          const sizePart = size
          const colorPart = color.substring(0, 3).toUpperCase()
          
          newVariants.push({
            size,
            color,
            sku: `${namePart}-${sizePart}-${colorPart}-${Date.now().toString().slice(-4)}`,
            priceModifier: 0,
            stockQuantity: 0
          })
        }
      }
    }
    
    setVariants(newVariants)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const toggleSize = (size: string) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    )
  }

  const toggleColor = (color: string) => {
    setSelectedColors(prev =>
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    )
  }

  const updateVariant = (index: number, field: keyof Variant, value: any) => {
    setVariants(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files).filter(file =>
      file.type.startsWith('image/')
    )
    
    if (files.length > 0 && files[0]) {
      // For now, just set the first image URL
      // In production, upload to cloud storage first
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, designImageURL: reader.result as string }))
      }
      reader.readAsDataURL(files[0])
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, designImageURL: reader.result as string }))
      }
      reader.readAsDataURL(files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Validate required fields
      if (!formData.name || !formData.designImageURL || !formData.basePrice) {
        alert("Please fill in all required fields")
        return
      }

      if (selectedSizes.length === 0 || selectedColors.length === 0) {
        alert("Please select at least one size and one color")
        return
      }

      // Prepare product input
      const productInput = {
        name: formData.name,
        description: formData.description,
        designImageURL: formData.designImageURL,
        basePrice: parseFloat(formData.basePrice),
        material: formData.material || null,
        neckline: formData.neckline || null,
        sleeveType: formData.sleeveType || null,
        fit: formData.fit || null,
        brand: formData.brand || null,
        category: formData.category || null,
        careInstructions: formData.careInstructions || null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        featured: formData.featured || false
      }

      let productIdToUse = productId

      if (productId) {
        // Update existing product
        const { data } = await updateProduct({
          variables: { id: productId, input: productInput }
        })
        console.log("Product updated:", data)
      } else {
        // Create new product
        const { data } = await createProduct({
          variables: { input: productInput },
          refetchQueries: ['GetProducts']
        })
        productIdToUse = data?.createProduct.id
        console.log("Product created:", data)
      }

      // Create variants
      if (productIdToUse) {
        for (const variant of variants) {
          await createVariant({
            variables: {
              input: {
                productID: productIdToUse,
                size: variant.size,
                color: variant.color || null,
                sku: variant.sku,
                priceModifier: variant.priceModifier,
                stockQuantity: variant.stockQuantity
              }
            }
          })
        }
      }

      // Success - call onSubmit callback
      onSubmit()
    } catch (error) {
      console.error("Error saving product:", error)
      alert("Failed to save product. Please check console for details.")
    }
  }

  if (optionsLoading || productLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  const options = optionsData?.productOptions
  const isLoading = creating || updating

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Classic Cotton Crew Neck"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="brand">Brand</Label>
            <Input
              id="brand"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              placeholder="Nike, Adidas, etc."
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the t-shirt features, style, and benefits..."
            rows={4}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="basePrice">Base Price ($) *</Label>
            <Input
              id="basePrice"
              name="basePrice"
              type="number"
              step="0.01"
              value={formData.basePrice}
              onChange={handleChange}
              placeholder="29.99"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Casual, Sport, Graphic"
            />
          </div>
        </div>
      </div>

      {/* Product Specifications */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Product Specifications</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="material">Material</Label>
            <Select value={formData.material} onValueChange={(v) => handleSelectChange("material", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select material" />
              </SelectTrigger>
              <SelectContent>
                {options?.materials?.map((material: string) => (
                  <SelectItem key={material} value={material}>{material}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="neckline">Neckline</Label>
            <Select value={formData.neckline} onValueChange={(v) => handleSelectChange("neckline", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select neckline" />
              </SelectTrigger>
              <SelectContent>
                {options?.necklines?.map((neckline: string) => (
                  <SelectItem key={neckline} value={neckline}>{neckline}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sleeveType">Sleeve Type</Label>
            <Select value={formData.sleeveType} onValueChange={(v) => handleSelectChange("sleeveType", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select sleeve type" />
              </SelectTrigger>
              <SelectContent>
                {options?.sleeveTypes?.map((sleeve: string) => (
                  <SelectItem key={sleeve} value={sleeve}>{sleeve}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fit">Fit</Label>
            <Select value={formData.fit} onValueChange={(v) => handleSelectChange("fit", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select fit" />
              </SelectTrigger>
              <SelectContent>
                {options?.fits?.map((fit: string) => (
                  <SelectItem key={fit} value={fit}>{fit}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="weight">Weight (grams)</Label>
            <Input
              id="weight"
              name="weight"
              type="number"
              value={formData.weight}
              onChange={handleChange}
              placeholder="180"
            />
          </div>

          <div className="flex items-center space-x-2 pt-8">
            <Checkbox
              id="featured"
              checked={formData.featured}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, featured: checked as boolean }))
              }
            />
            <Label htmlFor="featured" className="cursor-pointer">
              Featured Product
            </Label>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="careInstructions">Care Instructions</Label>
          <Textarea
            id="careInstructions"
            name="careInstructions"
            value={formData.careInstructions}
            onChange={handleChange}
            placeholder="Machine wash cold, tumble dry low..."
            rows={2}
          />
        </div>
      </div>

      {/* Product Image */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Product Image *</h3>
        
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-primary/50'
          }`}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {formData.designImageURL ? (
            <div className="relative">
              <img
                src={formData.designImageURL}
                alt="Product preview"
                className="max-h-64 mx-auto rounded-lg"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="mt-4"
                onClick={() => setFormData(prev => ({ ...prev, designImageURL: "" }))}
              >
                <X className="h-4 w-4 mr-2" />
                Remove Image
              </Button>
            </div>
          ) : (
            <>
              <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Drag and drop an image here, or click to select
                </p>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Select Image
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Sizes & Colors */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Available Sizes & Colors *</h3>
        
        <div className="space-y-2">
          <Label>Sizes</Label>
          <div className="flex flex-wrap gap-2">
            {options?.sizes?.map((size: string) => (
              <button
                key={size}
                type="button"
                onClick={() => toggleSize(size)}
                className={`px-4 py-2 rounded-md border transition-colors ${
                  selectedSizes.includes(size)
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background hover:bg-accent'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Colors</Label>
          <div className="flex flex-wrap gap-2">
            {options?.colors?.map((color: string) => (
              <button
                key={color}
                type="button"
                onClick={() => toggleColor(color)}
                className={`px-4 py-2 rounded-md border transition-colors ${
                  selectedColors.includes(color)
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background hover:bg-accent'
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Variants Table */}
      {variants.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Product Variants ({variants.length})</h3>
          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium">Size</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Color</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">SKU</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Price +/-</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Stock</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Final Price</th>
                  </tr>
                </thead>
                <tbody>
                  {variants.map((variant, index) => (
                    <tr key={`${variant.size}-${variant.color}`} className="border-t">
                      <td className="px-4 py-3 font-medium">{variant.size}</td>
                      <td className="px-4 py-3">{variant.color}</td>
                      <td className="px-4 py-3">
                        <Input
                          value={variant.sku}
                          onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                          className="h-9 w-full min-w-[150px]"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Input
                          type="number"
                          step="0.01"
                          value={variant.priceModifier}
                          onChange={(e) => updateVariant(index, 'priceModifier', parseFloat(e.target.value) || 0)}
                          className="h-9 w-24"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Input
                          type="number"
                          value={variant.stockQuantity}
                          onChange={(e) => updateVariant(index, 'stockQuantity', parseInt(e.target.value) || 0)}
                          className="h-9 w-24"
                        />
                      </td>
                      <td className="px-4 py-3 font-medium">
                        ${((parseFloat(formData.basePrice) || 0) + variant.priceModifier).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Base price: ${formData.basePrice || "0.00"} | Price modifier adds/subtracts from base price
          </p>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex justify-end gap-4 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {productId ? "Updating..." : "Creating..."}
            </>
          ) : (
            productId ? "Update Product" : "Create Product"
          )}
        </Button>
      </div>
    </form>
  )
}
