import express from "express";
import { createOrder, deleteOrder, fetchAllOrders, fetchOrderByUser, updateOrder } from "../controllers/OrderController.js";

const router = express.Router();

router.post("/", createOrder);
router.get("/user/:userId", fetchOrderByUser);
router.delete("/:id", deleteOrder);
router.patch("/:id", updateOrder );
router.get("/:id", fetchAllOrders);
export default router;