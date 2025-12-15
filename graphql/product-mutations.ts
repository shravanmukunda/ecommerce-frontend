import { gql } from "@apollo/client";

// Note: For create/update mutations we only request the fields that the UI
// actually needs (the id). This avoids Apollo throwing a CombinedGraphQLError
// when the backend returns null for nested non-nullable fields that we don't
// use on the client anyway.

export const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: ProductInput!) {
    createProduct(input: $input) {
      id
    }
  }
`;

export const CREATE_PRODUCT_VARIANT = gql`
  mutation CreateProductVariant($input: ProductVariantInput!) {
    createProductVariant(input: $input) {
      id
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: ID!, $input: ProductInput!) {
    updateProduct(id: $id, input: $input) {
      id
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