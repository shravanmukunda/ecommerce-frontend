"use client";

import { useQuery, useMutation } from "@apollo/client/react";
import {
  GET_CART,
  ADD_TO_CART,
  REMOVE_CART_ITEM,
  CLEAR_CART,
  ATTACH_CART_TO_USER,
} from "@/src/graphql/cart";

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
  userID: string;
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

export const useCart = () => {
  const token = localStorage.getItem("authToken");
  const guestCartId = localStorage.getItem("guest_cart_id");

  const { data, loading, refetch } = useQuery<GetCartResponse>(GET_CART, {
    variables: {
      cartId: guestCartId,
      forUser: Boolean(token),
    },
    fetchPolicy: "network-only",
  });

  const [addToCartMutation] = useMutation<AddToCartResponse>(ADD_TO_CART);
  const [removeMutation] = useMutation(REMOVE_CART_ITEM);
  const [clearMutation] = useMutation(CLEAR_CART);
  const [attachMutation] = useMutation(ATTACH_CART_TO_USER);

  // ADD TO CART
  const addToCart = async (variantId: string, quantity = 1) => {
    const input: any = { variantID: variantId, quantity };

    if (!token && guestCartId) input.cartId = guestCartId;

    const res = await addToCartMutation({ variables: { input } });

    const cart = (res.data as AddToCartResponse).addToCart.cart;

    if (!token) {
      localStorage.setItem("guest_cart_id", cart.id);
    }

    await refetch();
    return cart;
  };

  // REMOVE ITEM
  const removeItem = async (cartItemID: string, cartID: string) => {
    await removeMutation({ variables: { input: { cartItemID, cartID } } });
    await refetch();
  };

  // CLEAR CART
  const clearCart = async (cartID: string) => {
    await clearMutation({ variables: { input: { cartID } } });
    await refetch();
  };

  // ATTACH GUEST CART TO USER (AFTER LOGIN)
  const attachCartToUser = async (userID: string) => {
    const guestId = localStorage.getItem("guest_cart_id");
    if (!guestId) return;

    await attachMutation({
      variables: {
        input: {
          cartID: guestId,
          userID,
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
    attachCartToUser,
    refetch,
  };
};