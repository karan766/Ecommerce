import express from "express";
import { createCategory, fetchCategories } from "../controllers/CategoryController.js";

const router = express.Router();

router.get("/", fetchCategories);
router.post("/", createCategory);
               
export default router;