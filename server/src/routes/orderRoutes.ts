import { Router } from "express";
import {
  getOrdersByEvent,
  getOrdersByUser,
  checkoutOrder,
} from "../controllers/orderController";

const router = Router();

router.get("/by-user", getOrdersByUser);
router.get("/by-event", getOrdersByEvent);
router.post("/checkout", checkoutOrder);

export default router;
