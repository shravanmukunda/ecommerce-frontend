import { ApolloClient, InMemoryCache, HttpLink, from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";

// Always read GraphQL URL from env
const GRAPHQL_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8081/query";

const httpLink = new HttpLink({
  uri: GRAPHQL_URL,
  credentials: "include"
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
    
    console.log("🔐 Auth token status:", token ? "✅ Present" : "❌ Missing");
    if (token) {
      console.log("🔐 Token value:", token.substring(0, 20) + "...");
    }

    // Dev mode: allow requests without token (backend has dev user fallback)
    // If token is available, send it; otherwise backend will use dev user
    const newHeaders = {
      ...headers,
      ...(token && { Authorization: `Bearer ${token}` }),
    };
    
    console.log("📤 Request headers:", {
      hasAuth: !!newHeaders.Authorization,
      authLength: newHeaders.Authorization?.length || 0,
    });

    return {
      headers: newHeaders,
    };
  } catch (error) {
    console.error("❌ Error getting Clerk token:", error);
    return { headers };
  }
});

const errorLink = onError(({ graphQLErrors, networkError }: any) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }: any) =>
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
    if ('statusCode' in networkError) {
      console.error(`Status Code: ${(networkError as any).statusCode}`);
    }
  }
});

export const createApolloClient = () => {
  return new ApolloClient({
    link: from([errorLink, authLink, httpLink]),
    cache: new InMemoryCache(),
  });
};

export const client = createApolloClient();