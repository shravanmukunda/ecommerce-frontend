import express from "express";
import cors from "cors";
import fetch from "node-fetch";

// RULE 8: Environment variable controls backend
const GO_BACKEND_URL =
  process.env.GO_BACKEND_URL || "http://localhost:8080/query";

const app = express();

// RULE 5: CORS must allow Authorization
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
  ],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "OPTIONS"],
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "5mb" }));

// RULE 6: Always log auth once (for debugging)
// RULE 1: Pure pass-through - forward { query, variables }
// RULE 2: Authorization header MUST be forwarded
app.post("/query", async (req, res) => {
  const { query, variables } = req.body;
  
  // RULE 2: Extract Authorization header as-is
  const token = req.headers.authorization || "";
  
  // RULE 6: Log auth once for debugging
  console.log("Auth header:", token ? "YES" : "NO");
  
  // RULE 1: Forward { query, variables } as-is
  // RULE 2: Forward Authorization header as-is
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: token } : {}),
  };
  
  try {
    const response = await fetch(GO_BACKEND_URL, {
      method: "POST",
      headers,
      body: JSON.stringify({ query, variables }),
    });
    
    const result = await response.json();
    
    // Forward status and result as-is
    res.status(response.status).json(result);
  } catch (error) {
    console.error("Error forwarding to backend:", error);
    res.status(500).json({
      errors: [
        {
          message: "Failed to forward request to backend",
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        },
      ],
    });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    backend: GO_BACKEND_URL,
    timestamp: new Date().toISOString(),
  });
});

const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
  console.log("=".repeat(50));
  console.log("✅ GraphQL Proxy Server (Pure Pass-Through)");
  console.log(`📍 Listening on: http://localhost:${PORT}/query`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log(`📡 Forwarding to: ${GO_BACKEND_URL}`);
  console.log("=".repeat(50));
});

export { app };

