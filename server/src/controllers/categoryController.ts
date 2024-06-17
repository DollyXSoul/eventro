import { Request, Response } from "express";
import { prismaClient as prisma } from "../lib/db";

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany();
    res.send(categories);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
};

export const addCategories = async (req: Request, res: Response) => {
  try {
    const newCategory = await prisma.category.create({
      data: {
        name: req.body.name as string,
      },
    });

    res.send(newCategory);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error ");
  }
};
