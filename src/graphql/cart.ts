import { gql } from "@apollo/client";

export const GET_CART = gql`
  query GetCart($cartId: ID, $forUser: Boolean) {
    getCart(cartId: $cartId, forUser: $forUser) {
      id
      userID
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
        items { id }
        totalAmount
      }
    }
  }
`;

export const CLEAR_CART = gql`
  mutation ClearCart($input: ClearCartInput!) {
    clearCart(input: $input) {
      cart { id }
    }
  }
`;

export const ATTACH_CART_TO_USER = gql`
  mutation AttachCartToUser($input: AttachCartToUserInput!) {
    attachCartToUser(input: $input) {
      cart {
        id
        items { id }
        totalAmount
      }
    }
  }
`;