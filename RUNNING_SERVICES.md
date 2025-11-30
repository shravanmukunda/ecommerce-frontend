# Running Services

## Services Status

All services are now running successfully:

### 1. Basic GraphQL Server
- **Port**: 8080
- **Endpoint**: http://localhost:8080
- **Type**: Simple authentication server
- **Started**: Yes

### 2. Enhanced GraphQL Server
- **Port**: 8081
- **Endpoint**: http://localhost:8081
- **Type**: Full e-commerce API with products, categories, cart, wishlist, orders
- **GraphQL Playground**: Available at http://localhost:8081
- **Started**: Yes

### 3. Next.js Frontend Application
- **Port**: 3001
- **Endpoint**: http://localhost:3001
- **Type**: AuraGaze e-commerce website
- **Started**: Yes

## How to Access

1. **Website**: Open your browser and go to http://localhost:3001
2. **GraphQL Playground**: Open your browser and go to http://localhost:8081
3. **API Endpoint**: http://localhost:8081/graphql (for GraphQL queries/mutations)

## Commands to Restart Services

If you need to restart any of the services:

```bash
# Start Basic GraphQL Server
node server/server.cjs

# Start Enhanced GraphQL Server
node server/enhanced-server.js

# Start Next.js Development Server
pnpm dev --port 3001
```

## Notes

- The frontend application is configured to communicate with the enhanced GraphQL server on port 8081
- Authentication tokens are stored in localStorage with the key 'authToken'
- The application uses Apollo Client for GraphQL operations