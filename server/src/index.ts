import express from "express";
const dotenv = require("dotenv");

import { expressMiddleware } from "@apollo/server/express4";
import createApolloGraphQLserver from "./graphql";

dotenv.config();

async function init() {
  const app = express();
  const PORT = Number(process.env.PORT) || 8000;

  //use middleware for parsing json

  app.use(express.json());

  app.get("/", (req, res) => {
    res.json({ message: "Server is up and running" });
  });

  app.use("/graphql", expressMiddleware(await createApolloGraphQLserver()));

  app.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`);
  });
}

init();
