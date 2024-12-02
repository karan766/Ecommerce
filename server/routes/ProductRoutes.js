import express from "express";
import {
  createProduct,
  fetchAllProducts,
  fetchProductById,
  updateProduct,
} from "../controllers/ProductController.js";

const router = express.Router();

router.get("/", fetchAllProducts);
router.post("/", createProduct);
router.get("/:id", fetchProductById);
router.patch("/:id", updateProduct);

export default router;
