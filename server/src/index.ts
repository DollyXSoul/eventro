import express from "express";
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

app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
