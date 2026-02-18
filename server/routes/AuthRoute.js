// import express from "express";
// import passport from "passport";

// import { checkAuth, CreateUser, loginUser, resetPasswordRequest , resetPassword , logout} from "../controllers/AuthController.js";


// const router = express.Router();
// router.post("/login",passport.authenticate("local"), loginUser);
// router.post("/signup",CreateUser );
// router.get("/check",passport.authenticate("jwt"),checkAuth);
// router.post('/reset-password-request', resetPasswordRequest)
// router.post('/reset-password', resetPassword)
// router.get("/logout",logout)
// export default router;
import express from "express";
import passport from "passport";
import {
  checkAuth,
  CreateUser,
  loginUser,
  resetPasswordRequest,
  resetPassword,
  logout
} from "../controllers/AuthController.js";

const router = express.Router();

router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  loginUser
);

router.post("/signup", CreateUser);

router.get(
  "/check",
  passport.authenticate("jwt", { session: false }),
  checkAuth
);

router.post("/reset-password-request", resetPasswordRequest);
router.post("/reset-password", resetPassword);
router.get("/logout", logout);

export default router;
