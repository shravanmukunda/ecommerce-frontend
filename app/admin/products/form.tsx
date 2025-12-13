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
import { Upload, X, Image as ImageIcon, Loader2, PlusCircle } from "lucide-react"
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
  // Fixed sizes for t-shirts
  const FIXED_SIZES = ['S', 'M', 'L', 'XL', 'XXL']
  
  // Fixed options for product specifications
  const MATERIAL_OPTIONS = ['Cotton', 'Polyester', 'Cotton Blend', 'Linen', 'Rayon', 'Spandex', 'Bamboo', 'Modal']
  const NECKLINE_OPTIONS = ['Crew Neck', 'V-Neck', 'Scoop Neck', 'Boat Neck', 'Henley', 'Mock Neck', 'Polo Collar']
  const SLEEVE_OPTIONS = ['Short Sleeve', 'Long Sleeve', 'Sleeveless', '3/4 Sleeve', 'Cap Sleeve', 'Raglan']
  const FIT_OPTIONS = ['Regular', 'Slim Fit', 'Relaxed', 'Oversized', 'Athletic Fit', 'Tailored']
  
  // Fetch dropdown options from backend (keeping for backward compatibility)
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
  const [customColor, setCustomColor] = useState('#000000')
  const [colorName, setColorName] = useState('')
  const [showColorPicker, setShowColorPicker] = useState(false)
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
    } else if (selectedSizes.length === 0 || selectedColors.length === 0) {
      // Clear variants if either sizes or colors is empty
      setVariants([])
    }
  }, [selectedSizes, selectedColors, formData.name])

  const generateVariants = () => {
    const newVariants: Variant[] = []
    let counter = 0 // Add counter for uniqueness
    
    for (const size of selectedSizes) {
      for (const color of selectedColors) {
        // Check if variant already exists
        const existing = variants.find(v => v.size === size && v.color === color)
        
        if (existing) {
          newVariants.push(existing)
        } else {
          // Generate SKU automatically with better uniqueness
          const namePart = formData.name.substring(0, 3).toUpperCase() || "TSH"
          const sizePart = size
          // Extract color name without hex code for SKU
          const colorForSKU = color.includes('#') ? color.split(' ')[0] : color
          const colorPart = colorForSKU.substring(0, 3).toUpperCase()
          // Use timestamp + counter + random for better uniqueness
          const timestamp = Date.now().toString().slice(-6)
          const random = Math.random().toString(36).substring(2, 5).toUpperCase()
          const uniqueId = `${timestamp}${counter}${random}`
          
          newVariants.push({
            size,
            color, // Store full color string (name or name with hex)
            sku: `${namePart}-${sizePart}-${colorPart}-${uniqueId}`,
            priceModifier: 0,
            stockQuantity: 0
          })
          counter++
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
  
  const handleAddCustomColor = () => {
    if (colorName.trim()) {
      const newColor = colorName.trim()
      if (!selectedColors.includes(newColor)) {
        setSelectedColors(prev => [...prev, newColor])
      }
      setColorName('')
      setCustomColor('#000000')
      setShowColorPicker(false)
    }
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
        alert("Please fill in all required fields: Product Name, Image, and Base Price")
        return
      }

      if (selectedSizes.length === 0 || selectedColors.length === 0) {
        alert("Please select at least one size and add at least one color")
        return
      }

      // Prepare product input - only include non-empty optional fields
      const productInput: any = {
        name: formData.name,
        description: formData.description || "",
        designImageURL: formData.designImageURL,
        basePrice: parseFloat(formData.basePrice),
        featured: formData.featured || false
      }
      
      // Only add optional fields if they have values
      if (formData.material) productInput.material = formData.material
      if (formData.neckline) productInput.neckline = formData.neckline
      if (formData.sleeveType) productInput.sleeveType = formData.sleeveType
      if (formData.fit) productInput.fit = formData.fit
      if (formData.brand) productInput.brand = formData.brand
      if (formData.category) productInput.category = formData.category
      if (formData.careInstructions) productInput.careInstructions = formData.careInstructions
      if (formData.weight) productInput.weight = parseFloat(formData.weight)

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
        for (let i = 0; i < variants.length; i++) {
          const variant = variants[i]
          const variantInput: any = {
            productID: productIdToUse,
            size: variant.size,
            sku: variant.sku,
            priceModifier: variant.priceModifier || 0,
            stockQuantity: variant.stockQuantity || 0
          }
          
          // Only add color if it exists (not empty)
          if (variant.color) {
            variantInput.color = variant.color
          }
          
          try {
            await createVariant({
              variables: {
                input: variantInput
              }
            })
            console.log(`Variant ${i + 1}/${variants.length} created: ${variant.size} - ${variant.color} (SKU: ${variant.sku})`)
            
            // Small delay to ensure uniqueness in database operations
            if (i < variants.length - 1) {
              await new Promise(resolve => setTimeout(resolve, 100))
            }
          } catch (variantError: any) {
            console.error(`Failed to create variant ${variant.size} - ${variant.color} (SKU: ${variant.sku}):`, variantError)
            
            // Check if it's a duplicate SKU error
            if (variantError.message?.includes('duplicate key') || variantError.message?.includes('idx_product_variants_sku')) {
              throw new Error(`Duplicate SKU detected: ${variant.sku}. This SKU already exists in the database. Please try again or contact support.`)
            }
            
            throw variantError
          }
        }
      }

      // Success - call onSubmit callback
      onSubmit()
    } catch (error: any) {
      console.error("Error saving product:", error)
      
      // Extract more detailed error message
      let errorMessage = "Failed to save product. "
      if (error.graphQLErrors && error.graphQLErrors.length > 0) {
        errorMessage += error.graphQLErrors.map((e: any) => e.message).join(', ')
      } else if (error.message) {
        errorMessage += error.message
      }
      
      alert(errorMessage + "\n\nPlease check the console for more details.")
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
          {/* Material */}
          <div className="space-y-2">
            <Label>Material</Label>
            <div className="flex flex-wrap gap-2">
              {MATERIAL_OPTIONS.map((material) => (
                <button
                  key={material}
                  type="button"
                  onClick={() => handleSelectChange("material", formData.material === material ? "" : material)}
                  className={`px-3 py-2 text-sm rounded-md border transition-all ${
                    formData.material === material
                      ? 'bg-black text-white border-black shadow-md'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                >
                  {material}
                </button>
              ))}
            </div>
            {formData.material && (
              <p className="text-sm text-muted-foreground">
                Selected: {formData.material}
              </p>
            )}
          </div>

          {/* Neckline */}
          <div className="space-y-2">
            <Label>Neckline</Label>
            <div className="flex flex-wrap gap-2">
              {NECKLINE_OPTIONS.map((neckline) => (
                <button
                  key={neckline}
                  type="button"
                  onClick={() => handleSelectChange("neckline", formData.neckline === neckline ? "" : neckline)}
                  className={`px-3 py-2 text-sm rounded-md border transition-all ${
                    formData.neckline === neckline
                      ? 'bg-black text-white border-black shadow-md'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                >
                  {neckline}
                </button>
              ))}
            </div>
            {formData.neckline && (
              <p className="text-sm text-muted-foreground">
                Selected: {formData.neckline}
              </p>
            )}
          </div>

          {/* Sleeve Type */}
          <div className="space-y-2">
            <Label>Sleeve Type</Label>
            <div className="flex flex-wrap gap-2">
              {SLEEVE_OPTIONS.map((sleeve) => (
                <button
                  key={sleeve}
                  type="button"
                  onClick={() => handleSelectChange("sleeveType", formData.sleeveType === sleeve ? "" : sleeve)}
                  className={`px-3 py-2 text-sm rounded-md border transition-all ${
                    formData.sleeveType === sleeve
                      ? 'bg-black text-white border-black shadow-md'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                >
                  {sleeve}
                </button>
              ))}
            </div>
            {formData.sleeveType && (
              <p className="text-sm text-muted-foreground">
                Selected: {formData.sleeveType}
              </p>
            )}
          </div>

          {/* Fit */}
          <div className="space-y-2">
            <Label>Fit</Label>
            <div className="flex flex-wrap gap-2">
              {FIT_OPTIONS.map((fit) => (
                <button
                  key={fit}
                  type="button"
                  onClick={() => handleSelectChange("fit", formData.fit === fit ? "" : fit)}
                  className={`px-3 py-2 text-sm rounded-md border transition-all ${
                    formData.fit === fit
                      ? 'bg-black text-white border-black shadow-md'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                >
                  {fit}
                </button>
              ))}
            </div>
            {formData.fit && (
              <p className="text-sm text-muted-foreground">
                Selected: {formData.fit}
              </p>
            )}
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
        
        {/* Fixed Sizes */}
        <div className="space-y-2">
          <Label>Sizes (Select from standard t-shirt sizes)</Label>
          <div className="flex flex-wrap gap-2">
            {FIXED_SIZES.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => toggleSize(size)}
                className={`px-6 py-3 rounded-md border-2 font-medium transition-all ${
                  selectedSizes.includes(size)
                    ? 'bg-black text-white border-black shadow-md'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
          {selectedSizes.length > 0 && (
            <p className="text-sm text-muted-foreground mt-2">
              ✓ Selected: {selectedSizes.join(', ')}
            </p>
          )}
        </div>

        {/* Custom Color Picker */}
        <div className="space-y-2">
          <Label>Colors (Add custom colors with color picker)</Label>
          
          {/* Selected Colors Display */}
          {selectedColors.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedColors.map((color) => (
                <div
                  key={color}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md"
                >
                  <div
                    className="w-6 h-6 rounded border-2 border-gray-400"
                    style={{ backgroundColor: color.startsWith('#') ? color : undefined }}
                  />
                  <span className="text-sm font-medium">{color}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedColors(prev => prev.filter(c => c !== color))}
                    className="ml-1 text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {/* Add Color Section */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
            {!showColorPicker ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowColorPicker(true)}
                className="w-full"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Custom Color
              </Button>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="colorName">Color Name *</Label>
                    <Input
                      id="colorName"
                      value={colorName}
                      onChange={(e) => setColorName(e.target.value)}
                      placeholder="e.g., Navy Blue, Forest Green"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="colorPicker">Pick Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="colorPicker"
                        type="color"
                        value={customColor}
                        onChange={(e) => setCustomColor(e.target.value)}
                        className="h-10 w-20 cursor-pointer"
                      />
                      <Input
                        value={customColor}
                        onChange={(e) => setCustomColor(e.target.value)}
                        placeholder="#000000"
                        className="flex-1"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Preview</Label>
                    <div
                      className="h-10 rounded border-2 border-gray-400"
                      style={{ backgroundColor: customColor }}
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={handleAddCustomColor}
                    disabled={!colorName.trim()}
                  >
                    Add Color
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowColorPicker(false)
                      setColorName('')
                      setCustomColor('#000000')
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {selectedSizes.length === 0 && selectedColors.length === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mt-4">
            <p className="text-sm text-yellow-800">
              ⚠️ Please select at least one size and add at least one color to generate product variants.
            </p>
          </div>
        )}
      </div>

      {/* Variants Table */}
      {variants.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Product Variants ({variants.length})</h3>
            <div className="bg-green-50 border border-green-200 rounded-md px-3 py-1">
              <p className="text-sm text-green-800">
                ✓ {variants.length} variant{variants.length !== 1 ? 's' : ''} generated
              </p>
            </div>
          </div>
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
                  {variants.map((variant, index) => {
                    // Extract color hex if present
                    const colorHex = variant.color.includes('#') 
                      ? variant.color.match(/#[0-9A-Fa-f]{6}/)?.[0] 
                      : null
                    const colorName = colorHex 
                      ? variant.color.replace(colorHex, '').trim() 
                      : variant.color
                    
                    return (
                      <tr key={`${variant.size}-${variant.color}`} className="border-t">
                        <td className="px-4 py-3 font-medium">{variant.size}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {colorHex && (
                              <div
                                className="w-6 h-6 rounded border-2 border-gray-300 flex-shrink-0"
                                style={{ backgroundColor: colorHex }}
                                title={colorHex}
                              />
                            )}
                            <span>{colorName || variant.color}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Input
                            value={variant.sku}
                            onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                            className="h-9 w-full min-w-[150px]"
                            placeholder="Enter SKU"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <Input
                            type="number"
                            step="0.01"
                            value={variant.priceModifier}
                            onChange={(e) => updateVariant(index, 'priceModifier', parseFloat(e.target.value) || 0)}
                            className="h-9 w-24"
                            placeholder="0.00"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <Input
                            type="number"
                            value={variant.stockQuantity}
                            onChange={(e) => updateVariant(index, 'stockQuantity', parseInt(e.target.value) || 0)}
                            className="h-9 w-24"
                            placeholder="0"
                          />
                        </td>
                        <td className="px-4 py-3 font-medium">
                          ${((parseFloat(formData.basePrice) || 0) + variant.priceModifier).toFixed(2)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <p className="text-sm text-blue-800">
              <strong>Base price:</strong> ${formData.basePrice || "0.00"}
              <span className="mx-2">|</span>
              <strong>Tip:</strong> Price modifier adds/subtracts from base price. Use positive values for larger sizes (+$2) or negative for discounts (-$5).
            </p>
          </div>
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
