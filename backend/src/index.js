// src/index.js
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { typeDefs } from './graphql/schema/index.js';
import { resolvers } from './graphql/resolvers/index.js';

dotenv.config();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (error) => {
    console.error('GraphQL Error:', error);
    return error;
  },
});

await mongoose.connect(process.env.MONGODB_URI);
console.log('Connected to MongoDB');

const { url } = await startStandaloneServer(server, {
  context: async ({ req }) => {
    // Com Auth0, o token já vem validado no header
    const user = req.headers.user ? JSON.parse(req.headers.user) : null;
    return { user };
  },
  listen: { port: process.env.PORT || 4000 }
});

console.log(`🚀 Server ready at ${url}`);