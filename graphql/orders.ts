import { gql } from "@apollo/client";

export const CREATE_ORDER = gql`
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      id
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
    }
  }
`;

export const GET_ORDERS = gql`
  query GetOrders {
    getOrders {
      id
      totalAmount
      status
      createdAt
    }
  }
`;
