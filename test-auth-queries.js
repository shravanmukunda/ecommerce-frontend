// Test script for the actual GraphQL schema
import client from './lib/apolloClient.js'

// Import only the queries that exist in the schema
import { GET_CURRENT_USER } from './lib/graphql/queries.js'

async function testAuthQueries() {
  console.log('Testing authentication GraphQL queries...\n')
  
  try {
    // Test GET_CURRENT_USER (will fail if not authenticated)
    console.log('1. Testing GET_CURRENT_USER...')
    try {
      const currentUserResult = await client.query({
        query: GET_CURRENT_USER
      })
      console.log('Current user:', JSON.stringify(currentUserResult.data.currentUser, null, 2))
    } catch (error) {
      console.log('Not authenticated - this is expected if you haven\'t logged in')
      console.log('Error:', error.message)
    }
    
    console.log('\n✅ Auth query tests completed!')
  } catch (error) {
    console.error('❌ Error testing queries:', error)
  }
}

// Run the tests
testAuthQueries()