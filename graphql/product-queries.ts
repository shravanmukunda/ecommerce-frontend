import { gql } from '@apollo/client'

export const GET_PRODUCTS = gql`
  query GetProducts($isActive: Boolean) {
    products(isActive: $isActive) {
      id
      name
      description
      designImageURL
      imageURLs
      basePrice
      isActive
      material
      neckline
      sleeveType
      fit
      brand
      category
      careInstructions
      weight
      featured
      variants {
        id
        size
        color
        priceModifier
        sku
        price
        inventory {
          id
          stockQuantity
          reservedQuantity
          availableQuantity
        }
      }
      createdAt
    }
  }
`;

export const GET_PRODUCT = gql`
  query GetProduct($id: ID!) {
    product(id: $id) {
      id
      name
      description
      designImageURL
      imageURLs
      basePrice
      isActive
      material
      neckline
      sleeveType
      fit
      brand
      category
      careInstructions
      weight
      featured
      variants {
        id
        size
        color
        priceModifier
        sku
        price
        inventory {
          id
          stockQuantity
          reservedQuantity
          availableQuantity
        }
      }
      createdAt
    }
  }
`;