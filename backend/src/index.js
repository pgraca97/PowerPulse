// backend/src/index.js
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { typeDefs } from './graphql/schema/index.js';
import { resolvers } from './graphql/resolvers/index.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

dotenv.config();

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read the service account file
const serviceAccount = JSON.parse(
  fs.readFileSync(
    join(__dirname, '../config/firebase-service-account.json'),
    'utf8'
  )
);

// Initialize Firebase Admin
initializeApp({
  credential: cert(serviceAccount)
});

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
    // Get the token from the Authorization header
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return { user: null };
    }

    try {
      // Verify the Firebase token
      const decodedToken = await getAuth().verifyIdToken(token);
      return { user: decodedToken };
    } catch (error) {
      console.error('Token verification error:', error);
      return { user: null };
    }
  },
  listen: { port: process.env.PORT || 4000 }
});