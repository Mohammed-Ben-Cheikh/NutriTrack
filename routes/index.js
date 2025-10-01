import express from "express";
import { logout } from "../controllers/authController.js";
import { chatBot, saveMeal } from "../controllers/chatController.js";
import { dashboard } from "../controllers/dashboardController.js";
import {
  profileValidateur,
  saveUserProfile,
  userProfilPage,
} from "../controllers/userProfilController.js";
import { recommendation } from "../controllers/recomController.js";

const router = express.Router();

//auth route
router.post("/auth/logout", logout);

router.get("/dashboard", dashboard);

router.get("/dashboard/user", userProfilPage);

router.get("/dashboard/recommendations", recommendation);
router.get("/dashboard/repas", chatBot);
router.post("/save/repas", saveMeal);

router.post("/user/profil", [profileValidateur], saveUserProfile);

router.post("/auth/logout", logout);
export default router;
