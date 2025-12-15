# Backend Cart Updates Required

This document outlines the backend changes needed to fully support the cart functionality.

## 1. Add UpdateCartItemQuantity Mutation

Add the following to your `cart.graphql` schema file:

```graphql
input UpdateCartItemQuantityInput {
  cartId: ID!
  cartItemId: ID!
  quantity: Int!
}

type UpdateCartItemQuantityPayload {
  cart: Cart!
}

extend type Mutation {
  updateCartItemQuantity(input: UpdateCartItemQuantityInput!): UpdateCartItemQuantityPayload!
}
```

## 2. Implement UpdateCartItemQuantity Resolver

Add the following resolver function to your `graph/resolver.go` or cart resolver file:

```go
// UpdateCartItemQuantity is the resolver for the updateCartItemQuantity field.
func (r *mutationResolver) UpdateCartItemQuantity(ctx context.Context, input model.UpdateCartItemQuantityInput) (*model.UpdateCartItemQuantityPayload, error) {
	user := middleware.GetUserFromContext(ctx)
	if user == nil {
		return nil, errors.New("unauthorized")
	}

	cartItemID, err := strconv.ParseUint(input.CartItemID, 10, 32)
	if err != nil {
		return nil, fmt.Errorf("invalid cart item ID")
	}

	cartID, err := strconv.ParseUint(input.CartID, 10, 32)
	if err != nil {
		return nil, fmt.Errorf("invalid cart ID")
	}

	// Find the cart item
	var item models.CartItem
	if err := r.DB.Preload("Cart").First(&item, uint(cartItemID)).Error; err != nil {
		return nil, fmt.Errorf("cart item not found")
	}

	// Verify cart ownership
	if item.Cart.UserID == nil || *item.Cart.UserID != user.UserID {
		return nil, fmt.Errorf("forbidden")
	}

	// Verify cart ID matches
	if item.Cart.ID != uint(cartID) {
		return nil, fmt.Errorf("cart item does not belong to specified cart")
	}

	// Update quantity
	if input.Quantity <= 0 {
		// If quantity is 0 or less, remove the item
		if err := r.DB.Delete(&item).Error; err != nil {
			return nil, fmt.Errorf("failed to remove item: %w", err)
		}
	} else {
		// Update quantity
		item.Quantity = input.Quantity
		if err := r.DB.Save(&item).Error; err != nil {
			return nil, fmt.Errorf("failed to update quantity: %w", err)
		}
	}

	// Reload cart with all relationships
	cart, err := r.CartRepository.GetCartByUserID(user.UserID)
	if err != nil {
		return nil, err
	}

	return &model.UpdateCartItemQuantityPayload{Cart: cart}, nil
}
```

## 3. Verify ClearCart Implementation

Ensure your `ClearCart` resolver properly deletes all cart items:

```go
// ClearCart is the resolver for the clearCart field.
func (r *mutationResolver) ClearCart(ctx context.Context, input model.ClearCartInput) (*model.ClearCartPayload, error) {
	user := middleware.GetUserFromContext(ctx)
	if user == nil {
		return nil, errors.New("unauthorized")
	}

	cartID, err := strconv.ParseUint(input.CartID, 10, 32)
	if err != nil {
		return nil, fmt.Errorf("invalid cart ID")
	}

	var cart models.Cart
	if err := r.DB.Preload("CartItems").First(&cart, uint(cartID)).Error; err != nil {
		return nil, fmt.Errorf("cart not found")
	}

	// Verify cart ownership
	if cart.UserID == nil || *cart.UserID != user.UserID {
		return nil, fmt.Errorf("forbidden")
	}

	// Delete all cart items
	if err := r.DB.Where("cart_id = ?", cart.ID).Delete(&models.CartItem{}).Error; err != nil {
		return nil, fmt.Errorf("failed to clear cart: %w", err)
	}

	// Reload cart
	if err := r.DB.Preload("CartItems").
		Preload("CartItems.Variant").
		Preload("CartItems.Variant.Product").
		First(&cart, cart.ID).Error; err != nil {
		return nil, err
	}

	return &model.ClearCartPayload{Cart: &cart}, nil
}
```

## 4. Field Name Consistency

Ensure all GraphQL input types use camelCase consistently:
- `cartId` (not `cartID`)
- `cartItemId` (not `cartItemID`)
- `userId` (not `userID`)

The frontend has been updated to use these field names.

## Notes

- The frontend will work with the existing backend even without `UpdateCartItemQuantity` mutation (it falls back to remove + re-add)
- However, adding the mutation will improve performance and user experience
- The `AddToCart` mutation already handles incrementing quantity for existing items correctly

