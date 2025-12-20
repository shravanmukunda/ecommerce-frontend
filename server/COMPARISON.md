# Server Files Comparison: `server.js` vs `enhanced-server.js`

## 📊 Quick Comparison

| Feature | `server.js` ✅ | `enhanced-server.js` ❌ |
|---------|----------------|------------------------|
| **Architecture** | Pure Express proxy | Apollo Server + Express |
| **Type Definitions** | None (pass-through) | Full GraphQL schema defined |
| **Resolvers** | None (direct forward) | Individual resolvers per operation |
| **Token Handling** | Forwards as-is | Modifies (adds "Bearer" prefix) |
| **Rule Compliance** | ✅ All 10 rules | ❌ Violates multiple rules |
| **Complexity** | ~90 lines | ~500 lines |
| **Dependencies** | Express, CORS, fetch | + Apollo Server, body-parser |

---

## 🎯 Role Explanation

### `server.js` - **Pure Pass-Through Proxy** ✅

**Role:** Simple HTTP proxy that forwards GraphQL requests unchanged.

**What it does:**
1. Receives POST request at `/query` with `{ query, variables }`
2. Extracts `Authorization` header **as-is** (no modification)
3. Forwards to Go backend at `GO_BACKEND_URL`
4. Returns backend response **as-is**

**Flow:**
```
Frontend (Next.js + Clerk)
  ↓ [POST /query with Authorization: Bearer <token>]
server.js
  ↓ [Forwards unchanged to Go backend]
Go Backend (validates token)
  ↓ [Returns GraphQL response]
server.js
  ↓ [Returns unchanged to frontend]
Frontend
```

**Why it's correct:**
- ✅ Follows all 10 rules
- ✅ No GraphQL schema modification
- ✅ No token manipulation
- ✅ One request in → one request out
- ✅ Backend controls all GraphQL logic

---

### `enhanced-server.js` - **Apollo Server Wrapper** ❌

**Role:** Apollo Server that wraps the Go backend with its own GraphQL layer.

**What it does:**
1. Defines its own GraphQL schema (typeDefs)
2. Creates resolvers for each query/mutation
3. Each resolver calls `forward()` function
4. Modifies tokens (adds "Bearer" if missing)
5. Processes responses through Apollo's error handling

**Flow:**
```
Frontend
  ↓
Apollo Server (enhanced-server.js)
  ↓ [Parses query, validates against typeDefs]
Resolvers (me, getCart, addToCart, etc.)
  ↓ [Each resolver calls forward()]
Go Backend
  ↓
Resolvers (process response)
  ↓ [Apollo formats response]
Frontend
```

**Why it's problematic:**
- ❌ **RULE 1 Violation:** Defines GraphQL schema (should be pass-through)
- ❌ **RULE 2 Violation:** Modifies token (`cleanToken` logic)
- ❌ **RULE 4 Violation:** Not one-request-in-one-request-out (Apollo processes first)
- ❌ **RULE 3 Violation:** Implicitly depends on understanding GraphQL structure
- ❌ Adds unnecessary complexity (500 lines vs 90 lines)
- ❌ Duplicates schema that already exists in Go backend

---

## ✅ Recommendation: Keep `server.js`, Archive `enhanced-server.js`

### Action Plan:

1. **Use `server.js` as the primary server** ✅
   - It's the correct implementation per your rules
   - Simple, maintainable, and compliant

2. **Rename `enhanced-server.js` to `enhanced-server.js.backup`**
   - Keep it for reference if needed
   - But don't use it in production

3. **Update `package.json` scripts:**
   - `graphql` → runs `server.js` ✅ (already done)
   - `graphql:enhanced` → runs old version (for reference only)

---

## 🔍 Key Differences Explained

### 1. Token Handling

**`server.js` (Correct):**
```javascript
const token = req.headers.authorization || "";
// Forwards exactly as received: "Bearer <token>" or ""
```

**`enhanced-server.js` (Wrong):**
```javascript
const cleanToken = token?.startsWith("Bearer ")
  ? token
  : token
  ? `Bearer ${token}`
  : "";
// Modifies token - violates RULE 2
```

### 2. Request Flow

**`server.js` (Correct):**
```javascript
app.post("/query", async (req, res) => {
  // Direct forward - one request in, one out
  const response = await fetch(GO_BACKEND_URL, {
    headers: { Authorization: token },
    body: JSON.stringify({ query, variables })
  });
  res.status(response.status).json(await response.json());
});
```

**`enhanced-server.js` (Wrong):**
```javascript
// Apollo Server processes first
const server = new ApolloServer({ typeDefs, resolvers });
// Then each resolver forwards individually
me: async (_, vars, ctx) => {
  const r = await forward(ctx.query, ctx.variables, ctx.token);
  return r.data?.me; // Processes response
}
```

### 3. Schema Definition

**`server.js` (Correct):**
- No schema - pure pass-through ✅

**`enhanced-server.js` (Wrong):**
- Defines 164 lines of GraphQL schema
- Duplicates what Go backend already has ❌

---

## 🎯 Final Verdict

**Use `server.js`** - It's the correct implementation that follows all 10 rules.

**Archive `enhanced-server.js`** - It was an attempt to add Apollo Server features, but violates the core principle of being a pure pass-through.

---

## 🚀 Next Steps

1. ✅ `server.js` is ready to use
2. Rename `enhanced-server.js` → `enhanced-server.js.backup`
3. Test with: `npm run graphql`
4. Verify cart works with logged-in user

