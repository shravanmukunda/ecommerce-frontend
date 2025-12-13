import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import bodyParser from "body-parser";
import cors from "cors";
import fetch from "node-fetch";

const GO_BACKEND_URL = "http://localhost:8080/query";

const typeDefs = `#graphql
  type User {
    id: ID!
    email: String!
    name: String!
    phone: String
    address: String
    role: String!
    createdAt: String!
  }

  input RegisterInput {
    email: String!
    password: String!
    name: String!
    phone: String
    address: String
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    me: User!
    getUser(id: ID!): User
    getCart(cartId: ID, forUser: Boolean): Cart
  }

  type Product {
    id: ID!
    name: String!
    basePrice: Float!
    description: String!
    designImageURL: String!
  }

  type CartItem {
    id: ID!
    productId: ID!
    variantId: String
    quantity: Int!
    unitPrice: Float!
    createdAt: String
    updatedAt: String
  }

  type Cart {
    id: ID!
    userId: String
    totalAmount: Float!
    items: [CartItem!]!
  }

  input AddToCartInput {
    productId: ID!
    variantId: String!
    quantity: Int!
    cartId: String
  }

  type AddToCartPayload {
    cart: Cart!
  }

  input RemoveCartItemInput {
    cartItemID: String!
    cartID: String!
  }

  type RemoveCartItemPayload {
    cart: Cart!
  }

  input ClearCartInput {
    cartID: String!
  }

  type ClearCartPayload {
    cart: Cart!
  }

  input AttachCartToUserInput {
    cartID: String!
    userID: String!
  }

  type AttachCartToUserPayload {
    cart: Cart!
  }

  type CreateOrderInput {
    shippingAddress: String!
  }

  type Order {
    id: ID!
    shippingAddress: String!
    createdAt: String!
  }

  type CreateOrderPayload {
    id: ID!
  }

  type Mutation {
    register(input: RegisterInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    updateProfile(name: String, phone: String, address: String): User!
    addToCart(input: AddToCartInput!): AddToCartPayload!
    removeCartItem(input: RemoveCartItemInput!): RemoveCartItemPayload!
    clearCart(input: ClearCartInput!): ClearCartPayload!
    attachCartToUser(input: AttachCartToUserInput!): AttachCartToUserPayload!
    createOrder(input: CreateOrderInput!): CreateOrderPayload!
  }
`;

async function forward(query, variables, token) {
  const response = await fetch(GO_BACKEND_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: token } : {})
    },
    body: JSON.stringify({ query, variables })
  });

  return response.json();
}

const resolvers = {
  Query: {
    me: async (_, vars, ctx) => {
      const r = await forward(ctx.query, ctx.variables, ctx.token);
      if (r.errors) throw new Error(r.errors[0].message);
      return r.data.me;
    },
    getUser: async (_, vars, ctx) => {
      const r = await forward(ctx.query, ctx.variables, ctx.token);
      if (r.errors) throw new Error(r.errors[0].message);
      return r.data.getUser;
    },
    getCart: async (_, vars, ctx) => {
      const r = await forward(ctx.query, ctx.variables, ctx.token);
      if (r.errors) throw new Error(r.errors[0].message);
      return r.data.getCart;
    }
  },

  Mutation: {
    register: async (_, vars, ctx) => {
      const r = await forward(ctx.query, ctx.variables, ctx.token);
      if (r.errors) throw new Error(r.errors[0].message);
      return r.data.register;
    },

    login: async (_, vars, ctx) => {
      const r = await forward(ctx.query, ctx.variables, ctx.token);
      if (r.errors) throw new Error(r.errors[0].message);
      return r.data.login;
    },

    updateProfile: async (_, vars, ctx) => {
      const r = await forward(ctx.query, ctx.variables, ctx.token);
      if (r.errors) throw new Error(r.errors[0].message);
      return r.data.updateProfile;
    },

    addToCart: async (_, { input }, ctx) => {
      const r = await forward(ctx.query, ctx.variables, ctx.token);
      if (r.errors) throw new Error(r.errors[0].message);
      return r.data.addToCart;
    },

    removeCartItem: async (_, { input }, ctx) => {
      const r = await forward(ctx.query, ctx.variables, ctx.token);
      if (r.errors) throw new Error(r.errors[0].message);
      return r.data.removeCartItem;
    },

    clearCart: async (_, { input }, ctx) => {
      const r = await forward(ctx.query, ctx.variables, ctx.token);
      if (r.errors) throw new Error(r.errors[0].message);
      return r.data.clearCart;
    },

    attachCartToUser: async (_, { input }, ctx) => {
      const r = await forward(ctx.query, ctx.variables, ctx.token);
      if (r.errors) throw new Error(r.errors[0].message);
      return r.data.attachCartToUser;
    },

    createOrder: async (_, { input }, ctx) => {
      const r = await forward(ctx.query, ctx.variables, ctx.token);
      if (r.errors) throw new Error(r.errors[0].message);
      return r.data.createOrder;
    }
  }
};

async function start() {
  const app = express();

  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();

  // Enhanced CORS configuration to handle multiple environments
const GO_BACKEND_URL =
  process.env.GO_BACKEND_URL || "https://tshirt-ecommerce-api.onrender.com/query";

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8081",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(
  "/query",
  cors(corsOptions),
  bodyParser.json({ limit: "5mb" }),
  expressMiddleware(server, {
    context: async ({ req }) => ({
      token: req.headers.authorization || "",
      query: req.body.query,
      variables: req.body.variables
    }),
  })
);

async function forward(query, variables, token) {
  const cleanToken = token?.startsWith("Bearer ")
    ? token
    : token
    ? `Bearer ${token}`
    : "";

  const response = await fetch(GO_BACKEND_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(cleanToken ? { Authorization: cleanToken } : {})
    },
    body: JSON.stringify({ query, variables })
  });

  return response.json();
}
}