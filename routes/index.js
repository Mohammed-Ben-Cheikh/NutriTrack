import express from "express";
import { chatBot } from "../controllers/chatController.js";
import { home } from "../controllers/mainController.js";
import { user } from "../controllers/userController.js";
import { login, logout, register } from "../controllers/authController.js";

const router = express.Router();

//auth route
router.post("/auth/login", login)
router.post("/auth/register", register);
router.post("/auth/logout", logout);

//main route
router.get("/", home);
router.get("/user/:id", user);

router.post("/chatbot", chatBot);
export default router;
