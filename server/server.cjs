const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const express = require('express');

// Sample data
const users = [
  { id: '1', email: 'test@example.com', name: 'Test User', isAdmin: false, password: 'password123' }
];

// Type definitions
const typeDefs = `#graphql
  type User {
    id: ID!
    email: String!
    name: String!
    isAdmin: Boolean!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    currentUser: User
  }

  type Mutation {
    login(email: String!, password: String!): AuthPayload
    signup(name: String!, email: String!, password: String!): AuthPayload
    logout: Boolean
  }
`;

// Resolvers
const resolvers = {
  Query: {
    currentUser: (parent, args, context) => {
      console.log('currentUser query called with token:', context.token);
      // In a real app, you would verify the token
      // For this mock, we'll just return a user if a token exists
      if (context.token) {
        console.log('Returning user:', users[0]);
        return users[0];
      }
      console.log('No token, returning null');
      return null;
    },
  },

  Mutation: {
    login: (parent, { email, password }) => {
      console.log('Login attempt with:', { email, password });
      console.log('Current users:', users);
      // Find user by email
      const user = users.find(u => u.email === email);
      console.log('Found user:', user);
      
      if (!user) {
        console.log('User not found, throwing error');
        throw new Error('Invalid email or password');
      }
      
      // In a real app, you would verify the password
      // For this mock, we'll just check if password is provided
      if (!password) {
        console.log('Password not provided, throwing error');
        throw new Error('Invalid email or password');
      }
      
      console.log('Login successful for user:', user.email);
      // Return token and user
      return {
        token: 'mock-jwt-token',
        user
      };
    },
    
    signup: (parent, { name, email, password }) => {
      console.log('Signup attempt with:', { name, email, password });
      // Check if user already exists
      const existingUser = users.find(u => u.email === email);
      console.log('Existing user check:', existingUser);
      
      if (existingUser) {
        console.log('User already exists, throwing error');
        throw new Error('User already exists');
      }
      
      // Create new user
      const newUser = {
        id: String(users.length + 1),
        email,
        name,
        isAdmin: false,
        password // In a real app, you would hash the password
      };
      
      users.push(newUser);
      console.log('New user created:', newUser);
      
      // Return token and user
      return {
        token: 'mock-jwt-token',
        user: newUser
      };
    },
    
    logout: () => {
      // In a real app, you would invalidate the token
      return true;
    }
  }
};

async function startServer() {
  // Create Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  // Start the server
  const { url } = await startStandaloneServer(server, {
    context: async ({ req }) => {
      // Get the token from the headers
      const token = req.headers.authorization || '';
      return { token };
    },
    listen: { port: 8082 },
    cors: {
      origin: ['http://localhost:3000', 'http://localhost:3001'],
      credentials: true,
    },
  });

  console.log(`Server ready at ${url}`);
}

// Start the server
startServer().catch(error => {
  console.error('Error starting server:', error);
});