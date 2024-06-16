import express from "express";
import { Request, Response } from "express";
import cors from "cors";
import Stripe from "stripe";
import { uploadRouter } from "./uploadThing";
import { createRouteHandler } from "uploadthing/express";
import { Webhook } from "svix";
import bodyParser from "body-parser";
import { WebhookEvent } from "../types";
import { prismaClient as prisma } from "./lib/db";
import customCorsOptions from "./lib/customCorsOptions";
import categoryRoutes from "./routes/categoryRoutes";
import eventRoutes from "./routes/eventRoutes";
const dotenv = require("dotenv");

dotenv.config();

const CLIENT_DOMAIN = process.env.REACT_PUBLIC_SERVER_URL;

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

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

app.post(
  "/api/webhook/stripe",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig!,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err}`);
      return;
    }

    const eventType = event.type;
    // Handle the event
    if (eventType === "checkout.session.completed") {
      const { id, amount_total, metadata } = event.data.object;

      const order = {
        stripeId: id,
        eventId: metadata?.eventId || "",
        buyerId: metadata?.buyerId || "",
        totalAmount: amount_total ? (amount_total / 100).toString() : "0",
        createdAt: new Date(),
      };

      try {
        const newOrder = await prisma.order.create({
          data: {
            stripeId: order.stripeId,
            totalAmount: order.totalAmount,
            createdAt: order.createdAt,
            buyer: {
              connect: {
                clerkId: order.buyerId,
              },
            },
            event: {
              connect: {
                id: order.eventId,
              },
            },
          },
        });
        res.send(newOrder);
      } catch (error) {
        console.error(error);
      }

      // Return a 200 response to acknowledge receipt of the event
    }
  }
);

app.use(express.json());
app.use(cors(customCorsOptions));

app.use("/api/categories", categoryRoutes);
app.post(
  "/api/checkoutOrder",

  async (req, res) => {
    const { order } = req.body;

    const { eventTitle, eventId, price, isFree, buyerId } = order;

    const productPrice = isFree ? 0 : Number(price) * 100;

    try {
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: "inr",
              unit_amount: productPrice,
              product_data: {
                name: eventTitle,
              },
            },
            quantity: 1,
          },
        ],
        metadata: {
          eventId,
          buyerId,
        },
        mode: "payment",
        success_url: `${CLIENT_DOMAIN}/profile`,
        cancel_url: `${CLIENT_DOMAIN}/`,
      });

      res.status(200).json({ id: session.id });
    } catch (error) {
      console.error("Error creating Stripe session:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

app.use(express.urlencoded({ extended: false }));

app.use(
  "/api/uploadthing",
  createRouteHandler({
    router: uploadRouter,
  })
);

app.use("/api/events", eventRoutes);

app.get("/api", (req, res) => {
  res.send("Server is up and running");
});

app.get("/api/orders/by-user", async (req: Request, res: Response) => {
  const userId = req.query.userId as string | undefined;
  const limit = Number(req.query.limit) || 3;
  const page = Number(req.query.page) || 1;

  try {
    const skipAmount = (Number(page) - 1) * Number(limit);

    const orders = await prisma.order.findMany({
      where: { buyerId: userId },
      skip: skipAmount,
      take: Number(limit),
      orderBy: { createdAt: "desc" },
      include: {
        event: {
          include: {
            organizer: {
              select: {
                firstName: true,
                lastName: true,
                clerkId: true,
              },
            },
          },
        },
      },
    });

    const orderCount = await prisma.order.count({
      where: { buyerId: userId },
    });

    res.json({
      data: orders,
      totalPages: Math.ceil(orderCount / Number(limit)),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/orders/by-event", async (req, res) => {
  const eventId = req.query.eventId as string | undefined;
  const searchString = req.query.searchString as string | "";

  if (!eventId) {
    return res.status(400).json({ error: "Event ID is required" });
  }

  try {
    const orders = await prisma.order.findMany({
      where: {
        eventId: eventId,
        buyer: {
          OR: [
            { firstName: { contains: searchString, mode: "insensitive" } },
            { lastName: { contains: searchString, mode: "insensitive" } },
          ],
        },
      },
      include: {
        buyer: true,
        event: true,
      },
    });

    const formattedOrders = orders.map((order) => ({
      id: order.id,
      totalAmount: order.totalAmount,
      createdAt: order.createdAt,
      eventTitle: order.event.title,
      eventId: order.event.id,
      buyer: `${order.buyer.firstName} ${order.buyer.lastName}`,
    }));

    res.send(formattedOrders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
