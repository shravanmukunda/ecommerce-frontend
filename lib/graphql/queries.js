import { gql } from '@apollo/client'

// Auth Queries
export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    currentUser {
      id
      email
      name
      isAdmin
    }
  }
`

export const GET_USER_PROFILE = gql`
  query GetUserProfile($userId: ID!) {
    userProfile(userId: $userId) {
      id
      email
      name
      isAdmin
      createdAt
    }
  }
`

// Product Queries
export const GET_PRODUCTS = gql`
  query GetProducts($category: String, $limit: Int, $offset: Int) {
    products(category: $category, limit: $limit, offset: $offset) {
      id
      name
      description
      price
      image
      hoverImage
      images
      category
      inStock
    }
  }
`

export const GET_PRODUCT = gql`
  query GetProduct($id: ID!) {
    product(id: $id) {
      id
      name
      description
      price
      image
      hoverImage
      images
      category
      inStock
      materials
      careInstructions
      sizes
      colors
    }
  }
`

export const SEARCH_PRODUCTS = gql`
  query SearchProducts($query: String!, $limit: Int) {
    searchProducts(query: $query, limit: $limit) {
      id
      name
      description
      price
      image
      category
    }
  }
`

// Category Queries
export const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
      slug
      image
    }
  }
`

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
`

// Wishlist Queries
export const GET_WISHLIST = gql`
  query GetWishlist {
    wishlist {
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

// Order Queries
export const GET_ORDERS = gql`
  query GetOrders {
    orders {
      id
      orderNumber
      status
      total
      createdAt
      items {
        product {
          id
          name
          price
          image
        }
        quantity
      }
    }
  }
`

export const GET_ORDER = gql`
  query GetOrder($id: ID!) {
    order(id: $id) {
      id
      orderNumber
      status
      total
      createdAt
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
      shippingAddress {
        fullName
        address
        city
        state
        zipCode
        country
      }
      billingAddress {
        fullName
        address
        city
        state
        zipCode
        country
      }
    }
  }
`
