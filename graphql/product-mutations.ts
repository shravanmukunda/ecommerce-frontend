import { gql } from "@apollo/client";

export const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: ProductInput!) {
    createProduct(input: $input) {
      id
      name
      description
      designImageURL
      basePrice
      isActive
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

export const CREATE_PRODUCT_VARIANT = gql`
  mutation CreateProductVariant($input: ProductVariantInput!) {
    createProductVariant(input: $input) {
      id
      productID
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
      product {
        id
        name
      }
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: ID!, $input: ProductInput!) {
    updateProduct(id: $id, input: $input) {
      id
      name
      description
      designImageURL
      basePrice
      isActive
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

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id)
  }
`;

export const UPDATE_INVENTORY = gql`
  mutation UpdateInventory($variantID: ID!, $quantity: Int!) {
    updateInventory(variantID: $variantID, quantity: $quantity) {
      id
      stockQuantity
      reservedQuantity
      availableQuantity
    }
  }
`;