require("dotenv").config();

const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const path = require("path");
const { loadFilesSync } = require("@graphql-tools/load-files");
const { mergeTypeDefs } = require("@graphql-tools/merge");
const resolvers = require("./graphql/resolvers");
const User = require("./database/models/User");
const Snap = require("./database/models/Snap");
const jwt = require("jsonwebtoken");

const typesArray = loadFilesSync(path.join(__dirname, "graphql", "**/*.graphql"));
const typeDefs = mergeTypeDefs(typesArray); 

const db = require("./database/database");
const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({req}) => ({
    db: { User, Snap },
    activeUser: req.activeUser
  }),
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

  app.listen({ port: 4000 }, () =>
    console.log(`Server ready at http://localhost:4000${server.graphqlPath}`)
  );
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});