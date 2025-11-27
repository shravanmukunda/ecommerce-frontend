import client from './lib/apolloClient.js'
import { gql } from '@apollo/client'

// Test query
const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
    }
  }
`;

async function testQuery() {
  try {
    console.log('Testing GraphQL query...');
    const result = await client.query({
      query: GET_CATEGORIES
    });
    console.log('Categories:', JSON.stringify(result.data.categories, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testQuery();