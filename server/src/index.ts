import express from "express";
const dotenv = require("dotenv");
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { prismaClient } from "./lib/db";
dotenv.config();

async function init() {
  const app = express();
  const PORT = Number(process.env.PORT) || 8000;

  //use middleware for parsing json

  app.use(express.json());

  const gqlserver = new ApolloServer({
    typeDefs: `
    type Query {
      hello : String
    }
    
    type Mutation {
      createUser(clerkId: String , email:  String ,username: String , firstName: String ,lastName: String ) : Boolean
    }
    
    
    `,
    resolvers: {
      Query: {
        hello: () => "Hi from Graphql server",
      },
      Mutation: {
        createUser: async (
          _,
          {
            clerkId,
            email,
            username,
            firstName,
            lastName,
          }: {
            clerkId: string;
            email: string;
            username: string;
            firstName: string;
            lastName: string;
          }
        ) => {
          await prismaClient.user.create({
            data: {
              clerkId,
              email,
              username,
              firstName,
              lastName,
            },
          });
          return true;
        },
      },
    },
  });

  await gqlserver.start();

  app.get("/", (req, res) => {
    res.json({ message: "Server is up and running" });
  });

  app.use("/graphql", expressMiddleware(gqlserver));

  app.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`);
  });
}

init();
