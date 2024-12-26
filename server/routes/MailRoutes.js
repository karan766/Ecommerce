import express from "express";
import { sendEMail } from "../controllers/MailController.js";

const router = express.Router();

router.post("/", sendEMail);

export default router;