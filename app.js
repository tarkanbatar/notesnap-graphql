require("dotenv").config();

const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const { createServer } = require("http");
const { ApolloServerPluginDrainHttpServer } = require("apollo-server-core");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { WebSocketServer } = require("ws");
const { useServer } = require("graphql-ws/use/ws");
const path = require("path");
const { loadFilesSync } = require("@graphql-tools/load-files");
const { mergeTypeDefs } = require("@graphql-tools/merge");
const { PubSub } = require("graphql-subscriptions");
const resolvers = require("./graphql/resolvers");
const User = require("./database/models/User");
const Snap = require("./database/models/Snap");
const jwt = require("jsonwebtoken");

// Create PubSub instance
const pubsub = new PubSub();

const typesArray = loadFilesSync(path.join(__dirname, "graphql", "**/*.graphql"));
const typeDefs = mergeTypeDefs(typesArray); 

const db = require("./database/database");
const app = express();
const httpServer = createServer(app);

// Create schema
const schema = makeExecutableSchema({ typeDefs, resolvers });

// WebSocket server for subscriptions
const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql',
});

const serverCleanup = useServer(
  {
    schema,
    context: async (ctx) => {
      return {
        db: { User, Snap },
        pubsub,
      };
    },
  },
  wsServer
);

const server = new ApolloServer({
  schema,
  context: ({req}) => ({
    db: { User, Snap },
    activeUser: req.activeUser,
    pubsub,
  }),
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

async function startServer() {
  await server.start();

  app.use( async (req, res, next) => {

    const authHeader = req.headers['authorization'] || "";
    const token = authHeader.replace('Bearer ', '');

    if(token) {
      try {
        const activeUser = await jwt.verify(token, process.env.JWT_SECRET);
        req.activeUser = activeUser;
      } catch (err) {
        console.error("Invalid token:", err.message);
      }
    }

    next();
  });

  server.applyMiddleware({ app });

  httpServer.listen({ port: 4000 }, () =>
    console.log(`Server ready at http://localhost:4000${server.graphqlPath}`)
  );
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});