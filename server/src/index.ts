import express from "express";
import { Request, Response } from "express";
import cors from "cors";
import { uploadRouter } from "./uploadThing";
import { createRouteHandler } from "uploadthing/express";
import { Webhook } from "svix";
import bodyParser from "body-parser";
import { WebhookEvent } from "../types";
import { prismaClient as prisma } from "./lib/db";
import customCorsOptions from "./lib/customCorsOptions";

const dotenv = require("dotenv");

dotenv.config();

const app = express();

const PORT = Number(process.env.PORT) || 8000;

app.post(
  "/api/webhooks",
  bodyParser.raw({ type: "application/json" }),
  async function (req, res) {
    // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
    if (!WEBHOOK_SECRET) {
      throw new Error("You need a WEBHOOK_SECRET in your .env");
    }

    // Get the headers and body
    const headers = req.headers;
    const payload: unknown = req.body;

    // Get the Svix headers for verification
    const svix_id = headers["svix-id"] as string;
    const svix_timestamp = headers["svix-timestamp"] as string;
    const svix_signature = headers["svix-signature"] as string;

    // If there are no Svix headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return new Response("Error occured -- no svix headers", {
        status: 400,
      });
    }

    // Create a new Svix instance with your secret.
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: WebhookEvent;

    // Attempt to verify the incoming webhook
    // If successful, the payload will be available from 'evt'
    // If the verification fails, error out and  return error code
    try {
      evt = wh.verify(payload as string | Buffer, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as WebhookEvent;
    } catch (err: any) {
      console.log("Error verifying webhook:", err.message);
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    // Do something with the payload
    // For this guide, you simply log the payload to the console
    //   const { id } = evt.data;
    const eventType = evt.type;

    if (eventType === "user.created") {
      const { first_name, last_name, id, image_url, username } = evt.data;
      const emailId = evt.data.email_addresses[0].email_address;

      const user = await prisma.user.create({
        data: {
          email: emailId,
          firstName: first_name,
          lastName: last_name,
          username: username,
          clerkId: id,
          photo: image_url,
        },
      });

      console.log(user);
    }

    return res.status(200).json({
      success: true,
      message: "Webhook received",
    });
  }
);

app.use(express.urlencoded({ extended: false }));
app.use(cors(customCorsOptions));
app.use(express.json());
app.use(
  "/api/uploadthing",
  createRouteHandler({
    router: uploadRouter,
  })
);

app.get("/api", (req, res) => {
  res.send("Server is up and running");
});

//use middleware for parsing json

app.get("/api/categories", async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    console.log(categories);
    res.send(categories);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error ");
  }
});

app.post("/api/category", async (req, res) => {
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
});
app.post("/api/event", async (req, res) => {
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
});

app.get("/api/event/:eventId", async (req, res) => {
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
    //console.log(categories);
    res.send(eventDetail);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error ");
  }
});

async function getAllEvents(req: Request, res: Response) {
  //const { query, limit = 6, page = 1, category }= req.query;
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
          name: query,
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
}

app.get("/api/events", getAllEvents);

app.delete("/api/event/:eventId", async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const result = await prisma.event.delete({
      where: {
        id: eventId,
      },
    });
    //console.log(categories);
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error ");
  }
});

app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
