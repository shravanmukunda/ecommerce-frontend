import { gql } from '@apollo/client'

// Auth Mutations
export const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        name
        isAdmin
      }
    }
  }
`

export const SIGNUP_USER = gql`
  mutation SignupUser($name: String!, $email: String!, $password: String!) {
    signup(name: $name, email: $email, password: $password) {
      token
      user {
        id
        email
        name
        isAdmin
      }
    }
  }
`

export const LOGOUT_USER = gql`
  mutation LogoutUser {
    logout
  }
`

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
`

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
`

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
`

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
`

// Wishlist Mutations
export const ADD_TO_WISHLIST = gql`
  mutation AddToWishlist($productId: ID!) {
    addToWishlist(productId: $productId) {
      id
      items {
        product {
          id
          name
          price
          image
        }
      }
      totalItems
    }
  }
`

export const REMOVE_FROM_WISHLIST = gql`
  mutation RemoveFromWishlist($productId: ID!) {
    removeFromWishlist(productId: $productId) {
      id
      items {
        product {
          id
          name
          price
          image
        }
      }
      totalItems
    }
  }
`

export const CLEAR_WISHLIST = gql`
  mutation ClearWishlist {
    clearWishlist {
      id
      items {
        product {
          id
          name
          price
          image
        }
      }
      totalItems
    }
  }
`
