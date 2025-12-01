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

export const CREATE_ORDER = gql`
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      id
      totalAmount
      status
    }
  }
`;

export const MY_ORDERS = gql`
  query MyOrders {
    myOrders {
      id
      totalAmount
      status
      createdAt
    }
  }
`;

export const ALL_ORDERS = gql`
  query AllOrders {
    allOrders {
      id
      totalAmount
      status
      createdAt
      user {
        id
        name
        email
      }
    }
  }
`;