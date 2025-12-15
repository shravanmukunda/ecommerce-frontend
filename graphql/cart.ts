import { gql } from "@apollo/client";

// ===========================
// CART QUERIES
// ===========================

export const GET_CART = gql`
  query GetCart($cartId: ID, $forUser: Boolean) {
    getCart(cartId: $cartId, forUser: $forUser) {
      id
      userId
      totalAmount
      items {
        id
        productId
        variantId
        quantity
        unitPrice
        createdAt
        updatedAt
      }
    }
  }
`;

// ===========================
// CART MUTATIONS
// ===========================

export const ADD_TO_CART = gql`
  mutation AddToCart($input: AddToCartInput!) {
    addToCart(input: $input) {
      cart {
        id
        totalAmount
        items {
          id
          productId
          variantId
          quantity
          unitPrice
        }
      }
    }
  }
`;

export const REMOVE_CART_ITEM = gql`
  mutation RemoveCartItem($input: RemoveCartItemInput!) {
    removeCartItem(input: $input) {
      cart {
        id
      }
    }
  }
`;

export const CLEAR_CART = gql`
  mutation ClearCart($input: ClearCartInput!) {
    clearCart(input: $input) {
      cart {
        id
      }
    }
  }
`;

export const ATTACH_CART_TO_USER = gql`
  mutation AttachCartToUser($input: AttachCartToUserInput!) {
    attachCartToUser(input: $input) {
      cart {
        id
      }
    }
  }
`;

export const UPDATE_CART_ITEM_QUANTITY = gql`
  mutation UpdateCartItemQuantity($input: UpdateCartItemQuantityInput!) {
    updateCartItemQuantity(input: $input) {
      cart {
        id
        totalAmount
        items {
          id
          productId
          variantId
          quantity
          unitPrice
        }
      }
    }
  }
`;
