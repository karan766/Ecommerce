import express from "express";

import { fetchUserById , updateUser } from "../controllers/UserController.js";


const router = express.Router();

router.get("/:id", fetchUserById);
router.patch("/:id", updateUser);

export default router;
