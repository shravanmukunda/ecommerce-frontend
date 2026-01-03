"use client"

import { useState, useCallback, useEffect, useRef } from "react"
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
import { Upload, X, Image as ImageIcon, Loader2, PlusCircle, ChevronLeft, ChevronRight } from "lucide-react"
import { GET_PRODUCT, GET_PRODUCTS } from "@/graphql/product-queries"
import { CREATE_PRODUCT, UPDATE_PRODUCT, CREATE_PRODUCT_VARIANT, UPDATE_INVENTORY } from "@/graphql/product-mutations"
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
  imageURLs?: string[]
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
  limitedEdition?: boolean
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
  id?: string  // Optional: only present for existing variants
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
  const { data: productData, loading: productLoading, refetch: refetchProduct } = useQuery<GetProductResponse>(GET_PRODUCT, {
    variables: { id: productId },
    skip: !productId,
    fetchPolicy: 'cache-and-network' // Always fetch fresh data when needed
  })

  const [createProduct, { loading: creating }] = useMutation<CreateProductResponse>(CREATE_PRODUCT)
  const [updateProduct, { loading: updating }] = useMutation<GetProductResponse>(UPDATE_PRODUCT)
  const [createVariant] = useMutation(CREATE_PRODUCT_VARIANT)
  const [updateInventory] = useMutation(UPDATE_INVENTORY)
  // Note: We refetch queries manually after all updates complete to avoid resetting form state
  // during the update process

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    designImageURL: "",
    imageURLs: [] as string[],
    basePrice: "",
    brand: "",
    category: "",
    material: "",
    neckline: "",
    sleeveType: "",
    fit: "",
    weight: "",
    careInstructions: "",
    featured: false,
    limitedEdition: false,
    isActive: true  // Product status (active/inactive)
  })

  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [customColor, setCustomColor] = useState('#000000')
  const [colorName, setColorName] = useState('')
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [variants, setVariants] = useState<Variant[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [variantsLoaded, setVariantsLoaded] = useState(false) // Track if variants were loaded from product data

  // Load product data when editing
  useEffect(() => {
    // Don't reload if we're in the middle of an update
    if (isUpdatingRef.current) {
      return
    }
    
    // Don't reload if variants were already loaded (prevents double-loading)
    if (variantsLoaded && productId) {
      return
    }
    
    if (productData?.product) {
      const p = productData.product
      // Support both old single image and new multiple images
      const images = p.imageURLs && p.imageURLs.length > 0 
        ? p.imageURLs 
        : (p.designImageURL ? [p.designImageURL] : [])
      
      setFormData({
        name: p.name || "",
        description: p.description || "",
        designImageURL: p.designImageURL || "",
        imageURLs: images,
        basePrice: p.basePrice?.toString() || "",
        brand: p.brand || "",
        category: p.category || "",
        material: p.material || "",
        neckline: p.neckline || "",
        sleeveType: p.sleeveType || "",
        fit: p.fit || "",
        weight: p.weight?.toString() || "",
        careInstructions: p.careInstructions || "",
        featured: p.featured || false,
        limitedEdition: p.limitedEdition || false,
        isActive: p.isActive !== undefined ? p.isActive : true
      })

      // Extract unique sizes and colors from variants
      if (p.variants && p.variants.length > 0) {
        const sizes = [...new Set(p.variants.map((v: any) => v.size))] as string[]
        const colors = [...new Set(p.variants.map((v: any) => v.color).filter(Boolean))] as string[]
        
        // Map variants - include ID for existing variants
        const mappedVariants = p.variants.map((v: any) => {
          // Try multiple ways to get stock quantity in case the structure varies
          let stockQuantity = 0
          
          if (v.inventory) {
            if (typeof v.inventory === 'object' && v.inventory !== null) {
              // Direct access to stockQuantity from inventory object
              stockQuantity = v.inventory.stockQuantity ?? v.inventory.stock_quantity ?? 0
            } else if (typeof v.inventory === 'number') {
              stockQuantity = v.inventory
            }
          }
          
          // Fallback: check if stockQuantity is directly on the variant
          if (stockQuantity === 0 && v.stockQuantity !== undefined) {
            stockQuantity = v.stockQuantity
          }
          
          return {
            id: v.id,  // Store variant ID for existing variants
            size: v.size,
            color: v.color || "",
            sku: v.sku,
            priceModifier: v.priceModifier,
            stockQuantity: stockQuantity
          }
        })
        
        // IMPORTANT: Set variants FIRST before sizes/colors to prevent regeneration
        // Use a ref to prevent the regenerate useEffect from running
        initialLoadRef.current = false
        setVariants(mappedVariants)
        setVariantsLoaded(true) // Mark that variants were loaded from product data
        
        // Then set sizes and colors - this will trigger the useEffect but it should be blocked
        setSelectedSizes(sizes)
        setSelectedColors(colors)
        
        // Mark initial load as complete AFTER setting variants
        setTimeout(() => {
          initialLoadRef.current = true
          previousSizesRef.current = [...sizes]
          previousColorsRef.current = [...colors]
        }, 0)
      }
    }
  }, [productData, productId, variantsLoaded])

  // Auto-generate variants when sizes or colors change
  // Use a ref to track if this is the initial load from product data
  const initialLoadRef = useRef(false)
  const isUpdatingRef = useRef(false) // Track if we're in the middle of an update
  const previousSizesRef = useRef<string[]>([])
  const previousColorsRef = useRef<string[]>([])
  
  useEffect(() => {
    // Don't regenerate variants if we're in the middle of updating
    if (isUpdatingRef.current) {
      return
    }
    
    // Skip auto-generation on initial load if we're editing and variants were already loaded
    // This prevents overwriting existing variants with IDs on initial load
    if (variantsLoaded && productId && !initialLoadRef.current) {
      initialLoadRef.current = true
      previousSizesRef.current = [...selectedSizes]
      previousColorsRef.current = [...selectedColors]
      return
    }
    
    // Only regenerate if sizes or colors actually changed
    const sizesChanged = JSON.stringify(previousSizesRef.current.sort()) !== JSON.stringify(selectedSizes.sort())
    const colorsChanged = JSON.stringify(previousColorsRef.current.sort()) !== JSON.stringify(selectedColors.sort())
    
    if (!sizesChanged && !colorsChanged) {
      return // No change, don't regenerate
    }
    
    // Update refs
    previousSizesRef.current = [...selectedSizes]
    previousColorsRef.current = [...selectedColors]
    
    // After initial load, allow regeneration when user changes sizes/colors
    if (selectedSizes.length > 0 && selectedColors.length > 0) {
      generateVariants()
    } else if (selectedSizes.length === 0 || selectedColors.length === 0) {
      // Clear variants if either sizes or colors is empty
      setVariants([])
    }
  }, [selectedSizes, selectedColors]) // Removed formData.name to prevent unnecessary regeneration

  const generateVariants = () => {
    // Use functional update to ensure we're working with the latest variants state
    setVariants(currentVariants => {
      const newVariants: Variant[] = []
      let counter = 0 // Add counter for uniqueness
      
      for (const size of selectedSizes) {
        for (const color of selectedColors) {
          // Check if variant already exists - preserve all its data including ID
          // Match by both size and color (exact match), or by ID if present
          const existing = currentVariants.find(v => {
            // First try to match by ID if both have IDs
            if (v.id && v.size === size && v.color === color) {
              return true
            }
            // Fallback to size+color match
            return v.size === size && v.color === color
          })
          
          if (existing) {
            // Preserve the entire existing variant (including ID, SKU, priceModifier, stockQuantity)
            // This ensures user's stock quantity changes are preserved
            newVariants.push({ 
              ...existing,
              // Ensure stockQuantity is preserved (don't reset to 0)
              stockQuantity: existing.stockQuantity ?? 0
            })
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
      
      return newVariants
    })
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
    
    if (files.length > 0) {
      // Handle multiple files
      const readers = files.map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.onloadend = () => {
            resolve(reader.result as string)
          }
          reader.readAsDataURL(file)
        })
      })
      
      Promise.all(readers).then((imageDataUrls) => {
        setFormData(prev => ({
          ...prev,
          imageURLs: [...prev.imageURLs, ...imageDataUrls],
          designImageURL: prev.designImageURL || imageDataUrls[0] // Keep first as main for backward compatibility
        }))
      })
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      // Handle multiple files
      const fileArray = Array.from(files)
      const readers = fileArray.map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.onloadend = () => {
            resolve(reader.result as string)
          }
          reader.readAsDataURL(file)
        })
      })
      
      Promise.all(readers).then((imageDataUrls) => {
        setFormData(prev => ({
          ...prev,
          imageURLs: [...prev.imageURLs, ...imageDataUrls],
          designImageURL: prev.designImageURL || imageDataUrls[0] // Keep first as main for backward compatibility
        }))
      })
    }
  }
  
  const removeImage = (index: number) => {
    setFormData(prev => {
      const newImageURLs = prev.imageURLs.filter((_, i) => i !== index)
      return {
        ...prev,
        imageURLs: newImageURLs,
        designImageURL: newImageURLs.length > 0 ? newImageURLs[0] : ""
      }
    })
  }
  
  const reorderImages = (fromIndex: number, toIndex: number) => {
    setFormData(prev => {
      const newImageURLs = [...prev.imageURLs]
      const [removed] = newImageURLs.splice(fromIndex, 1)
      newImageURLs.splice(toIndex, 0, removed)
      return {
        ...prev,
        imageURLs: newImageURLs,
        designImageURL: newImageURLs[0] || ""
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Set flag to prevent useEffect from resetting variants during update
    isUpdatingRef.current = true
    
    try {
      // Validate required fields
      if (!formData.name || (formData.imageURLs.length === 0 && !formData.designImageURL) || !formData.basePrice) {
        alert("Please fill in all required fields: Product Name, At least one Image, and Base Price")
        return
      }

      if (selectedSizes.length === 0 || selectedColors.length === 0) {
        alert("Please select at least one size and add at least one color")
        return
      }

      // Prepare product input - only include non-empty optional fields
      // Use imageURLs if available, otherwise fall back to designImageURL for backward compatibility
      const images = formData.imageURLs.length > 0 ? formData.imageURLs : (formData.designImageURL ? [formData.designImageURL] : [])
      
      const productInput: any = {
        name: formData.name,
        description: formData.description || "",
        designImageURL: images[0] || formData.designImageURL, // Keep for backward compatibility
        basePrice: parseFloat(formData.basePrice),
        featured: formData.featured || false
      }
      
      // Add imageURLs array if we have multiple images
      if (formData.imageURLs.length > 0) {
        productInput.imageURLs = formData.imageURLs
      }
      
      // Add limitedEdition flag
      productInput.limitedEdition = formData.limitedEdition || false
      
      // Note: isActive may not be in ProductInput schema
      // It may be set via separate mutations or set automatically by backend
      
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
        // Don't refetch immediately - let inventory updates complete first
        const { data } = await updateProduct({
          variables: { id: productId, input: productInput }
          // Removed refetchQueries to prevent resetting variants during update
        })
      } else {
        // Create new product
        const { data } = await createProduct({
          variables: { input: productInput },
          refetchQueries: ['GetProducts']
        })
        productIdToUse = data?.createProduct.id
      }

      // Create or update variants
      if (productIdToUse) {
        let updatedCount = 0
        let createdCount = 0
        let errorCount = 0
        const errors: string[] = []
        
        // First, update all existing variants' inventory
        for (let i = 0; i < variants.length; i++) {
          const variant = variants[i]
          
          // If variant has an ID, it's an existing variant - update inventory
          if (variant.id) {
            try {
              // Ensure we capture the stock quantity correctly
              let quantity: number
              if (typeof variant.stockQuantity === 'number') {
                quantity = variant.stockQuantity
              } else if (typeof variant.stockQuantity === 'string') {
                const parsed = parseInt(variant.stockQuantity, 10)
                quantity = isNaN(parsed) ? 0 : parsed
              } else {
                quantity = 0
              }
              
              // Ensure quantity is non-negative
              if (quantity < 0) {
                quantity = 0
              }
              
              // Validate that we have a valid variant ID
              if (!variant.id || variant.id === 'undefined' || variant.id === 'null') {
                throw new Error(`Invalid variant ID for ${variant.size} - ${variant.color}`)
              }
              
              const result = await updateInventory({
                variables: {
                  variantID: variant.id,
                  quantity: quantity
                }
              })
              
              // Type assertion for the response
              const inventoryData = (result.data as any)?.updateInventory
              if (inventoryData) {
                updatedCount++
              } else {
                errorCount++
                const errorMsg = `Variant ${variant.size} - ${variant.color}: Update returned no data`
                errors.push(errorMsg)
              }
            } catch (inventoryError: any) {
              errorCount++
              const errorMsg = `Variant ${variant.size} - ${variant.color}: ${inventoryError.message || 'Unknown error'}`
              errors.push(errorMsg)
              // Continue with other variants, but collect errors
            }
          }
        }
        
        // Then, create new variants (those without IDs)
        for (let i = 0; i < variants.length; i++) {
          const variant = variants[i]
          
          if (!variant.id) {
            // New variant - create it
            // Ensure stock quantity is properly parsed
            let stockQuantity: number
            if (typeof variant.stockQuantity === 'number') {
              stockQuantity = variant.stockQuantity
            } else if (typeof variant.stockQuantity === 'string') {
              const parsed = parseInt(variant.stockQuantity, 10)
              stockQuantity = isNaN(parsed) ? 0 : parsed
            } else {
              stockQuantity = 0
            }
            
            // Ensure quantity is non-negative
            if (stockQuantity < 0) {
              stockQuantity = 0
            }
            
            const variantInput: any = {
              productID: productIdToUse,
              size: variant.size,
              sku: variant.sku,
              priceModifier: variant.priceModifier || 0,
              stockQuantity: stockQuantity
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
              createdCount++
              
              // Small delay to ensure uniqueness in database operations
              if (i < variants.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 100))
              }
            } catch (variantError: any) {
              errorCount++
              const errorMsg = `Variant ${variant.size} - ${variant.color}: ${variantError.message || 'Unknown error'}`
              errors.push(errorMsg)
              
              // Check if it's a duplicate SKU error
              if (variantError.message?.includes('duplicate key') || variantError.message?.includes('idx_product_variants_sku')) {
                throw new Error(`Duplicate SKU detected: ${variant.sku}. This SKU already exists in the database. Please try again or contact support.`)
              }
            }
          }
        }
        
        if (errorCount > 0) {
          // Don't proceed if there were critical errors
          if (updatedCount === 0 && createdCount === 0) {
            throw new Error(`Failed to save any variants: ${errors.join(', ')}`)
          }
        }
        
        // Refetch product data after all updates are complete to ensure we have the latest data
        if (productId && (updatedCount > 0 || createdCount > 0)) {
          try {
            // Wait a moment for backend to process all updates
            await new Promise(resolve => setTimeout(resolve, 500))
            
            // Explicitly refetch the product to get latest inventory data
            if (refetchProduct) {
              const { data: freshData } = await refetchProduct({ fetchPolicy: 'network-only' })
              
              // Check if inventory is missing
              const variantsWithMissingInventory = freshData?.product?.variants?.filter((v: any) => {
                const hasInventory = !!v.inventory
                const hasStockQuantity = v.inventory?.stockQuantity !== undefined
                return !hasInventory || !hasStockQuantity
              })
              
              if (variantsWithMissingInventory && variantsWithMissingInventory.length > 0) {
                // Some variants may have missing inventory data - this is a backend issue
                // Continue processing with available data
              } else {
                // Reload variants with fresh inventory data if we're still on the edit page
                // This ensures the form shows the updated stock quantities
                if (freshData?.product?.variants && freshData.product.variants.length > 0) {
                  const sizes = [...new Set(freshData.product.variants.map((v: any) => v.size))] as string[]
                  const colors = [...new Set(freshData.product.variants.map((v: any) => v.color).filter(Boolean))] as string[]
                  
                  const updatedVariants = freshData.product.variants.map((v: any) => {
                    const stockQuantity = v.inventory?.stockQuantity ?? 0
                    return {
                      id: v.id,
                      size: v.size,
                      color: v.color || "",
                      sku: v.sku,
                      priceModifier: v.priceModifier,
                      stockQuantity: stockQuantity
                    }
                  })
                  
                  // Update variants without triggering regeneration
                  initialLoadRef.current = true
                  setVariants(updatedVariants)
                  setSelectedSizes(sizes)
                  setSelectedColors(colors)
                  previousSizesRef.current = [...sizes]
                  previousColorsRef.current = [...colors]
                }
              }
            }
          } catch (refetchError) {
            // Don't fail the whole operation if refetch fails
          }
        }
      }

      // Success - call onSubmit callback
      // Reset the flag after a delay to allow any refetches to complete
      setTimeout(() => {
        isUpdatingRef.current = false
      }, 1500)
      
      onSubmit()
    } catch (error: any) {
      // Reset the flag on error
      isUpdatingRef.current = false
      
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
      {/* Step 1: Create Base Product */}
      <div className="space-y-4 border-b pb-8">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black text-white font-bold text-sm">1</div>
          <h3 className="text-lg font-semibold">Create Base Product</h3>
          <span className="text-xs text-muted-foreground">(No stock here - just the product shell)</span>
        </div>
        
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
            <Label htmlFor="basePrice">Base Price (₹) *</Label>
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

        {/* Product Status */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="isActive"
            checked={formData.isActive}
            onCheckedChange={(checked) => 
              setFormData(prev => ({ ...prev, isActive: checked as boolean }))
            }
          />
          <Label htmlFor="isActive" className="cursor-pointer">
            Product is Active (visible to customers)
          </Label>
        </div>
      </div>

      {/* Product Specifications (Optional) */}
      <div className="space-y-4 border-b pb-8">
        <h3 className="text-lg font-semibold">Product Specifications (Optional)</h3>
        
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

          <div className="flex items-center space-x-6 pt-8">
            <div className="flex items-center space-x-2">
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
            <div className="flex items-center space-x-2">
              <Checkbox
                id="limitedEdition"
                checked={formData.limitedEdition}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, limitedEdition: checked as boolean }))
                }
              />
              <Label htmlFor="limitedEdition" className="cursor-pointer">
                Limited Edition
              </Label>
            </div>
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

      {/* Product Images */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Product Images *</h3>
        <p className="text-sm text-muted-foreground">Upload multiple images to create a slideshow on the product page</p>
        
        {/* Image Gallery */}
        {formData.imageURLs.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {formData.imageURLs.map((imageUrl, index) => (
              <div key={index} className="relative group">
                <div className="relative aspect-square overflow-hidden rounded-lg border-2 border-gray-300">
                  <img
                    src={imageUrl}
                    alt={`Product image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {index === 0 && (
                    <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      Main
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-lg">
                  {index > 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => reorderImages(index, index - 1)}
                      className="text-white hover:bg-white/20"
                      title="Move left"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeImage(index)}
                    className="text-white"
                    title="Remove image"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  {index < formData.imageURLs.length - 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => reorderImages(index, index + 1)}
                      className="text-white hover:bg-white/20"
                      title="Move right"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Upload Area */}
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
          <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Drag and drop images here, or click to select multiple images
            </p>
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
              multiple
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              {formData.imageURLs.length > 0 ? "Add More Images" : "Select Images"}
            </Button>
            {formData.imageURLs.length > 0 && (
              <p className="text-xs text-muted-foreground mt-2">
                {formData.imageURLs.length} image{formData.imageURLs.length !== 1 ? 's' : ''} uploaded. First image will be used as the main product image.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Step 2: Add Attributes (Options) */}
      <div className="space-y-4 border-b pb-8">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black text-white font-bold text-sm">2</div>
          <h3 className="text-lg font-semibold">Add Attributes (Options)</h3>
          <span className="text-xs text-muted-foreground">(Define what can vary - still no stock)</span>
        </div>
        
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
        
        {selectedSizes.length > 0 && selectedColors.length > 0 && variants.length === 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mt-4">
            <p className="text-sm text-blue-800">
              💡 <strong>Step 3:</strong> Variants will be auto-generated when you save. Each combination of size and color becomes one variant with its own stock.
            </p>
          </div>
        )}
      </div>

      {/* Step 3 & 4: Variants Table */}
      {variants.length > 0 && (
        <div className="space-y-4 border-b pb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black text-white font-bold text-sm">3</div>
              <h3 className="text-lg font-semibold">Generated Variants ({variants.length})</h3>
              <span className="text-xs text-muted-foreground">(Auto-generated from size/color combinations)</span>
            </div>
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
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Stock Quantity *
                      <span className="text-xs font-normal text-muted-foreground block">(Per variant only)</span>
                    </th>
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
                    
                    // Use variant ID if available, otherwise use SKU, or fallback to index
                    // This ensures unique keys even if size+color combination is duplicated
                    const uniqueKey = variant.id || variant.sku || `variant-${index}`
                    
                    return (
                      <tr key={uniqueKey} className="border-t">
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
                            value={variant.stockQuantity === 0 ? 0 : variant.stockQuantity}
                            onChange={(e) => {
                              const value = e.target.value
                              // Allow empty string temporarily while user is typing
                              if (value === '' || value === '-') {
                                updateVariant(index, "stockQuantity", 0)
                              } else {
                                const numValue = parseInt(value, 10)
                                if (!isNaN(numValue) && numValue >= 0) {
                                  updateVariant(index, "stockQuantity", numValue)
                                }
                              }
                            }}
                            onBlur={(e) => {
                              // Ensure we always have a valid number when field loses focus
                              const value = e.target.value
                              const numValue = parseInt(value, 10)
                              if (isNaN(numValue) || numValue < 0) {
                                updateVariant(index, "stockQuantity", 0)
                              }
                            }}
                            className="h-9 w-24"
                            placeholder="0"
                            min="0"
                          />
                        </td>
                        <td className="px-4 py-3 font-medium">
                          ₹{((parseFloat(formData.basePrice) || 0) + variant.priceModifier).toFixed(2)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs">4</div>
              <strong className="text-sm text-blue-800">Step 4: Add Stock Per Variant (NOT product-level)</strong>
            </div>
            <p className="text-sm text-blue-800 ml-8">
              Each variant has its own stock quantity. Set stock for each size/color combination individually.
              <br />
              <strong>Base price:</strong> ₹{formData.basePrice || "0.00"}
              <span className="mx-2">|</span>
              <strong>Tip:</strong> Price modifier adds/subtracts from base price. Use positive values for larger sizes (+₹2) or negative for discounts (-₹5).
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
