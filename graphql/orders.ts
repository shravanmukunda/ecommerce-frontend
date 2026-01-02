import { gql } from "@apollo/client";

export const CREATE_ORDER = gql`
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      id
    }
  }
`;

// Simplified query for dashboard - only basic order info
export const MY_ORDERS_SIMPLE = gql`
  query MyOrdersSimple {
    myOrders {
      id
      totalAmount
      status
      createdAt
    }
  }
`;

export const MY_ORDERS = gql`
  query MyOrders {
    myOrders {
      id
      userID
      totalAmount
      status
      shippingAddress
      createdAt
      updatedAt
      items {
        id
        quantity
        unitPrice
        subtotal
        variant {
          id
          size
          color
          sku
          price
          product {
            id
            name
            designImageURL
          }
        }
      }
      payment {
        id
        amount
        status
        paymentMethod
        transactionID
        createdAt
      }
    }
  }
`;

export const ALL_ORDERS = gql`
  query AllOrders($status: String) {
    allOrders(status: $status) {
      id
      userID
      totalAmount
      status
      shippingAddress
      createdAt
      updatedAt
      items {
        id
        quantity
        unitPrice
        subtotal
        variant {
          id
          size
          color
          sku
          price
          product {
            id
            name
            designImageURL
          }
        }
      }
      payment {
        id
        amount
        status
        paymentMethod
        transactionID
        createdAt
      }
    }
  }
`;

export const GET_ORDER = gql`
  query GetOrder($id: ID!) {
    order(id: $id) {
      id
      userID
      totalAmount
      status
      shippingAddress
      createdAt
      updatedAt
      items {
        id
        quantity
        unitPrice
        subtotal
        variant {
          id
          size
          color
          sku
          price
          product {
            id
            name
            designImageURL
          }
        }
      }
      payment {
        id
        amount
        status
        paymentMethod
        transactionID
        createdAt
      }
    }
  }
`;

export const UPDATE_ORDER_STATUS = gql`
  mutation UpdateOrderStatus($orderID: ID!, $status: String!) {
    updateOrderStatus(orderID: $orderID, status: $status) {
      id
      status
      updatedAt
    }
  }
`;

export const CANCEL_ORDER = gql`
  mutation CancelOrder($orderID: ID!) {
    cancelOrder(orderID: $orderID) {
      id
      status
      updatedAt
    }
  }
`;

export const CREATE_RAZORPAY_ORDER = gql`
  mutation CreateRazorpayOrder($orderID: ID!) {
    createRazorpayOrder(orderID: $orderID) {
      id
      amount
      currency
    }
  }
`;

export const VERIFY_PAYMENT = gql`
  mutation VerifyPayment($input: VerifyPaymentInput!) {
    verifyPayment(input: $input) {
      id
      status
    }
  }
`;
