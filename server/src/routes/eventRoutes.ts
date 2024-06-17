import { Router } from "express";
import {
  createEvent,
  updateEvent,
  deleteEvent,
  getEventById,
  getAllEvents,
  getEventsByUser,
} from "../controllers/eventController";

const router = Router();

router.get("/by-user", getEventsByUser);
router.get("/", getAllEvents);
router.post("/", createEvent);
router.put("/", updateEvent);
router.delete("/:eventId", deleteEvent);
router.get("/:eventId", getEventById);

export default router;
