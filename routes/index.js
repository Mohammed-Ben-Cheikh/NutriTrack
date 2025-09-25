import express from "express";
import { home } from "../controllers/mainController.js";
import { user } from "../controllers/userController.js";
import { chatBot } from "../controllers/chatController.js";


const router = express.Router();

router.get("/", home);
router.get("/user/:id", user);
router.post("/chatbot", chatBot);
export default router;
