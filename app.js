require("dotenv").config();

const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const path = require("path");
const { loadFilesSync } = require("@graphql-tools/load-files");
const { mergeTypeDefs } = require("@graphql-tools/merge");
const resolvers = require("./graphql/resolvers");
const User = require("./database/models/User");

const typesArray = loadFilesSync(path.join(__dirname, "graphql", "**/*.graphql"));
const typeDefs = mergeTypeDefs(typesArray); 

const db = require("./database/database");
const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => ({
    db: { User },
  }),
});

async function startServer() {
  await server.start();
  server.applyMiddleware({ app });

  app.listen({ port: 4000 }, () =>
    console.log(`Server ready at http://localhost:4000${server.graphqlPath}`)
  );
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});