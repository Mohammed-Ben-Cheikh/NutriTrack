import express from "express";
import { logout } from "../controllers/authController.js";
import { chatBot } from "../controllers/chatController.js";
import { home } from "../controllers/mainController.js";
import { user } from "../controllers/userController.js";

const router = express.Router();

//auth route
router.post("/auth/logout", logout);

//main route
router.get("/", home);
router.get("/user/:id", user);

router.post("/chatbot", chatBot);
export default router;
