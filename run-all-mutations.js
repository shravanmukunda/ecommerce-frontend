// Example script showing how to run all GraphQL mutations
import client from './lib/apolloClient.js'
import {
  LOGIN_USER,
  SIGNUP_USER,
  LOGOUT_USER,
  ADD_TO_CART,
  REMOVE_FROM_CART,
  UPDATE_CART_ITEM,
  CLEAR_CART,
  ADD_TO_WISHLIST,
  REMOVE_FROM_WISHLIST,
  CLEAR_WISHLIST
} from './lib/graphql/mutations'

async function runAllMutations() {
  try {
    console.log('Running all GraphQL mutations...\n')

    // NOTE: Some mutations require authentication or specific IDs
    // This example shows the structure but may need adjustments based on your data

    // 1. SIGNUP_USER (if you want to create a new user)
    console.log('1. Example SIGNUP_USER mutation:')
    console.log(`
      await client.mutate({
        mutation: SIGNUP_USER,
        variables: {
          name: "John Doe",
          email: "john@example.com",
          password: "securepassword"
        }
      })
    `)

    // 2. LOGIN_USER (authenticate a user)
    console.log('\n2. Example LOGIN_USER mutation:')
    console.log(`
      const loginResult = await client.mutate({
        mutation: LOGIN_USER,
        variables: {
          email: "john@example.com",
          password: "securepassword"
        }
      })
      // Save token for authenticated requests
      localStorage.setItem('authToken', loginResult.data.login.token)
    `)

    // 3. LOGOUT_USER (logout current user)
    console.log('\n3. Example LOGOUT_USER mutation:')
    console.log(`
      await client.mutate({
        mutation: LOGOUT_USER
      })
      // Clear token
      localStorage.removeItem('authToken')
    `)

    // 4. ADD_TO_CART (requires authentication and valid productId)
    console.log('\n4. Example ADD_TO_CART mutation:')
    console.log(`
      const addToCartResult = await client.mutate({
        mutation: ADD_TO_CART,
        variables: {
          productId: "PRODUCT_ID_HERE",
          quantity: 1,
          size: "M",
          color: "Black"
        }
      })
    `)

    // 5. REMOVE_FROM_CART (requires authentication and valid productId)
    console.log('\n5. Example REMOVE_FROM_CART mutation:')
    console.log(`
      const removeFromCartResult = await client.mutate({
        mutation: REMOVE_FROM_CART,
        variables: {
          productId: "PRODUCT_ID_HERE"
        }
      })
    `)

    // 6. UPDATE_CART_ITEM (requires authentication and valid productId)
    console.log('\n6. Example UPDATE_CART_ITEM mutation:')
    console.log(`
      const updateCartItemResult = await client.mutate({
        mutation: UPDATE_CART_ITEM,
        variables: {
          productId: "PRODUCT_ID_HERE",
          quantity: 3
        }
      })
    `)

    // 7. CLEAR_CART (requires authentication)
    console.log('\n7. Example CLEAR_CART mutation:')
    console.log(`
      const clearCartResult = await client.mutate({
        mutation: CLEAR_CART
      })
    `)

    // 8. ADD_TO_WISHLIST (requires authentication and valid productId)
    console.log('\n8. Example ADD_TO_WISHLIST mutation:')
    console.log(`
      const addToWishlistResult = await client.mutate({
        mutation: ADD_TO_WISHLIST,
        variables: {
          productId: "PRODUCT_ID_HERE"
        }
      })
    `)

    // 9. REMOVE_FROM_WISHLIST (requires authentication and valid productId)
    console.log('\n9. Example REMOVE_FROM_WISHLIST mutation:')
    console.log(`
      const removeFromWishlistResult = await client.mutate({
        mutation: REMOVE_FROM_WISHLIST,
        variables: {
          productId: "PRODUCT_ID_HERE"
        }
      })
    `)

    // 10. CLEAR_WISHLIST (requires authentication)
    console.log('\n10. Example CLEAR_WISHLIST mutation:')
    console.log(`
      const clearWishlistResult = await client.mutate({
        mutation: CLEAR_WISHLIST
      })
    `)

    console.log('\nFinished showing mutation examples!')
    console.log('\nNote: Some mutations require authentication or valid IDs to work properly.')
  } catch (error) {
    console.error('Error with mutation examples:', error)
  }
}

// Run the function
runAllMutations()