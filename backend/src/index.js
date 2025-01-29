// backend/src/index.js
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from 'cors';
import { typeDefs } from "./graphql/schema/index.js";
import { resolvers } from "./graphql/resolvers/index.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";

dotenv.config();

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read the service account file
const serviceAccount = JSON.parse(
  fs.readFileSync(
    join(__dirname, "../config/firebase-service-account.json"),
    "utf8"
  )
);

// Initialize Firebase Admin
initializeApp({
  credential: cert(serviceAccount),
});

// Create schema
const schema = makeExecutableSchema({ 
  typeDefs, 
  resolvers 
});

// Create Express app and HTTP server
const app = express();
const httpServer = createServer(app);

// Create WebSocket server
const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql',
});

// WebSocket server setup with authentication
const serverCleanup = useServer({
  schema,
  context: async (ctx) => {
    // Get the token from the connection params
    const token = ctx.connectionParams?.Authorization?.replace('Bearer ', '');
    
    if (!token) {
      return { user: null };
    }

    try {
      const decodedToken = await getAuth().verifyIdToken(token);
      return { user: decodedToken };
    } catch (error) {
      return { user: null };
    }
  },
}, wsServer);

// Create Apollo Server
const server = new ApolloServer({
  schema,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});

// Connect to MongoDB
await mongoose.connect(process.env.MONGODB_URI);
console.log("Connected to MongoDB");

// Start the server
await server.start();

// Apply middleware
app.use(
  '/graphql',
  cors(),
  express.json(),
  expressMiddleware(server, {
    context: async ({ req }) => {
      const token = req.headers.authorization?.replace("Bearer ", "");
      
      if (!token) {
        return { user: null };
      }

      try {
        const decodedToken = await getAuth().verifyIdToken(token);
        return { user: decodedToken };
      } catch (error) {
        console.error("Token verification error:", error);
        return { user: null };
      }
    },
  }),
);

// Start the server
const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
  console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}/graphql`);
});