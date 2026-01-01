# Environment Configuration

This document describes the environment variables needed to configure the application to use a deployed backend.

## Required Environment Variables

### Backend URLs

1. **`GO_BACKEND_URL`** (used by proxy server in `server/server.js`)
   - Local: `http://localhost:8080/query`
   - Production: `https://your-deployed-backend.com/query`

2. **`GRAPHQL_BACKEND_URL`** (used by Next.js API routes)
   - Local: `http://localhost:8080/query`
   - Production: `https://your-deployed-backend.com/query`

3. **`NEXT_PUBLIC_API_URL`** or **`NEXT_PUBLIC_GRAPHQL_URL`** (used by Apollo Client in browser)
   - Local: `http://localhost:8081/query` (proxy server)
   - Production: `https://your-deployed-frontend.com/api/graphql` or direct backend URL
   - Note: The code checks for both variable names, with `NEXT_PUBLIC_API_URL` taking precedence

### Other Configuration

- **`PORT`**: Port for the proxy server (default: 8081)
- **`CORS_ORIGINS`**: Comma-separated list of allowed CORS origins (default: localhost URLs)
  - Example: `https://yourdomain.com,https://www.yourdomain.com`
- **`RAZORPAY_KEY_ID`**: Razorpay API key
- **`RAZORPAY_KEY_SECRET`**: Razorpay API secret
- **`RAZORPAY_WEBHOOK_SECRET`**: Razorpay webhook secret

## Setup Instructions

1. Create a `.env.local` file in the root directory
2. Add the environment variables with your deployed backend URLs:

```bash
# Deployed Backend Configuration
GO_BACKEND_URL=https://your-deployed-backend.com/query
GRAPHQL_BACKEND_URL=https://your-deployed-backend.com/query
NEXT_PUBLIC_API_URL=https://your-deployed-backend.com/query
# OR use NEXT_PUBLIC_GRAPHQL_URL (both are supported):
NEXT_PUBLIC_GRAPHQL_URL=https://your-deployed-backend.com/query

# Or if using a proxy:
NEXT_PUBLIC_API_URL=https://your-deployed-frontend.com/api/graphql
```

3. Restart your development server or rebuild your application

## How It Works

- **Frontend (Apollo Client)**: Uses `NEXT_PUBLIC_API_URL` to connect to the GraphQL endpoint
- **Proxy Server**: Uses `GO_BACKEND_URL` to forward requests to the Go backend
- **API Routes**: Use `GRAPHQL_BACKEND_URL` for server-side GraphQL requests

All components fall back to localhost URLs if environment variables are not set, making local development easier.

