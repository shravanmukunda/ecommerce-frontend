import { ApolloClient, InMemoryCache, HttpLink, from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:8081/query",
});

// Create a function that can be called to get the current token
let getCurrentToken: () => Promise<string | null> = async () => null;

export const setGetCurrentToken = (getTokenFn: () => Promise<string | null>) => {
  getCurrentToken = getTokenFn;
};

const authLink = setContext(async (_, { headers }) => {
  try {
    const token = await getCurrentToken();
    
    return {
      headers: {
        ...headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    };
  } catch (error) {
    console.error("Error getting auth token:", error);
    return { headers };
  }
});

// Export a function that creates the client, rather than creating it immediately
export const createApolloClient = () => {
  return new ApolloClient({
    link: from([authLink, httpLink]),
    cache: new InMemoryCache(),
  });
};

// For backward compatibility, we'll still export a client instance
export const client = createApolloClient();