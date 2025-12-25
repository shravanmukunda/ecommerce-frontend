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
import { GET_PRODUCT } from "@/graphql/product-queries";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { client as apolloClientInstance } from "@/lib/apolloClient";

// Define types for our GraphQL responses
interface Product {
  id: string;
  name: string;
  designImageURL: string;
}

interface Variant {
  id: string;
  size: string;
  color?: string | null;
}

interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  quantity: number;
  unitPrice: number;
  createdAt: string;
  updatedAt: string;
  product?: Product | null;
  variant?: Variant | null;
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

interface ProductData {
  id: string;
  name: string;
  designImageURL: string;
  variants: Array<{
    id: string;
    size: string;
    color?: string | null;
  }>;
}

interface GetProductResponse {
  product: ProductData | null;
}

export const useCart = () => {
  // Use Clerk authentication
  const { isSignedIn } = useAuth();
  const guestCartId =
    typeof window !== "undefined" ? localStorage.getItem("guest_cart_id") : null;

  // Use the imported Apollo client instance directly
  const apolloClient = apolloClientInstance;

  const { data, loading, refetch, error } = useQuery<GetCartResponse>(GET_CART, {
    variables: {
      cartId: guestCartId || undefined,
      forUser: isSignedIn,
    },
    fetchPolicy: "cache-and-network",
    errorPolicy: "all",
    // Allow both signed-in and guest users to fetch cart
    skip: typeof window === "undefined", // Only skip on server-side
  });

  // Get unique product IDs from cart items
  const productIds = useMemo(() => {
    if (!data?.getCart?.items) return [];
    const ids = new Set(data.getCart.items.map((item) => item.productId));
    return Array.from(ids);
  }, [data?.getCart?.items]);

  // Store fetched product data
  const [productMap, setProductMap] = useState<Map<string, ProductData>>(new Map());
  const [productsLoading, setProductsLoading] = useState(false);

  // Fetch product details for all products in cart
  useEffect(() => {
    if (productIds.length === 0 || typeof window === "undefined" || !apolloClient) {
      setProductMap(new Map());
      setProductsLoading(false);
      return;
    }

    const fetchProducts = async () => {
      setProductsLoading(true);
      const map = new Map<string, ProductData>();
      
      try {
        // Fetch all products in parallel using Apollo client
        const queries = productIds.map((productId) =>
          apolloClient.query<GetProductResponse>({
            query: GET_PRODUCT,
            variables: { id: productId },
            fetchPolicy: "cache-first",
          })
        );
        
        const results = await Promise.allSettled(queries);
        results.forEach((result, index) => {
          if (result.status === "fulfilled" && result.value.data?.product) {
            map.set(productIds[index], result.value.data.product);
          } else if (result.status === "rejected") {
            console.error(`Failed to fetch product ${productIds[index]}:`, result.reason);
          }
        });
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setProductMap(map);
        setProductsLoading(false);
      }
    };

    fetchProducts();
  }, [productIds, apolloClient]);

  // Enrich cart items with product and variant data
  const enrichedCart = useMemo(() => {
    if (!data?.getCart) return null;

    const enrichedItems = data.getCart.items.map((item) => {
      const product = productMap.get(item.productId);
      const variant = product?.variants?.find((v) => v.id === item.variantId);

      return {
        ...item,
        product: product
          ? {
              id: product.id,
              name: product.name,
              designImageURL: product.designImageURL,
            }
          : null,
        variant: variant
          ? {
              id: variant.id,
              size: variant.size,
              color: variant.color || null,
            }
          : null,
      };
    });

    return {
      ...data.getCart,
      items: enrichedItems,
    };
  }, [data?.getCart, productMap]);

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
    const productIdStr = `${productId}`.trim();
    const variantIdStr = `${variantId}`.trim();
    
    // Double-check after trimming
    if (!productIdStr || productIdStr.length === 0) {
      throw new Error("Product ID is required and cannot be empty");
    }
    if (!variantIdStr || variantIdStr.length === 0) {
      throw new Error("Variant ID is required and cannot be empty");
    }

    // Prepare cartId if needed (only for guest carts, not authenticated users)
    let cartIdStr: string | undefined;
    if (!isSignedIn && guestCartId) {
      const trimmed = `${guestCartId}`.trim();
      if (trimmed && trimmed !== "null" && trimmed !== "undefined" && trimmed.length > 0) {
        cartIdStr = trimmed;
      }
    }

    // Create a plain object with primitive values only
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
      console.log("🛒 Adding to cart with input:", {
        productId: graphQLInput.productId,
        variantId: graphQLInput.variantId,
        quantity: graphQLInput.quantity,
        cartId: graphQLInput.cartId,
        isSignedIn,
        types: {
          productId: typeof graphQLInput.productId,
          variantId: typeof graphQLInput.variantId,
          quantity: typeof graphQLInput.quantity,
        }
      });

      console.log("📤 Calling addToCartMutation with variables:", JSON.stringify({ input: graphQLInput }, null, 2));
      const res = await addToCartMutation({ 
        variables: { 
          input: graphQLInput
        } 
      });
      
      console.log("✅ Mutation response received:", {
        hasData: !!res.data,
        hasError: !!res.error,
        error: res.error ? res.error.message : null,
      });

      if (res.error) {
        console.error("❌ GraphQL Error:", res.error);
        throw res.error;
      }

      if (!res.data?.addToCart?.cart) {
        throw new Error("Failed to add item to cart - no cart returned");
      }

      const cart = (res.data as AddToCartResponse).addToCart.cart;

      // Only store guest cart ID if user is not signed in
      if (typeof window !== "undefined" && !isSignedIn) {
        localStorage.setItem("guest_cart_id", cart.id);
      }

      await refetch();
      return cart;
    } catch (error: any) {
      console.error("❌ Error adding to cart:", error);
      console.error("Error details:", {
        message: error?.message,
        graphQLErrors: error?.graphQLErrors,
        networkError: error?.networkError,
        statusCode: error?.networkError?.statusCode,
        response: error?.networkError?.response,
        toString: error?.toString(),
        type: typeof error,
      });
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
    cart: enrichedCart || data?.getCart,
    loading: loading || productsLoading,
    error,
    addToCart,
    removeItem,
    clearCart,
    updateQuantity,
    attachCartToUser,
    refetch,
  };
};