# Product Management Guide

Complete guide for adding, editing, and deleting products in the admin dashboard.

---

## Features Overview

### ✅ Add Product
- Click "Add Product" button on admin dashboard
- Comprehensive form with all product fields
- Automatic variant generation
- Image upload support
- Form validation

### ✅ Edit Product  
- Click "Edit" button on any product card
- Pre-populated form with existing data
- Update all product details and variants
- Changes saved to backend via GraphQL

### ✅ Delete Product
- Click "Delete" button on any product card
- Confirmation dialog before deletion
- Removes product, variants, and inventory
- Automatic refresh of product list

---

## Adding a New Product

### Step 1: Navigate to Add Product
1. Go to Admin Dashboard (`/admin`)
2. Scroll to "Product Management" section
3. Click "Add Product" button

### Step 2: Fill Basic Information
**Required Fields:**
- **Product Name** - e.g., "Classic Cotton Crew Neck"
- **Base Price** - e.g., 29.99
- **Product Image** - Drag & drop or select file

**Optional Fields:**
- Description
- Brand
- Category

### Step 3: Product Specifications
Select from dropdowns (loaded from backend):
- **Material** - Cotton, Polyester, Blend, etc.
- **Neckline** - Crew Neck, V-Neck, etc.
- **Sleeve Type** - Short Sleeve, Long Sleeve, etc.
- **Fit** - Regular, Slim, Oversized, etc.
- Weight (grams)
- Care Instructions
- Featured (checkbox)

### Step 4: Select Sizes & Colors
**Sizes:** Select one or more from available options
- XS, S, M, L, XL, XXL, XXXL

**Colors:** Select one or more from available options
- Black, White, Navy, Gray, Red, etc.

**Automatic Variant Generation:**
- System automatically creates variants for each size/color combination
- Example: If you select [S, M, L] and [Black, White], you get 6 variants

### Step 5: Configure Variants
For each generated variant, you can set:
- **SKU** - Auto-generated, but editable (e.g., "CLA-S-BLA-1234")
- **Price Modifier** - Add/subtract from base price (+5.00, -2.00, etc.)
- **Stock Quantity** - Initial inventory count
- **Final Price** - Calculated automatically (Base Price + Modifier)

### Step 6: Submit
1. Review all details
2. Click "Create Product"
3. System creates:
   - Product record
   - All variant records
   - Inventory records for each variant
4. Redirects to admin dashboard
5. Product list automatically refreshes

---

## Editing an Existing Product

### Step 1: Access Edit Form
1. Go to Admin Dashboard
2. Find product in Product Management section
3. Click "Edit" button on product card

### Step 2: Update Information
- All fields are pre-populated with current data
- Modify any field as needed
- Add/remove sizes and colors
- Update variant details

### Step 3: Save Changes
1. Click "Update Product"
2. System updates:
   - Product details
   - Variants (creates new ones if needed)
   - Inventory levels
3. Redirects back to admin dashboard

**Note:** Currently, removing sizes/colors won't delete existing variants. You may need to manually manage variants through the database if you need to remove them.

---

## Deleting a Product

### Step 1: Initiate Delete
1. Go to Admin Dashboard
2. Find product in Product Management section
3. Click red "Delete" button

### Step 2: Confirm Deletion
A confirmation dialog appears:
- **Title:** "Delete Product"
- **Message:** Warning about permanent deletion
- **Warning:** All variants and inventory will be deleted

### Step 3: Confirm or Cancel
- Click "Cancel" to abort
- Click "Delete" to proceed

### Step 4: Deletion Process
1. System calls `DELETE_PRODUCT` mutation
2. Backend deletes:
   - Product record
   - All associated variants
   - All inventory records
3. Product list automatically refreshes
4. Product disappears from dashboard

---

## GraphQL Operations

### Create Product
```graphql
mutation CreateProduct($input: ProductInput!) {
  createProduct(input: $input) {
    id
    name
    basePrice
    # ... other fields
  }
}
```

**Input Example:**
```json
{
  "input": {
    "name": "Classic Cotton T-Shirt",
    "description": "Comfortable cotton tee",
    "designImageURL": "https://...",
    "basePrice": 29.99,
    "material": "Cotton",
    "neckline": "Crew Neck",
    "sleeveType": "Short Sleeve",
    "fit": "Regular",
    "brand": "MyBrand",
    "category": "Casual",
    "careInstructions": "Machine wash cold",
    "weight": 180,
    "featured": false
  }
}
```

### Create Variants
```graphql
mutation CreateVariant($input: ProductVariantInput!) {
  createProductVariant(input: $input) {
    id
    sku
    size
    color
    price
    inventory {
      stockQuantity
      availableQuantity
    }
  }
}
```

**Input Example:**
```json
{
  "input": {
    "productID": "123",
    "size": "M",
    "color": "Black",
    "sku": "TSH-M-BLA-5678",
    "priceModifier": 0,
    "stockQuantity": 100
  }
}
```

### Update Product
```graphql
mutation UpdateProduct($id: ID!, $input: ProductInput!) {
  updateProduct(id: $id, input: $input) {
    id
    name
    # ... other fields
  }
}
```

### Delete Product
```graphql
mutation DeleteProduct($id: ID!) {
  deleteProduct(id: $id)
}
```

---

## Validation Rules

### Product Name
- Required
- 1-200 characters
- Must be unique (recommended)

### Base Price
- Required
- Must be > 0
- Decimal format (e.g., 29.99)

### Image
- Required
- Valid URL or base64 data
- **Recommendation:** Use cloud storage (S3, Cloudinary)

### Sizes & Colors
- At least 1 size required
- At least 1 color required
- Generates Size × Color variants

### Variants
- Each variant must have unique SKU
- Stock quantity must be >= 0
- Price modifier can be positive or negative

---

## Best Practices

### Product Names
✅ **Good:**
- "Classic Cotton Crew Neck T-Shirt"
- "Premium V-Neck Tee"
- "Graphic Print Streetwear Tee"

❌ **Avoid:**
- "Tshirt" (too generic)
- "Product 123" (not descriptive)

### Pricing Strategy
- **Base Price:** Set to most common variant price
- **Price Modifiers:** 
  - +$2-5 for larger sizes (XL, XXL, XXXL)
  - +$0-3 for premium colors
  - $0 for standard sizes/colors

### SKU Format
Auto-generated format: `PREFIX-SIZE-COLOR-RANDOM`
- **PREFIX:** First 3 letters of product name
- **SIZE:** Full size code (S, M, L, XL, etc.)
- **COLOR:** First 3 letters of color
- **RANDOM:** 4-digit unique identifier

Example: `CLA-M-BLA-1234` for Classic tee, Medium, Black

### Inventory Management
- Set realistic initial stock quantities
- Monitor `availableQuantity` (stockQuantity - reservedQuantity)
- Restock when availableQuantity < 10

### Images
**Current Implementation:**
- Converts to base64 for storage
- Works for testing/development

**Production Recommendation:**
1. Upload to cloud storage (AWS S3, Cloudinary, etc.)
2. Store URL in `designImageURL`
3. Benefits:
   - Faster loading
   - Better performance
   - CDN support
   - Image optimization

---

## Troubleshooting

### "Failed to create product"
**Possible causes:**
- Missing required fields (name, image, price)
- Invalid price format
- No sizes or colors selected
- Backend connection issue

**Solutions:**
1. Check all required fields are filled
2. Ensure price is a valid number
3. Select at least 1 size and 1 color
4. Check browser console for specific error

### "Failed to delete product"
**Possible causes:**
- Product doesn't exist
- Backend permission issue
- Network error

**Solutions:**
1. Refresh page and try again
2. Check if product still exists
3. Verify admin permissions
4. Check network connection

### Variants not generating
**Possible causes:**
- No sizes selected
- No colors selected
- Only selected one of sizes/colors

**Solution:**
- Must select at least 1 size AND 1 color
- System needs both to create variants

### Image not uploading
**Possible causes:**
- File too large (>5MB recommended)
- Invalid file type (must be image)
- Browser restriction

**Solutions:**
1. Resize image to < 2MB
2. Use JPG, PNG, or WebP format
3. Try drag-and-drop instead of file select

---

## UI Components

### Product Card (List View)
```
┌─────────────────────┐
│                     │
│   Product Image     │
│                     │
├─────────────────────┤
│ Product Name        │
│ $29.99              │
├─────────────────────┤
│ [View] [Edit] [Del] │
└─────────────────────┘
```

### Delete Confirmation Dialog
```
┌──────────────────────────────┐
│ Delete Product               │
├──────────────────────────────┤
│ Are you sure you want to     │
│ delete this product?         │
│                              │
│ This action cannot be undone.│
│ All variants and inventory   │
│ will also be deleted.        │
├──────────────────────────────┤
│         [Cancel]  [Delete]   │
└──────────────────────────────┘
```

---

## Future Enhancements

### Planned Features
1. **Bulk Operations**
   - Delete multiple products
   - Update prices in bulk
   - Export/import products

2. **Product Duplication**
   - Clone existing product
   - Quick create similar products

3. **Advanced Variant Management**
   - Delete individual variants
   - Bulk update variant prices
   - Variant-specific images

4. **Image Gallery**
   - Multiple images per product
   - Image cropping/editing
   - Direct cloud upload

5. **Product Categories**
   - Category management
   - Category-based filtering
   - Category hierarchy

6. **Product Reviews**
   - Customer reviews
   - Rating system
   - Review moderation

---

## API Reference

### Product Object
```typescript
interface Product {
  id: ID
  name: string
  description: string
  designImageURL: string
  basePrice: number
  isActive: boolean
  material: string
  neckline: string
  sleeveType: string
  fit: string
  brand: string
  category: string
  careInstructions: string
  weight: number
  featured: boolean
  variants: ProductVariant[]
  createdAt: string
}
```

### ProductVariant Object
```typescript
interface ProductVariant {
  id: ID
  productID: ID
  size: string
  color: string
  priceModifier: number
  sku: string
  price: number  // calculated: basePrice + priceModifier
  inventory: Inventory
  product: Product
}
```

### Inventory Object
```typescript
interface Inventory {
  id: ID
  variantID: ID
  stockQuantity: number
  reservedQuantity: number
  availableQuantity: number  // calculated: stockQuantity - reservedQuantity
}
```

---

## Summary

The product management system provides a complete CRUD interface for managing t-shirt products:

✅ **Add** - Comprehensive form with all fields and automatic variant generation  
✅ **View** - Product cards with images and quick actions  
✅ **Edit** - Full editing capability with pre-populated data  
✅ **Delete** - Safe deletion with confirmation dialog  

All operations are connected to the GraphQL backend with proper error handling and user feedback.
