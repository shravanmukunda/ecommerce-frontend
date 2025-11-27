// Test script for all GraphQL queries with the enhanced server
import { ApolloClient, InMemoryCache, HttpLink, gql } from '@apollo/client';

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'http://localhost:8081/query',
    credentials: 'same-origin',
  }),
  cache: new InMemoryCache(),
});

// Import all queries
import {
  GET_CURRENT_USER,
  GET_USER_PROFILE,
  GET_PRODUCTS,
  GET_PRODUCT,
  SEARCH_PRODUCTS,
  GET_CATEGORIES,
  GET_CART,
  GET_WISHLIST,
  GET_ORDERS,
  GET_ORDER
} from './lib/graphql/queries.js'

async function testAllQueries() {
  console.log('Testing all GraphQL queries with enhanced server...\n')
  
  try {
    // Test GET_CATEGORIES
    console.log('1. Testing GET_CATEGORIES...')
    try {
      const categoriesResult = await client.query({
        query: GET_CATEGORIES
      })
      console.log('Categories count:', categoriesResult.data.categories.length)
    } catch (error) {
      console.log('Error fetching categories:', error.message)
    }
    
    // Test GET_PRODUCTS
    console.log('\n2. Testing GET_PRODUCTS...')
    try {
      const productsResult = await client.query({
        query: GET_PRODUCTS,
        variables: { limit: 5, offset: 0 }
      })
      console.log('Products count:', productsResult.data.products.length)
    } catch (error) {
      console.log('Error fetching products:', error.message)
    }
    
    // Test GET_PRODUCT
    console.log('\n3. Testing GET_PRODUCT...')
    try {
      const productResult = await client.query({
        query: GET_PRODUCT,
        variables: { id: "1" }
      })
      console.log('Product name:', productResult.data.product?.name || 'Not found')
    } catch (error) {
      console.log('Error fetching product:', error.message)
    }
    
    // Test SEARCH_PRODUCTS
    console.log('\n4. Testing SEARCH_PRODUCTS...')
    try {
      const searchResult = await client.query({
        query: SEARCH_PRODUCTS,
        variables: { query: "Premium", limit: 3 }
      })
      console.log('Search results count:', searchResult.data.searchProducts.length)
    } catch (error) {
      console.log('Error searching products:', error.message)
    }
    
    // Test GET_CURRENT_USER (will fail if not authenticated)
    console.log('\n5. Testing GET_CURRENT_USER...')
    try {
      const currentUserResult = await client.query({
        query: GET_CURRENT_USER
      })
      console.log('Current user:', currentUserResult.data.currentUser?.name || 'Not authenticated')
    } catch (error) {
      console.log('Not authenticated - this is expected if you haven\'t logged in')
    }
    
    // Test GET_USER_PROFILE
    console.log('\n6. Testing GET_USER_PROFILE...')
    try {
      const userProfileResult = await client.query({
        query: GET_USER_PROFILE,
        variables: { userId: "1" }
      })
      console.log('User profile name:', userProfileResult.data.userProfile?.name || 'Not found')
    } catch (error) {
      console.log('Error fetching user profile:', error.message)
    }
    
    // Test GET_CART (requires authentication)
    console.log('\n7. Testing GET_CART...')
    try {
      const cartResult = await client.query({
        query: GET_CART
      })
      console.log('Cart items count:', cartResult.data.cart?.items.length || 0)
    } catch (error) {
      console.log('Error fetching cart:', error.message)
    }
    
    // Test GET_WISHLIST (requires authentication)
    console.log('\n8. Testing GET_WISHLIST...')
    try {
      const wishlistResult = await client.query({
        query: GET_WISHLIST
      })
      console.log('Wishlist items count:', wishlistResult.data.wishlist?.items.length || 0)
    } catch (error) {
      console.log('Error fetching wishlist:', error.message)
    }
    
    // Test GET_ORDERS (requires authentication)
    console.log('\n9. Testing GET_ORDERS...')
    try {
      const ordersResult = await client.query({
        query: GET_ORDERS
      })
      console.log('Orders count:', ordersResult.data.orders?.length || 0)
    } catch (error) {
      console.log('Error fetching orders:', error.message)
    }
    
    // Test GET_ORDER (requires authentication)
    console.log('\n10. Testing GET_ORDER...')
    try {
      const orderResult = await client.query({
        query: GET_ORDER,
        variables: { id: "order-1" }
      })
      console.log('Order number:', orderResult.data.order?.orderNumber || 'Not found')
    } catch (error) {
      console.log('Error fetching order:', error.message)
    }
    
    console.log('\n✅ All query tests completed!')
  } catch (error) {
    console.error('❌ Error testing queries:', error)
  }
}

// Run the tests
testAllQueries()