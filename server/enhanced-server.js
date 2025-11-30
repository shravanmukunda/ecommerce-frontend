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
  }

  type Mutation {
    register(input: RegisterInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    updateProfile(name: String, phone: String, address: String): User!
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
    }
  }
};

async function start() {
  const app = express();

  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();

  app.use(
    "/graphql",
    cors({ origin: ["http://localhost:3000"], credentials: true }),
    bodyParser.json({ limit: "5mb" }),
    expressMiddleware(server, {
      context: async ({ req }) => {
        return {
          token: req.headers.authorization || "",
          query: req.body.query,
          variables: req.body.variables
        };
      }
    })
  );

  app.listen(8081, () => {
    console.log("🚀 Gateway running at http://localhost:8081/graphql");
  });
}

start();
