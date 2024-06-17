import { Router } from "express";
import { stripeWebhook, clerkWebhook } from "../controllers/webhookController";
import bodyParser from "body-parser";

const router = Router();

router.post(
  "/clerk",
  bodyParser.raw({ type: "application/json" }),
  clerkWebhook
);
router.post(
  "/stripe",
  bodyParser.raw({ type: "application/json" }),
  stripeWebhook
);

export default router;
