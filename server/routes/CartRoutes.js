import express from "express";
import { addToCart, fetchCartByUser, deleteFromCart, updateCart } from "../controllers/CartController.js";
const router = express.Router();

router.post("/", addToCart);
router.get("/", fetchCartByUser);
router.delete("/:id", deleteFromCart);
router.patch("/:id", updateCart );
export default router;