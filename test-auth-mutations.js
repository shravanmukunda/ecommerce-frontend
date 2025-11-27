// Test script for the actual GraphQL mutations
import { ApolloClient, InMemoryCache, HttpLink, gql } from '@apollo/client';

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'http://localhost:8081/query',
    credentials: 'same-origin',
  }),
  cache: new InMemoryCache(),
});

// Import only the mutations that exist in the schema
import { LOGIN_USER, SIGNUP_USER, LOGOUT_USER } from './lib/graphql/mutations.js'

async function testAuthMutations() {
  console.log('Testing authentication GraphQL mutations...\n')
  
  try {
    // Test SIGNUP_USER
    console.log('1. Testing SIGNUP_USER...')
    try {
      const signupResult = await client.mutate({
        mutation: SIGNUP_USER,
        variables: {
          name: "Test User",
          email: "test@example.com",
          password: "password123"
        }
      })
      console.log('Signup successful:', JSON.stringify(signupResult.data.signup, null, 2))
    } catch (error) {
      console.log('Signup failed (might be because user already exists):', error.message)
    }
    
    // Test LOGIN_USER
    console.log('\n2. Testing LOGIN_USER...')
    try {
      const loginResult = await client.mutate({
        mutation: LOGIN_USER,
        variables: {
          email: "test@example.com",
          password: "password123"
        }
      })
      console.log('Login successful:', JSON.stringify(loginResult.data.login, null, 2))
      
      // Save token for subsequent requests
      const token = loginResult.data.login.token
      console.log('Token received:', token)
    } catch (error) {
      console.log('Login failed:', error.message)
    }
    
    console.log('\n✅ Auth mutation tests completed!')
  } catch (error) {
    console.error('❌ Error testing mutations:', error)
  }
}

// Run the tests
testAuthMutations()