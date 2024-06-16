import { Request, Response } from "express";
import { prismaClient as prisma } from "../lib/db";

export const createEvent = async (req: Request, res: Response) => {
  const { userId, event } = req.body;

  const {
    title,
    description,
    location,
    imageUrl,
    startDateTime,
    endDateTime,
    isFree,
    price,
    url,
    categoryId,
  } = event;
  try {
    const organizer = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (!organizer) {
      res.status(401).send("User does not exist");
    }

    const newEvent = await prisma.event.create({
      data: {
        title,
        description,
        location,
        imageUrl,
        startDateTime,
        endDateTime,
        isFree,
        price,
        url,
        organizer: {
          connect: {
            clerkId: userId,
          },
        },
        category: {
          connect: {
            id: categoryId,
          },
        },
      },
    });

    res.send(newEvent);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error ");
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  const { userId, event } = req.body;

  const {
    title,
    description,
    location,
    imageUrl,
    startDateTime,
    endDateTime,
    isFree,
    price,
    url,
    categoryId,
    id,
  } = event;

  try {
    const eventFound = await prisma.event.findUnique({
      where: {
        id,
      },
    });

    if (!eventFound) {
      res.status(404).send("Event does not exist");
    }

    if (eventFound?.organizerId.toString() !== userId) {
      res.status(401).send("User not authorized to modify this event");
    }

    const updated = await prisma.event.update({
      where: {
        id,
      },
      data: {
        title,
        description,
        location,
        imageUrl,
        startDateTime,
        endDateTime,
        isFree,
        price,
        url,
        category: {
          connect: {
            id: categoryId,
          },
        },
      },
    });

    res.send(updated);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error ");
  }
};

export const getEventById = async (req: Request, res: Response) => {
  try {
    const eventId = req.params.eventId;
    const eventDetail = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
      include: {
        organizer: {
          select: {
            firstName: true,
            lastName: true,
            clerkId: true,
          },
        },
        category: true,
      },
    });

    res.send(eventDetail);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error ");
  }
};

export const getEventsByUser = async (req: Request, res: Response) => {
  const userId = req.query.query as string | undefined;
  const limit = Number(req.query.limit) || 6;
  const page = Number(req.query.page) || 1;

  console.log(userId, " ", limit, " ", page);

  try {
    const skipAmount = (Number(page) - 1) * Number(limit);

    const events = await prisma.event.findMany({
      where: {
        organizerId: {
          equals: userId,
        },
      },
      skip: skipAmount,
      take: Number(limit),
      orderBy: { createdAt: "desc" },
      include: {
        organizer: {
          select: {
            firstName: true,
            lastName: true,
            clerkId: true,
          },
        },
        category: true,
      },
    });

    const eventsCount = await prisma.event.count({
      where: { organizerId: userId },
    });

    res.json({
      data: events,
      totalPages: Math.ceil(eventsCount / Number(limit)),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllEvents = async (req: Request, res: Response) => {
  const query = req.query.query as string | undefined;
  const limit = Number(req.query.limit) || 6;
  const page = Number(req.query.page) || 1;
  const category = req.query.category as string | undefined;

  try {
    const titleCondition = query
      ? { title: { contains: query, mode: "insensitive" as const } }
      : {};
    let categoryCondition: { categoryId?: string } = {};

    if (category) {
      const foundCategory = await prisma.category.findUnique({
        where: {
          name: category,
        },
      });
      if (foundCategory) {
        categoryCondition = { categoryId: foundCategory.id };
      } else {
        return res.status(404).json({ error: "Category not found" });
      }
    }

    const conditions = {
      AND: [titleCondition, categoryCondition],
    };

    const skipAmount = (Number(page) - 1) * Number(limit);

    const events = await prisma.event.findMany({
      where: conditions,
      orderBy: { createdAt: "desc" },
      skip: skipAmount,
      take: Number(limit),
      include: {
        organizer: {
          select: {
            firstName: true,
            lastName: true,
            clerkId: true,
          },
        },
        category: true,
      }, // Include related category data if needed
    });

    const eventsCount = await prisma.event.count({
      where: conditions,
    });

    res.json({
      data: events,
      totalPages: Math.ceil(eventsCount / limit),
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const eventId = req.params.eventId;
    const result = await prisma.event.delete({
      where: {
        id: eventId,
      },
    });
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error ");
  }
};
