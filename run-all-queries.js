// Example script showing how to run all GraphQL queries
import client from './lib/apolloClient.js'
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
} from './lib/graphql/queries'

async function runAllQueries() {
  try {
    console.log('Running all GraphQL queries...\n')

    // 1. GET_CURRENT_USER
    console.log('1. Running GET_CURRENT_USER...')
    try {
      const currentUserResult = await client.query({
        query: GET_CURRENT_USER
      })
      console.log('Current user:', currentUserResult.data.currentUser)
    } catch (error) {
      console.log('Not authenticated or error fetching current user')
    }

    // 2. GET_USER_PROFILE
    console.log('\n2. Running GET_USER_PROFILE...')
    // Note: Requires a valid userId
    // const userProfileResult = await client.query({
    //   query: GET_USER_PROFILE,
    //   variables: { userId: "USER_ID_HERE" }
    // })
    // console.log('User profile:', userProfileResult.data.userProfile)

    // 3. GET_PRODUCTS
    console.log('\n3. Running GET_PRODUCTS...')
    const productsResult = await client.query({
      query: GET_PRODUCTS,
      variables: { category: null, limit: 10, offset: 0 }
    })
    console.log('Products count:', productsResult.data.products.length)

    // 4. GET_PRODUCT
    console.log('\n4. Running GET_PRODUCT...')
    // Note: Requires a valid productId
    // const productResult = await client.query({
    //   query: GET_PRODUCT,
    //   variables: { id: "PRODUCT_ID_HERE" }
    // })
    // console.log('Product:', productResult.data.product)

    // 5. SEARCH_PRODUCTS
    console.log('\n5. Running SEARCH_PRODUCTS...')
    const searchResult = await client.query({
      query: SEARCH_PRODUCTS,
      variables: { query: "shirt", limit: 5 }
    })
    console.log('Search results count:', searchResult.data.searchProducts.length)

    // 6. GET_CATEGORIES
    console.log('\n6. Running GET_CATEGORIES...')
    const categoriesResult = await client.query({
      query: GET_CATEGORIES
    })
    console.log('Categories count:', categoriesResult.data.categories.length)

    // 7. GET_CART
    console.log('\n7. Running GET_CART...')
    try {
      const cartResult = await client.query({
        query: GET_CART
      })
      console.log('Cart items count:', cartResult.data.cart.items.length)
    } catch (error) {
      console.log('Not authenticated or error fetching cart')
    }

    // 8. GET_WISHLIST
    console.log('\n8. Running GET_WISHLIST...')
    try {
      const wishlistResult = await client.query({
        query: GET_WISHLIST
      })
      console.log('Wishlist items count:', wishlistResult.data.wishlist.items.length)
    } catch (error) {
      console.log('Not authenticated or error fetching wishlist')
    }

    // 9. GET_ORDERS
    console.log('\n9. Running GET_ORDERS...')
    try {
      const ordersResult = await client.query({
        query: GET_ORDERS
      })
      console.log('Orders count:', ordersResult.data.orders.length)
    } catch (error) {
      console.log('Not authenticated or error fetching orders')
    }

    // 10. GET_ORDER
    console.log('\n10. Running GET_ORDER...')
    // Note: Requires a valid orderId
    // const orderResult = await client.query({
    //   query: GET_ORDER,
    //   variables: { id: "ORDER_ID_HERE" }
    // })
    // console.log('Order:', orderResult.data.order)

    console.log('\nFinished running queries!')
  } catch (error) {
    console.error('Error running queries:', error)
  }
}

// Run the function
runAllQueries()