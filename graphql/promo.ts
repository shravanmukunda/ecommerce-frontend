import { gql } from "@apollo/client";

// Note: These queries/mutations assume backend support for promo codes.
// If the backend doesn't have promo code functionality yet, these will need
// to be implemented on the backend first.

export const GET_PROMO_CODES = gql`
  query GetPromoCodes($isActive: Boolean) {
    promoCodes(isActive: $isActive) {
      id
      code
      discountType
      discountValue
      validFrom
      validUntil
      isActive
      usageLimit
      usageCount
      createdAt
      updatedAt
    }
  }
`;

export const GET_PROMO_CODE = gql`
  query GetPromoCode($code: String!) {
    promoCode(code: $code) {
      id
      code
      discountType
      discountValue
      validFrom
      validUntil
      isActive
      usageLimit
      usageCount
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_PROMO_CODE = gql`
  mutation CreatePromoCode($input: PromoCodeInput!) {
    createPromoCode(input: $input) {
      id
      code
      discountType
      discountValue
      validFrom
      validUntil
      isActive
      usageLimit
      usageCount
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_PROMO_CODE = gql`
  mutation UpdatePromoCode($id: ID!, $input: PromoCodeInput!) {
    updatePromoCode(id: $id, input: $input) {
      id
      code
      discountType
      discountValue
      validFrom
      validUntil
      isActive
      usageLimit
      usageCount
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_PROMO_CODE = gql`
  mutation DeletePromoCode($id: ID!) {
    deletePromoCode(id: $id)
  }
`;

export const TOGGLE_PROMO_CODE_STATUS = gql`
  mutation TogglePromoCodeStatus($id: ID!) {
    togglePromoCodeStatus(id: $id) {
      id
      isActive
      updatedAt
    }
  }
`;

export const VALIDATE_PROMO_CODE = gql`
  query ValidatePromoCode($code: String!, $orderAmount: Float!) {
    validatePromoCode(code: $code, orderAmount: $orderAmount) {
      isValid
      discountAmount
      message
    }
  }
`;
