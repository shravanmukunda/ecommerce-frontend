import { gql } from "@apollo/client";

/**
 * ✅ Correct query matching backend GraphQL schema
 * OrderItem → Variant → Product
 */
export const GET_ORDERS = gql`
query GetOrders {
  allOrders {
    id
    status
    totalAmount
    createdAt

    items {
      quantity
      unitPrice
      subtotal

      variant {
        size
        color
        price

        product {
          id
          name
          designImageURL
        }
      }
    }
  }
}
`;
