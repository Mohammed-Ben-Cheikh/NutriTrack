import express from "express";
import { logout } from "../controllers/authController.js";
import { chatBot } from "../controllers/chatController.js";
import { dashboard } from "../controllers/dashboardController.js";
import {
  profileValidateur,
  saveUserProfile,
  userProfilPage,
} from "../controllers/userProfilController.js";

const router = express.Router();

//auth route
router.post("/auth/logout",logout)

router.get("/dashboard", dashboard);

router.get("/dashboard/user", userProfilPage);
router.post("/user/profil", [profileValidateur], saveUserProfile);

router.post("/chatbot", chatBot);

router.post("/auth/logout", logout);
export default router;
