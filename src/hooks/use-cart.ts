"use client";

import { useQuery, useMutation } from "@apollo/client/react";
import {
  GET_CART,
  ADD_TO_CART,
  REMOVE_CART_ITEM,
  CLEAR_CART,
  ATTACH_CART_TO_USER,
  UPDATE_CART_ITEM_QUANTITY,
} from "@/graphql/cart";

// Define types for our GraphQL responses
interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  quantity: number;
  unitPrice: number;
  createdAt: string;
  updatedAt: string;
}

interface Cart {
  id: string;
  userId?: string | null;
  totalAmount: number;
  items: CartItem[];
}

interface GetCartResponse {
  getCart: Cart;
}

interface AddToCartResponse {
  addToCart: {
    cart: Cart;
  };
}

interface RemoveCartItemResponse {
  removeCartItem: {
    cart: Cart;
  };
}

interface ClearCartResponse {
  clearCart: {
    cart: Cart;
  };
}

interface UpdateCartItemQuantityResponse {
  updateCartItemQuantity: {
    cart: Cart;
  };
}

export const useCart = () => {
  // Only access localStorage on the client side
  const token =
    typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
  const guestCartId =
    typeof window !== "undefined" ? localStorage.getItem("guest_cart_id") : null;

  const { data, loading, refetch } = useQuery<GetCartResponse>(GET_CART, {
    variables: {
      cartId: guestCartId,
      forUser: Boolean(token),
    },
    fetchPolicy: "network-only",
  });

  const [addToCartMutation] = useMutation<AddToCartResponse>(ADD_TO_CART);
  const [removeMutation] = useMutation<RemoveCartItemResponse>(REMOVE_CART_ITEM);
  const [clearMutation] = useMutation<ClearCartResponse>(CLEAR_CART);
  const [attachMutation] = useMutation(ATTACH_CART_TO_USER);
  const [updateQuantityMutation] = useMutation<UpdateCartItemQuantityResponse>(UPDATE_CART_ITEM_QUANTITY);

  // ADD TO CART
  const addToCart = async (
    productId: string,
    variantId: string,
    quantity = 1
  ) => {
    // Validate inputs - ensure they exist and are not null/undefined
    if (productId == null || productId === "" || productId === "null" || productId === "undefined") {
      throw new Error("Invalid product ID");
    }
    if (variantId == null || variantId === "" || variantId === "null" || variantId === "undefined") {
      throw new Error("Invalid variant ID");
    }
    if (!quantity || quantity < 1 || !Number.isInteger(Number(quantity))) {
      throw new Error("Invalid quantity");
    }

    // Ensure IDs are primitive strings (not String objects) and trim whitespace
    // GraphQL expects String! for variantId and ID! for productId
    // Use template literals to ensure primitive strings
    const productIdStr = `${productId}`.trim();
    const variantIdStr = `${variantId}`.trim();
    
    // Double-check after trimming
    if (!productIdStr || productIdStr.length === 0) {
      throw new Error("Product ID is required and cannot be empty");
    }
    if (!variantIdStr || variantIdStr.length === 0) {
      throw new Error("Variant ID is required and cannot be empty");
    }

    // Prepare cartId if needed
    let cartIdStr: string | undefined;
    if (!token && guestCartId) {
      const trimmed = `${guestCartId}`.trim();
      if (trimmed && trimmed !== "null" && trimmed !== "undefined" && trimmed.length > 0) {
        cartIdStr = trimmed;
      }
    }

    // Create a plain object with primitive values only
    // Use object literal to ensure we have a clean, plain object
    const graphQLInput: {
      productId: string;
      variantId: string;
      quantity: number;
      cartId?: string;
    } = {
      productId: productIdStr,
      variantId: variantIdStr,
      quantity: Math.floor(Number(quantity)),
    };

    // Only add cartId if it exists
    if (cartIdStr) {
      graphQLInput.cartId = cartIdStr;
    }

    try {
      // Debug: Log what we're sending (remove in production if needed)
      console.log("Adding to cart with input:", {
        productId: graphQLInput.productId,
        variantId: graphQLInput.variantId,
        quantity: graphQLInput.quantity,
        cartId: graphQLInput.cartId,
        types: {
          productId: typeof graphQLInput.productId,
          variantId: typeof graphQLInput.variantId,
          quantity: typeof graphQLInput.quantity,
        }
      });

      const res = await addToCartMutation({ 
        variables: { 
          input: graphQLInput
        } 
      });

      if (!res.data?.addToCart?.cart) {
        throw new Error("Failed to add item to cart");
      }

      const cart = (res.data as AddToCartResponse).addToCart.cart;

      if (typeof window !== "undefined" && !token) {
        localStorage.setItem("guest_cart_id", cart.id);
      }

      await refetch();
      return cart;
    } catch (error: any) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  };

  // REMOVE ITEM
  const removeItem = async (cartItemId: string, cartId: string) => {
    // Validate inputs
    if (!cartItemId || cartItemId === "null" || cartItemId === "undefined" || cartItemId.trim().length === 0) {
      throw new Error("Invalid cart item ID");
    }
    if (!cartId || cartId === "null" || cartId === "undefined" || cartId.trim().length === 0) {
      throw new Error("Invalid cart ID");
    }

    // Ensure IDs are primitive strings
    const cartItemIDStr = `${cartItemId}`.trim();
    const cartIDStr = `${cartId}`.trim();

    try {
      const res = await removeMutation({ 
        variables: { 
          input: { 
            cartId: cartIDStr, 
            cartItemId: cartItemIDStr
          } 
        } 
      });

      if (!res.data?.removeCartItem?.cart?.id) {
        throw new Error("Failed to remove item from cart");
      }

      // Refetch to get updated cart data
      await refetch();
    } catch (error: any) {
      console.error("Error removing item from cart:", error);
      throw error;
    }
  };

  // UPDATE QUANTITY (works with or without backend UpdateCartItemQuantity mutation)
  const updateQuantity = async (cartItemId: string, cartId: string, newQuantity: number, productId: string, variantId: string) => {
    // Validate inputs
    if (!cartItemId || cartItemId === "null" || cartItemId === "undefined" || cartItemId.trim().length === 0) {
      throw new Error("Invalid cart item ID");
    }
    if (!cartId || cartId === "null" || cartId === "undefined" || cartId.trim().length === 0) {
      throw new Error("Invalid cart ID");
    }
    if (newQuantity < 0 || !Number.isInteger(newQuantity)) {
      throw new Error("Invalid quantity");
    }

    // If quantity is 0, remove the item
    if (newQuantity === 0) {
      return await removeItem(cartItemId, cartId);
    }

    const cartItemIDStr = `${cartItemId}`.trim();
    const cartIDStr = `${cartId}`.trim();

    try {
      // Try to use UpdateCartItemQuantity mutation first (if backend supports it)
      try {
        const res = await updateQuantityMutation({
          variables: {
            input: {
              cartItemId: cartItemIDStr,
              cartId: cartIDStr,
              quantity: newQuantity,
            }
          }
        });

        if (res.data?.updateCartItemQuantity?.cart?.id) {
          await refetch();
          return;
        }
      } catch (updateError: any) {
        // If UpdateCartItemQuantity doesn't exist, fall back to remove + re-add
        console.log("UpdateCartItemQuantity not available, using fallback method");
      }

      // Fallback: Remove item and re-add with new quantity
      // This works with the existing backend AddToCart which increments quantity
      const currentItem = data?.getCart?.items?.find((item: CartItem) => item.id === cartItemId);
      if (!currentItem) {
        throw new Error("Cart item not found");
      }

      // Remove the item first
      await removeMutation({
        variables: {
          input: {
            cartId: cartIDStr,
            cartItemId: cartItemIDStr
          }
        }
      });

      // Re-add with the new quantity
      // Since AddToCart increments, we need to add the exact quantity we want
      await addToCart(productId, variantId, newQuantity);

      await refetch();
    } catch (error: any) {
      console.error("Error updating quantity:", error);
      throw error;
    }
  };

  // CLEAR CART
  const clearCart = async (cartId: string) => {
    // Validate input
    if (!cartId || cartId === "null" || cartId === "undefined" || cartId.trim().length === 0) {
      throw new Error("Invalid cart ID");
    }

    // Ensure ID is a primitive string
    const cartIDStr = `${cartId}`.trim();

    try {
      const res = await clearMutation({ 
        variables: { 
          input: { 
            cartId: cartIDStr
          } 
        } 
      });

      if (!res.data?.clearCart?.cart?.id) {
        throw new Error("Failed to clear cart");
      }

      // Refetch to get updated cart data
      await refetch();
    } catch (error: any) {
      console.error("Error clearing cart:", error);
      throw error;
    }
  };

  // ATTACH GUEST CART TO USER (AFTER LOGIN)
  const attachCartToUser = async (userId: string) => {
    if (typeof window === "undefined") return;

    const guestId = localStorage.getItem("guest_cart_id");
    if (!guestId) return;

    await attachMutation({
      variables: {
        input: {
          cartId: String(guestId),
          userId: String(userId),
        },
      },
    });

    localStorage.removeItem("guest_cart_id");
    await refetch();
  };

  return {
    cart: data?.getCart,
    loading,
    addToCart,
    removeItem,
    clearCart,
    updateQuantity,
    attachCartToUser,
    refetch,
  };
};