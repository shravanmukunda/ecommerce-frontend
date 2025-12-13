# Troubleshooting Guide - Product Creation Errors

## Common Error: "the requested element is null which the schema does not allow"

### What This Means
The GraphQL backend schema doesn't accept `null` values for certain fields, but the frontend was trying to send `null` for optional fields.

### ✅ Fixed!
The product form has been updated to only send fields that have actual values, preventing null values from being sent to the backend.

---

## How It Works Now

### Before (Caused Error)
```javascript
// Sent ALL fields, including nulls
{
  name: "T-Shirt",
  basePrice: 29.99,
  material: null,        // ❌ Backend rejects null
  neckline: null,        // ❌ Backend rejects null
  sleeveType: null,      // ❌ Backend rejects null
  fit: null,             // ❌ Backend rejects null
  brand: null,           // ❌ Backend rejects null
  category: null         // ❌ Backend rejects null
}
```

### After (Works Correctly)
```javascript
// Only sends fields with values
{
  name: "T-Shirt",
  basePrice: 29.99,
  description: "",
  featured: false
  // Optional fields omitted if empty
}

// Or with some optional fields:
{
  name: "T-Shirt",
  basePrice: 29.99,
  description: "Premium cotton",
  material: "Cotton",    // ✅ Only sent if filled
  brand: "MyBrand",      // ✅ Only sent if filled
  featured: false
}
```

---

## Validation Logic

### Required Fields
The form **requires** these fields before submission:
1. ✅ **Product Name** - Cannot be empty
2. ✅ **Base Price** - Must be a number > 0
3. ✅ **Product Image** - Must upload or provide URL
4. ✅ **At least 1 Size** - Must select from S, M, L, XL, XXL
5. ✅ **At least 1 Color** - Must add custom color

### Optional Fields (Only Sent If Filled)
- Material (Cotton, Polyester, etc.)
- Neckline (Crew Neck, V-Neck, etc.)
- Sleeve Type (Short Sleeve, Long Sleeve, etc.)
- Fit (Regular, Slim, Oversized, etc.)
- Brand
- Category
- Care Instructions
- Weight (in grams)
- Description

### Always Sent (With Defaults)
- `description` → Defaults to `""` (empty string)
- `featured` → Defaults to `false`

---

## Error Messages

### User-Friendly Alerts

**Missing Required Fields:**
```
Please fill in all required fields: Product Name, Image, and Base Price
```

**Missing Sizes/Colors:**
```
Please select at least one size and add at least one color
```

**Backend GraphQL Error:**
```
Failed to save product. [Specific error message from backend]

Please check the console for more details.
```

---

## Debugging Steps

### If You Still Get Errors:

#### Step 1: Check Required Fields
```
✓ Product name filled?
✓ Base price filled (number)?
✓ Image uploaded or URL provided?
✓ At least 1 size selected?
✓ At least 1 color added?
```

#### Step 2: Check Browser Console
```
1. Open Developer Tools (F12)
2. Go to Console tab
3. Look for detailed error messages
4. Check what data was sent:
   - Look for "Product created:" or "Error saving product:"
```

#### Step 3: Verify Data Being Sent
The console will show exactly what was sent:
```javascript
// Check console output
console.log("Product created:", data)  // Success
// or
console.error("Error saving product:", error)  // Error
```

#### Step 4: Check Network Tab
```
1. Open Network tab in Dev Tools
2. Filter by "Fetch/XHR"
3. Look for GraphQL request
4. Check:
   - Request Payload (what was sent)
   - Response (what backend returned)
```

---

## Backend Schema Requirements

### ProductInput Type
Based on your backend schema, this is what's expected:

```graphql
input ProductInput {
  name: String!              # Required
  description: String        # Optional (now sends "" if empty)
  designImageURL: String!    # Required
  basePrice: Float!          # Required
  material: String           # Optional (only sent if filled)
  neckline: String           # Optional (only sent if filled)
  sleeveType: String         # Optional (only sent if filled)
  fit: String                # Optional (only sent if filled)
  brand: String              # Optional (only sent if filled)
  category: String           # Optional (only sent if filled)
  careInstructions: String   # Optional (only sent if filled)
  weight: Float              # Optional (only sent if filled)
  featured: Boolean          # Optional (defaults to false)
}
```

### ProductVariantInput Type
```graphql
input ProductVariantInput {
  productID: ID!             # Required
  size: String!              # Required (from S, M, L, XL, XXL)
  color: String              # Optional (custom color with hex)
  priceModifier: Float!      # Required (defaults to 0)
  sku: String!               # Required (auto-generated)
  stockQuantity: Int!        # Required (defaults to 0)
}
```

---

## Common Issues & Solutions

### Issue 1: "Product created but no variants"
**Cause:** Variant creation failed after product was created

**Solution:**
1. Check if product ID was returned
2. Verify variant data is valid
3. Check if SKUs are unique
4. Ensure size and stock quantity are provided

**Prevention:**
- Always check console for variant creation errors
- Each variant is created individually (if one fails, others may succeed)

---

### Issue 2: "SKU already exists"
**Cause:** Trying to create variant with duplicate SKU

**Solution:**
1. SKUs must be unique across all variants
2. Auto-generated SKUs include timestamp to avoid duplicates
3. If editing manually, ensure uniqueness

**Prevention:**
- Use auto-generated SKUs
- If customizing, add unique suffix (product ID, timestamp, etc.)

---

### Issue 3: "Invalid color format"
**Cause:** Color string not properly formatted

**Solution:**
1. Color should be: `"Color Name #hexcode"`
2. Examples:
   - ✅ `"Navy Blue #1e3a8a"`
   - ✅ `"Black #000000"`
   - ✅ `"Forest Green #228b22"`

**Prevention:**
- Use the color picker (automatically formats correctly)
- Don't manually edit color strings

---

### Issue 4: "Base price not a number"
**Cause:** Price field contains non-numeric characters

**Solution:**
1. Enter only numbers and decimal point
2. Examples:
   - ✅ `29.99`
   - ✅ `19.5`
   - ❌ `$29.99`
   - ❌ `29.99 USD`

**Prevention:**
- Input type is set to "number"
- Only use numbers and decimal

---

### Issue 5: "Image URL invalid"
**Cause:** Invalid image URL or failed upload

**Solution:**
1. For URL: Use valid HTTP/HTTPS URL
2. For upload: Use supported image formats (JPG, PNG, WebP)
3. Check file size (< 5MB recommended)

**Prevention:**
- Test image URL before submitting
- Use drag-and-drop for reliable upload
- Compress large images

---

## Testing Checklist

Before submitting product, verify:

### Basic Info
- [ ] Product name filled (1-200 characters)
- [ ] Base price filled (number > 0)
- [ ] Image uploaded or URL provided
- [ ] Description (optional but recommended)

### Specifications
- [ ] Material selected (or left empty)
- [ ] Neckline selected (or left empty)
- [ ] Sleeve type selected (or left empty)
- [ ] Fit selected (or left empty)
- [ ] Brand filled (or left empty)
- [ ] Category filled (or left empty)

### Sizes & Colors
- [ ] At least 1 size selected (S, M, L, XL, XXL)
- [ ] At least 1 color added with valid hex code
- [ ] Variants auto-generated (Size × Color)

### Variants
- [ ] Each variant has unique SKU
- [ ] Stock quantities set (or 0 for out of stock)
- [ ] Price modifiers set (or 0 for base price)
- [ ] Final prices calculated correctly

---

## Success Indicators

### What Success Looks Like:

**Console Output:**
```javascript
// Product creation
Product created: {
  createProduct: {
    id: "123",
    name: "Premium T-Shirt",
    basePrice: 29.99,
    // ... other fields
  }
}

// Variant creation (per variant)
Variant created for: S, Navy Blue
Variant created for: S, Charcoal Gray
Variant created for: M, Navy Blue
// ... etc
```

**UI Feedback:**
```
✓ Alert: "Product added successfully!"
✓ Redirect to admin dashboard
✓ Product appears in product list
```

---

## Getting Help

### Information to Provide:

When reporting an issue, include:

1. **Error Message** (exact text from alert or console)
2. **Console Logs** (full error stack trace)
3. **Product Data** (what you tried to create)
4. **Network Request** (from Network tab)
5. **Steps Taken** (what you clicked/filled)

### Example Error Report:
```
Error: "the requested element is null which the schema does not allow"

Product Details:
- Name: "Test T-Shirt"
- Price: 29.99
- Sizes: S, M, L
- Colors: Black #000000
- Material: (empty)
- Brand: (empty)

Console Output:
[paste full error stack trace]

Network Request:
[paste request payload]
```

---

## Quick Fixes

### Fast Solutions for Common Problems:

1. **Error on submit?**
   - Check all required fields are filled
   - Look at console for specific error
   - Try with minimal data first (just required fields)

2. **Variants not creating?**
   - Ensure product was created successfully
   - Check if product ID was returned
   - Verify variant data is valid

3. **Backend connection issues?**
   - Check if backend is running
   - Verify GraphQL endpoint URL
   - Check network connectivity

4. **Form won't submit?**
   - Check browser console for errors
   - Try refreshing the page
   - Clear browser cache

---

## Summary

The product form now:
- ✅ Only sends fields with actual values
- ✅ Prevents null values from being sent
- ✅ Provides detailed error messages
- ✅ Validates all input before submission
- ✅ Shows clear user feedback
- ✅ Logs detailed debugging info to console

If you encounter any issues not covered here, check the browser console for detailed error messages and refer to the error handling section above.
