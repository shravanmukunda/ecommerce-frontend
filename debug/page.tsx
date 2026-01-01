export default function DebugPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Environment Variables Debug</h1>
      <pre className="bg-gray-100 p-4 rounded">
        {JSON.stringify({
          NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "NOT SET (using fallback: http://localhost:8081/query)",
          NEXT_PUBLIC_GRAPHQL_URL: process.env.NEXT_PUBLIC_GRAPHQL_URL || "NOT SET",
          NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? "SET" : "NOT SET",
          note: "NEXT_PUBLIC_* variables are embedded at BUILD TIME. Restart dev server or rebuild after changing them.",
        }, null, 2)}
      </pre>
      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <p className="font-semibold">⚠️ Important:</p>
        <p>If you changed NEXT_PUBLIC_API_URL, you must:</p>
        <ul className="list-disc list-inside mt-2">
          <li>Stop your dev server (Ctrl+C)</li>
          <li>Restart it: <code className="bg-gray-200 px-2 py-1 rounded">pnpm dev</code></li>
          <li>Or rebuild for production: <code className="bg-gray-200 px-2 py-1 rounded">pnpm build</code></li>
        </ul>
      </div>
    </div>
  );
}
