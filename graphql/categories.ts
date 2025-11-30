import { gql } from "@apollo/client";

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
`;