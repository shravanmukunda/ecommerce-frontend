# Backend GraphQL Requirements for Admin Dashboard

This document outlines the GraphQL schema requirements for the admin dashboard to function correctly.

## ✅ Already Implemented (Verified Working)

### Products
```graphql
type Product {
  id: ID!
  name: String!
  description: String
  designImageURL: String!
  basePrice: Float!
  isActive: Boolean!
  material: String
  neckline: String
  sleeveType: String
  fit: String
  brand: String
  category: String
  careInstructions: String
  weight: Float
  featured: Boolean
  variants: [ProductVariant]
  createdAt: String!
}

type ProductVariant {
  id: ID!
  productID: ID!
  size: String!
  color: String
  priceModifier: Float!
  sku: String!
  price: Float!
  inventory: Inventory
  product: Product!
}

type Inventory {
  id: ID!
  variantID: ID!
  stockQuantity: Int!
  reservedQuantity: Int!
  availableQuantity: Int!
}

type ProductOptions {
  sizes: [String!]!
  colors: [String!]!
  materials: [String!]!
  necklines: [String!]!
  sleeveTypes: [String!]!
  fits: [String!]!
}

extend type Query {
  products(isActive: Boolean): [Product!]!
  product(id: ID!): Product
  productsByCategory(category: String!): [Product!]!
  productOptions: ProductOptions!
}

extend type Mutation {
  createProduct(input: ProductInput!): Product!
  updateProduct(id: ID!, input: ProductInput!): Product!
  deleteProduct(id: ID!): Boolean!
  createProductVariant(input: ProductVariantInput!): ProductVariant!
  updateInventory(variantID: ID!, quantity: Int!): Inventory!
}
```

### Orders
```graphql
type Order {
  id: ID!
  userID: ID!
  items: [OrderItem!]!
  totalAmount: Float!
  status: String!
  shippingAddress: String!
  payment: Payment
  createdAt: String!
  updatedAt: String!
}

type OrderItem {
  id: ID!
  orderID: ID!
  variant: ProductVariant!
  quantity: Int!
  unitPrice: Float!
  subtotal: Float!
}

type Payment {
  id: ID!
  orderID: ID!
  amount: Float!
  status: String!
  paymentMethod: String!
  transactionID: String
  createdAt: String!
}

extend type Query {
  myOrders: [Order!]!
  order(id: ID!): Order
  allOrders(status: String): [Order!]!
}

extend type Mutation {
  createOrder(input: CreateOrderInput!): Order!
  updateOrderStatus(orderID: ID!, status: String!): Order!
  cancelOrder(orderID: ID!): Order!
}
```

---

## ⚠️ Missing Features (Need Backend Implementation)

### 1. Promo Codes (RECOMMENDED)

**Priority**: HIGH - Essential for e-commerce functionality

```graphql
type PromoCode {
  id: ID!
  code: String!
  discountType: String!        # "percentage" or "fixed"
  discountValue: Float!
  validFrom: String
  validUntil: String!
  isActive: Boolean!
  usageLimit: Int
  usageCount: Int
  createdAt: String!
  updatedAt: String!
}

input PromoCodeInput {
  code: String!
  discountType: String!        # "percentage" or "fixed"
  discountValue: Float!
  validFrom: String
  validUntil: String!
  isActive: Boolean
  usageLimit: Int
}

type PromoCodeValidation {
  isValid: Boolean!
  discountAmount: Float!
  message: String
}

extend type Query {
  # Get all promo codes (admin only)
  promoCodes(isActive: Boolean): [PromoCode!]!
  
  # Get single promo code by code string
  promoCode(code: String!): PromoCode
  
  # Validate promo code for checkout
  validatePromoCode(code: String!, orderAmount: Float!): PromoCodeValidation!
}

extend type Mutation {
  # Create new promo code (admin only)
  createPromoCode(input: PromoCodeInput!): PromoCode!
  
  # Update existing promo code (admin only)
  updatePromoCode(id: ID!, input: PromoCodeInput!): PromoCode!
  
  # Delete promo code (admin only)
  deletePromoCode(id: ID!): Boolean!
  
  # Toggle active status (admin only)
  togglePromoCodeStatus(id: ID!): PromoCode!
}
```

**Implementation Notes**:
- Currently the frontend falls back to local mock data if this isn't available
- The UI will show an alert when backend is unavailable
- All mutations are protected with proper error handling

**Business Logic**:
```typescript
// Validation rules for promo codes:
1. Check if code exists
2. Check if code is active (isActive = true)
3. Check if current date is within validFrom and validUntil
4. Check if usageCount < usageLimit (if limit exists)
5. Calculate discount based on discountType:
   - percentage: orderAmount * (discountValue / 100)
   - fixed: min(discountValue, orderAmount)
6. Increment usageCount when applied to order
```

---

### 2. Analytics (OPTIONAL - Can derive from existing data)

**Priority**: MEDIUM - Currently calculated client-side from orders

```graphql
type SalesAnalytics {
  period: String!              # "2024-01", "2024-01-15", etc.
  totalSales: Float!
  orderCount: Int!
  averageOrderValue: Float!
}

type RevenueAnalytics {
  period: String!
  totalRevenue: Float!
  orderCount: Int!
  averageOrderValue: Float!
}

type DashboardStats {
  totalRevenue: Float!
  totalSales: Float!
  totalOrders: Int!
  totalProducts: Int!
  revenueGrowth: Float         # Percentage change from previous period
  salesGrowth: Float
  orderGrowth: Float
}

type ProductSales {
  product: Product!
  totalSold: Int!
  totalRevenue: Float!
}

type InventoryAlert {
  variant: ProductVariant!
  stockQuantity: Int!
  reservedQuantity: Int!
  availableQuantity: Int!
}

extend type Query {
  # Get sales analytics grouped by period
  salesAnalytics(
    startDate: String
    endDate: String
    groupBy: String              # "day", "week", "month", "year"
  ): [SalesAnalytics!]!
  
  # Get revenue analytics grouped by period
  revenueAnalytics(
    startDate: String
    endDate: String
    groupBy: String
  ): [RevenueAnalytics!]!
  
  # Get overall dashboard statistics
  dashboardStats: DashboardStats!
  
  # Get top selling products
  topProducts(limit: Int): [ProductSales!]!
  
  # Get low stock alerts
  inventoryAlerts(threshold: Int): [InventoryAlert!]!
}
```

**Why Optional?**:
- Current implementation calculates these from order data on the frontend
- Works fine for small-medium datasets
- Backend implementation would improve performance for large datasets

---

## Implementation Priority

### Phase 1: Critical (Do First)
1. ✅ **Products & Variants** - Already done
2. ✅ **Orders** - Already done
3. ⚠️ **Promo Codes** - High priority for e-commerce

### Phase 2: Enhancement (Do Later)
4. **Analytics Endpoints** - Optional, improves performance
5. **Real-time Updates** - WebSocket subscriptions for live order updates
6. **User Details in Orders** - Populate user object in allOrders query

---

## Testing Queries

### Test Promo Code Creation
```graphql
mutation CreatePromo {
  createPromoCode(input: {
    code: "WELCOME10"
    discountType: "percentage"
    discountValue: 10
    validUntil: "2024-12-31T23:59:59Z"
    isActive: true
    usageLimit: 100
  }) {
    id
    code
    discountValue
    isActive
  }
}
```

### Test Promo Code Validation
```graphql
query ValidatePromo {
  validatePromoCode(code: "WELCOME10", orderAmount: 100.00) {
    isValid
    discountAmount
    message
  }
}
```

### Test Analytics
```graphql
query GetDashboardStats {
  dashboardStats {
    totalRevenue
    totalSales
    totalOrders
    totalProducts
    revenueGrowth
    salesGrowth
    orderGrowth
  }
}
```

---

## Error Handling

All mutations and queries should return proper error messages:

```graphql
# Example error response
{
  "errors": [
    {
      "message": "Promo code already exists",
      "extensions": {
        "code": "DUPLICATE_PROMO_CODE"
      }
    }
  ]
}
```

**Frontend handles these error codes**:
- Network errors (connection issues)
- GraphQL errors (validation, business logic)
- Not found errors (404)
- Unauthorized errors (401)

---

## Security Considerations

### Authentication & Authorization
```typescript
// All admin mutations should verify:
1. User is authenticated (valid JWT token)
2. User has admin role
3. User has permission for specific operation

// Public queries (no auth required):
- products
- product
- productOptions
- productsByCategory

// User queries (auth required):
- myOrders
- order (own orders only)

// Admin queries (admin role required):
- allOrders
- promoCodes
- dashboardStats
- inventoryAlerts
```

### Input Validation
```typescript
// Promo code validation:
- code: 3-20 characters, alphanumeric + underscore
- discountType: must be "percentage" or "fixed"
- discountValue: > 0, for percentage: <= 100
- validUntil: must be future date
- usageLimit: >= 0

// Product validation:
- name: required, 1-200 characters
- basePrice: > 0
- designImageURL: required, valid URL or base64
```

---

## Database Schema Suggestions

### Promo Codes Table
```sql
CREATE TABLE promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(20) UNIQUE NOT NULL,
  discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10, 2) NOT NULL CHECK (discount_value > 0),
  valid_from TIMESTAMP,
  valid_until TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT true,
  usage_limit INTEGER,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_promo_codes_code ON promo_codes(code);
CREATE INDEX idx_promo_codes_active ON promo_codes(is_active);
```

### Analytics Tables (Optional)
```sql
-- Materialized view for performance
CREATE MATERIALIZED VIEW sales_analytics AS
SELECT 
  DATE_TRUNC('month', created_at) as period,
  COUNT(*) as order_count,
  SUM(total_amount) as total_revenue,
  AVG(total_amount) as average_order_value
FROM orders
WHERE status != 'cancelled'
GROUP BY period
ORDER BY period DESC;

-- Refresh periodically with cron job
REFRESH MATERIALIZED VIEW sales_analytics;
```

---

## Migration Path

If implementing promo codes on existing system:

1. Create database tables/collections
2. Add GraphQL schema
3. Implement resolvers with validation
4. Add admin permissions check
5. Test with frontend (will automatically detect and use backend)
6. Remove fallback mock data after verification

The frontend is already prepared for this - it will automatically switch from mock data to backend data once the endpoints are available!
