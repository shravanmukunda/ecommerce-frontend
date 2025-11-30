import { gql } from "@apollo/client";

// Search Queries
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
`;