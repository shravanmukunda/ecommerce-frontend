import { ApolloClient, InMemoryCache, HttpLink, from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

// Always read GraphQL URL from env
const GRAPHQL_URL =
  process.env.NEXT_PUBLIC_GRAPHQL_URL ||
  "http://localhost:8081/query"; // fallback for local dev

const httpLink = new HttpLink({
  uri: GRAPHQL_URL,
});

// Function will be assigned later by Providers
let getCurrentToken: () => Promise<string | null> = async () => null;

export const setGetCurrentToken = (
  getTokenFn: () => Promise<string | null>
) => {
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
    console.error("Error getting Clerk token:", error);
    return { headers };
  }
});

export const createApolloClient = () => {
  return new ApolloClient({
    link: from([authLink, httpLink]),
    cache: new InMemoryCache(),
  });
};

export const client = createApolloClient();
