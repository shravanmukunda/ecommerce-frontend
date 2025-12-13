export default function DebugPage() {
  return (
    <pre>
      {JSON.stringify({
        clerkPublishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
        graphqlUrl: process.env.NEXT_PUBLIC_GRAPHQL_URL,
      }, null, 2)}
    </pre>
  );
}
