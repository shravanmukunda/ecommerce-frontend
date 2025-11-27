# GraphQL Queries and Mutations Guide

This document explains how to run all the GraphQL queries and mutations in this project.

## Available Scripts

We've added the following npm scripts to easily run GraphQL examples:

1. `npm run test-queries` - Runs a practical test of key queries
2. `npm run run-all-queries` - Shows how to run all queries with examples
3. `npm run run-all-mutations` - Shows how to run all mutations with examples

## Prerequisites

Make sure you have:
1. Node.js installed (v14 or higher)
2. All dependencies installed (`pnpm install`)

## How to Run

1. Start the GraphQL server (if needed):
   ```
   npm run graphql
   ```

2. Run any of the example scripts:
   ```
   npm run test-queries
   ```

## Query Examples

### GET_CURRENT_USER
```javascript
const result = await client.query({
  query: GET_CURRENT_USER
})
```

### GET_PRODUCTS
```javascript
const result = await client.query({
  query: GET_PRODUCTS,
  variables: { category: null, limit: 10, offset: 0 }
})
```

### GET_PRODUCT
```javascript
const result = await client.query({
  query: GET_PRODUCT,
  variables: { id: "PRODUCT_ID_HERE" }
})
```

### SEARCH_PRODUCTS
```javascript
const result = await client.query({
  query: SEARCH_PRODUCTS,
  variables: { query: "shirt", limit: 5 }
})
```

### GET_CATEGORIES
```javascript
const result = await client.query({
  query: GET_CATEGORIES
})
```

## Mutation Examples

### LOGIN_USER
```javascript
const result = await client.mutate({
  mutation: LOGIN_USER,
  variables: { email: "user@example.com", password: "password123" }
})
```

### ADD_TO_CART
```javascript
const result = await client.mutate({
  mutation: ADD_TO_CART,
  variables: { 
    productId: "PRODUCT_ID_HERE", 
    quantity: 1, 
    size: "M", 
    color: "Black" 
  }
})
```

## File Structure

- `lib/graphql/queries.js` - Contains all GraphQL queries
- `lib/graphql/mutations.js` - Contains all GraphQL mutations
- `lib/apolloClient.ts` - Apollo Client configuration
- `test-queries.js` - Practical query testing example
- `run-all-queries.js` - Examples for all queries
- `run-all-mutations.js` - Examples for all mutations

## Notes

1. Some queries and mutations require authentication
2. Make sure the GraphQL server is running at `http://localhost:8081`
3. Authentication token is stored in localStorage as `authToken`