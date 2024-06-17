import express from "express";
import cors from "cors";
import { uploadRouter } from "./uploadThing";
import { createRouteHandler } from "uploadthing/express";
import customCorsOptions from "./lib/customCorsOptions";
import categoryRoutes from "./routes/categoryRoutes";
import eventRoutes from "./routes/eventRoutes";
import orderRoutes from "./routes/orderRoutes";
import webhookRoutes from "./routes/webhookRoutes";
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 8000;

app.use("/api/webhook", webhookRoutes);

app.use(express.json());
app.use(cors(customCorsOptions));
app.use("/api/categories", categoryRoutes);
app.use(express.urlencoded({ extended: false }));
app.use(
  "/api/uploadthing",
  createRouteHandler({
    router: uploadRouter,
  })
);
app.use("/api/events", eventRoutes);
app.use("/api/orders", orderRoutes);
app.get("/api", (req, res) => {
  res.send("Server is up and running");
});

app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
