// Practical example to test GraphQL queries
// Run this with: node test-queries.js

// Import the Apollo client
import client from './lib/apolloClient.js'

// Import queries
import {
  GET_PRODUCTS,
  GET_CATEGORIES,
  SEARCH_PRODUCTS,
  GET_CURRENT_USER
} from './lib/graphql/queries.js'

async function testQueries() {
  console.log('Testing GraphQL queries...\n')
  
  try {
    // Test GET_CATEGORIES
    console.log('1. Testing GET_CATEGORIES...')
    const categoriesResult = await client.query({
      query: GET_CATEGORIES
    })
    console.log('Categories:', JSON.stringify(categoriesResult.data.categories, null, 2))
    
    // Test GET_PRODUCTS
    console.log('\n2. Testing GET_PRODUCTS...')
    const productsResult = await client.query({
      query: GET_PRODUCTS,
      variables: { limit: 5, offset: 0 }
    })
    console.log('Products:', JSON.stringify(productsResult.data.products.slice(0, 2), null, 2))
    
    // Test SEARCH_PRODUCTS
    console.log('\n3. Testing SEARCH_PRODUCTS...')
    const searchResult = await client.query({
      query: SEARCH_PRODUCTS,
      variables: { query: "product", limit: 3 }
    })
    console.log('Search results:', JSON.stringify(searchResult.data.searchProducts, null, 2))
    
    // Test GET_CURRENT_USER (will fail if not authenticated)
    console.log('\n4. Testing GET_CURRENT_USER...')
    try {
      const currentUserResult = await client.query({
        query: GET_CURRENT_USER
      })
      console.log('Current user:', JSON.stringify(currentUserResult.data.currentUser, null, 2))
    } catch (error) {
      console.log('Not authenticated - this is expected if you haven\'t logged in')
    }
    
    console.log('\n✅ Query tests completed!')
  } catch (error) {
    console.error('❌ Error testing queries:', error)
  }
}

// Run the tests
testQueries()