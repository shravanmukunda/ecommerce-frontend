import { gql } from "@apollo/client";

// User Queries
export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    currentUser {
      id
      email
      name
      isAdmin
    }
  }
`;

export const GET_USER_PROFILE = gql`
  query GetUserProfile($userId: ID!) {
    userProfile(userId: $userId) {
      id
      email
      name
      isAdmin
      createdAt
    }
  }
`;

// User Mutations
// LOGOUT_USER moved to auth.ts to avoid naming conflict