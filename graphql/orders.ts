import { gql } from "@apollo/client";

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
        size
        color
      }
    }
  }
`;

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
`;