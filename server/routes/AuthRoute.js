import express from "express";
import passport from "passport";

import { checkAuth, CreateUser, loginUser, resetPasswordRequest , resetPassword , logout} from "../controllers/AuthController.js";


const router = express.Router();
router.post("/login",passport.authenticate("local"), loginUser);
router.post("/signup",CreateUser );
router.get("/check",passport.authenticate("jwt"),checkAuth);
router.post('/reset-password-request', resetPasswordRequest)
router.post('/reset-password', resetPassword)
router.get("/logout",logout)
export default router;
