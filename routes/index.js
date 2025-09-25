import express from "express";
import { chatBot } from "../controllers/chatController.js";
import { home } from "../controllers/mainController.js";
import { user } from "../controllers/userController.js";
import { login } from "../controllers/authController.js";

const router = express.Router();
//auth route
router.get("/auth/login",login)
router.get("/", home);
router.get("/user/:id", user);

router.post("/chatbot", chatBot);
export default router;
