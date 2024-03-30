import { prismaClient } from "../../lib/db";

const queries = {
  hello: () => "Hi from Graphql server",
};

const mutations = {
  createUser: async (
    _: any,
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
};

export const resolvers = { queries, mutations };
