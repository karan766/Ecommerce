import express from "express";
import { createOrder, deleteOrder, fetchAllOrders, fetchOrderByUser, updateOrder } from "../controllers/Order.Controller.js";

const router = express.Router();

router.post("/", createOrder);
router.get("/user/:userId", fetchOrderByUser);
router.delete("/:id", deleteOrder);
router.patch("/:id", updateOrder );
router.get("/", fetchAllOrders);
export default router;