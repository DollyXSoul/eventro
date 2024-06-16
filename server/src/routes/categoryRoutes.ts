import { Router } from "express";
import {
  getCategories,
  addCategories,
} from "../controllers/categoryController";

const router = Router();

router.get("/", getCategories);
router.post("/", addCategories);

export default router;
