import { gql } from "@apollo/client";

// Cart Queries
export const GET_CART = gql`
  query GetCart {
    cart {
      id
      items {
        product {
          id
          name
          price
          image
        }
        quantity
        size
        color
      }
      totalItems
      subtotal
    }
  }
`;

// Cart Mutations
export const ADD_TO_CART = gql`
  mutation AddToCart($productId: ID!, $quantity: Int!, $size: String, $color: String) {
    addToCart(productId: $productId, quantity: $quantity, size: $size, color: $color) {
      id
      items {
        product {
          id
          name
          price
          image
        }
        quantity
        size
        color
      }
      totalItems
    }
  }
`;

export const REMOVE_FROM_CART = gql`
  mutation RemoveFromCart($productId: ID!) {
    removeFromCart(productId: $productId) {
      id
      items {
        product {
          id
          name
          price
          image
        }
        quantity
        size
        color
      }
      totalItems
    }
  }
`;

export const UPDATE_CART_ITEM = gql`
  mutation UpdateCartItem($productId: ID!, $quantity: Int!) {
    updateCartItem(productId: $productId, quantity: $quantity) {
      id
      items {
        product {
          id
          name
          price
          image
        }
        quantity
        size
        color
      }
      totalItems
    }
  }
`;

export const CLEAR_CART = gql`
  mutation ClearCart {
    clearCart {
      id
      items {
        product {
          id
          name
          price
          image
        }
        quantity
        size
        color
      }
      totalItems
    }
  }
`;