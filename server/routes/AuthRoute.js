import express from "express";
import passport from "passport";

import { checkUser, CreateUser, loginUser } from "../controllers/AuthController.js";

const router = express.Router();
router.post("/login",passport.authenticate("local"), loginUser);
router.post("/login",loginUser );
router.get("/check",passport.authenticate("jwt"),checkUser);


export default router;
