import express from "express";
import { logout } from "../controllers/authController.js";
import { chatBot } from "../controllers/chatController.js";
import { home } from "../controllers/mainController.js";
import {
  profileValidateur,
  saveUserProfile,
  userProfilPage,
} from "../controllers/userProfilController.js";

const router = express.Router();

//auth route
router.post("/auth/logout", logout);

//main route
router.get("/", home);
router.get("/dashboard/user", userProfilPage);
router.post("/user/profil", [profileValidateur], saveUserProfile);

router.post("/chatbot", chatBot);
export default router;
