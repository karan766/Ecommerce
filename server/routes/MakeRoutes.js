import express from "express";
import { fetchMakes, createMake } from "../controllers/MakeController.js";

const router = express.Router();

router.get("/", fetchMakes);
router.post("/", createMake);

export default router;