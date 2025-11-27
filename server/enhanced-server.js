import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

// Sample data
const users = [
  { id: '1', email: 'test@example.com', name: 'Test User', isAdmin: false, password: 'password123', createdAt: '2023-01-01' }
];

const categories = [
  { id: '1', name: 'Clothing', slug: 'clothing', image: '/images/clothing.jpg' },
  { id: '2', name: 'Accessories', slug: 'accessories', image: '/images/accessories.jpg' },
  { id: '3', name: 'Footwear', slug: 'footwear', image: '/images/footwear.jpg' }
];

const products = [
  { 
    id: '1', 
    name: 'Premium T-Shirt', 
    description: 'Comfortable cotton t-shirt',
    price: 29.99,
    image: '/images/tshirt.jpg',
    hoverImage: '/images/tshirt-hover.jpg',
    images: ['/images/tshirt-1.jpg', '/images/tshirt-2.jpg'],
    category: 'Clothing',
    inStock: true,
    materials: '100% Cotton',
    careInstructions: 'Machine wash cold',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White', 'Black', 'Blue']
  },
  { 
    id: '2', 
    name: 'Designer Jeans', 
    description: 'Slim fit designer jeans',
    price: 89.99,
    image: '/images/jeans.jpg',
    hoverImage: '/images/jeans-hover.jpg',
    images: ['/images/jeans-1.jpg', '/images/jeans-2.jpg'],
    category: 'Clothing',
    inStock: true,
    materials: 'Denim',
    careInstructions: 'Machine wash cold, inside out',
    sizes: ['28', '30', '32', '34'],
    colors: ['Blue', 'Black']
  }
];

const carts = [
  {
    id: 'cart-1',
    userId: '1',
    items: [
      {
        product: products[0],
        quantity: 2,
        size: 'M',
        color: 'Black'
      }
    ],
    totalItems: 2,
    subtotal: 59.98
  }
];

const wishlists = [
  {
    id: 'wishlist-1',
    userId: '1',
    items: [
      {
        product: products[1]
      }
    ],
    totalItems: 1
  }
];

const orders = [
  {
    id: 'order-1',
    orderNumber: 'ORD-2023-001',
    status: 'Shipped',
    total: 89.99,
    createdAt: '2023-01-15',
    items: [
      {
        product: products[1],
        quantity: 1
      }
    ],
    shippingAddress: {
      fullName: 'Test User',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    billingAddress: {
      fullName: 'Test User',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    }
  }
];

// Enhanced Type definitions
const typeDefs = `#graphql
  type User {
    id: ID!
    email: String!
    name: String!
    isAdmin: Boolean!
    createdAt: String
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Category {
    id: ID!
    name: String!
    slug: String!
    image: String
  }

  type Product {
    id: ID!
    name: String!
    description: String
    price: Float!
    image: String
    hoverImage: String
    images: [String]
    category: String
    inStock: Boolean
    materials: String
    careInstructions: String
    sizes: [String]
    colors: [String]
  }

  type CartItem {
    product: Product!
    quantity: Int!
    size: String
    color: String
  }

  type Cart {
    id: ID!
    items: [CartItem!]!
    totalItems: Int!
    subtotal: Float!
  }

  type WishlistItem {
    product: Product!
  }

  type Wishlist {
    id: ID!
    items: [WishlistItem!]!
    totalItems: Int!
  }

  type Address {
    fullName: String!
    address: String!
    city: String!
    state: String!
    zipCode: String!
    country: String!
  }

  type OrderItem {
    product: Product!
    quantity: Int!
    size: String
    color: String
  }

  type Order {
    id: ID!
    orderNumber: String!
    status: String!
    total: Float!
    createdAt: String!
    items: [OrderItem!]!
    shippingAddress: Address
    billingAddress: Address
  }

  type Query {
    currentUser: User
    userProfile(userId: ID!): User
    products(category: String, limit: Int, offset: Int): [Product!]!
    product(id: ID!): Product
    searchProducts(query: String!, limit: Int): [Product!]!
    categories: [Category!]!
    cart: Cart
    wishlist: Wishlist
    orders: [Order!]!
    order(id: ID!): Order
  }

  type Mutation {
    login(email: String!, password: String!): AuthPayload
    signup(name: String!, email: String!, password: String!): AuthPayload
    logout: Boolean
    addToCart(productId: ID!, quantity: Int!, size: String, color: String): Cart
    removeFromCart(productId: ID!): Cart
    updateCartItem(productId: ID!, quantity: Int!): Cart
    clearCart: Cart
    addToWishlist(productId: ID!): Wishlist
    removeFromWishlist(productId: ID!): Wishlist
    clearWishlist: Wishlist
  }
`;

// Enhanced Resolvers
const resolvers = {
  Query: {
    currentUser: (parent, args, context) => {
      // In a real app, you would verify the token
      // For this mock, we'll just return a user if a token exists
      if (context.token) {
        return users[0];
      }
      return null;
    },
    userProfile: (parent, { userId }) => {
      return users.find(user => user.id === userId) || null;
    },
    products: (parent, { category, limit, offset }) => {
      let filteredProducts = products;
      
      if (category) {
        filteredProducts = products.filter(product => product.category === category);
      }
      
      if (offset) {
        filteredProducts = filteredProducts.slice(offset);
      }
      
      if (limit) {
        filteredProducts = filteredProducts.slice(0, limit);
      }
      
      return filteredProducts;
    },
    product: (parent, { id }) => {
      return products.find(product => product.id === id) || null;
    },
    searchProducts: (parent, { query, limit }) => {
      const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
      );
      
      if (limit) {
        return filteredProducts.slice(0, limit);
      }
      
      return filteredProducts;
    },
    categories: () => {
      return categories;
    },
    cart: (parent, args, context) => {
      // In a real app, you would find the cart for the authenticated user
      if (context.token) {
        return carts[0];
      }
      return null;
    },
    wishlist: (parent, args, context) => {
      // In a real app, you would find the wishlist for the authenticated user
      if (context.token) {
        return wishlists[0];
      }
      return null;
    },
    orders: (parent, args, context) => {
      // In a real app, you would find orders for the authenticated user
      if (context.token) {
        return orders;
      }
      return [];
    },
    order: (parent, { id }, context) => {
      // In a real app, you would verify the order belongs to the authenticated user
      if (context.token) {
        return orders.find(order => order.id === id) || null;
      }
      return null;
    }
  },
  Mutation: {
    login: (parent, { email, password }) => {
      // Find user by email
      const user = users.find(u => u.email === email);
      
      if (!user) {
        throw new Error('Invalid email or password');
      }
      
      // In a real app, you would verify the password
      // For this mock, we'll just check if password is provided
      if (!password) {
        throw new Error('Invalid email or password');
      }
      
      // Return token and user
      return {
        token: 'mock-jwt-token',
        user
      };
    },
    
    signup: (parent, { name, email, password }) => {
      // Check if user already exists
      const existingUser = users.find(u => u.email === email);
      
      if (existingUser) {
        throw new Error('User already exists');
      }
      
      // Create new user
      const newUser = {
        id: String(users.length + 1),
        email,
        name,
        isAdmin: false,
        password, // In a real app, you would hash the password
        createdAt: new Date().toISOString()
      };
      
      users.push(newUser);
      
      // Return token and user
      return {
        token: 'mock-jwt-token',
        user: newUser
      };
    },
    
    logout: () => {
      // In a real app, you would invalidate the token
      return true;
    },
    
    addToCart: (parent, { productId, quantity, size, color }, context) => {
      if (!context.token) {
        throw new Error('Authentication required');
      }
      
      // In a real app, you would update the user's cart
      // For this mock, we'll just return the existing cart
      return carts[0];
    },
    
    removeFromCart: (parent, { productId }, context) => {
      if (!context.token) {
        throw new Error('Authentication required');
      }
      
      // In a real app, you would update the user's cart
      // For this mock, we'll just return the existing cart
      return carts[0];
    },
    
    updateCartItem: (parent, { productId, quantity }, context) => {
      if (!context.token) {
        throw new Error('Authentication required');
      }
      
      // In a real app, you would update the user's cart
      // For this mock, we'll just return the existing cart
      return carts[0];
    },
    
    clearCart: (parent, args, context) => {
      if (!context.token) {
        throw new Error('Authentication required');
      }
      
      // In a real app, you would clear the user's cart
      // For this mock, we'll just return the existing cart with empty items
      return {
        ...carts[0],
        items: [],
        totalItems: 0,
        subtotal: 0
      };
    },
    
    addToWishlist: (parent, { productId }, context) => {
      if (!context.token) {
        throw new Error('Authentication required');
      }
      
      // In a real app, you would update the user's wishlist
      // For this mock, we'll just return the existing wishlist
      return wishlists[0];
    },
    
    removeFromWishlist: (parent, { productId }, context) => {
      if (!context.token) {
        throw new Error('Authentication required');
      }
      
      // In a real app, you would update the user's wishlist
      // For this mock, we'll just return the existing wishlist
      return wishlists[0];
    },
    
    clearWishlist: (parent, args, context) => {
      if (!context.token) {
        throw new Error('Authentication required');
      }
      
      // In a real app, you would clear the user's wishlist
      // For this mock, we'll just return the existing wishlist with empty items
      return {
        ...wishlists[0],
        items: [],
        totalItems: 0
      };
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
    listen: { port: 8081 },
    cors: {
      origin: ['http://localhost:3000', 'http://localhost:3002'],
      credentials: true,
    },
  });

  console.log(`🚀 Enhanced GraphQL Server ready at ${url}`);
}

// Start the server
startServer().catch(error => {
  console.error('Error starting server:', error);
});