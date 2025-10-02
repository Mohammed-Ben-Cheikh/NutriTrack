import express from "express";
import { logout } from "../controllers/authController.js";
import { chatBot, saveMeal } from "../controllers/chatController.js";
import { rapports } from "../controllers/rapportsController.js";
import {
  recommendation,
  recomService,
  saveRecom,
} from "../controllers/recomController.js";
import {
  profileValidateur,
  saveUserProfile,
  userProfilPage,
} from "../controllers/userProfilController.js";

const router = express.Router();

//auth route
router.post("/auth/logout", logout);

router.get("/dashboard", rapports);

router.get("/dashboard/user", userProfilPage);

router.get("/dashboard/recommendations", recommendation);
router.post("/recommendation-service", recomService);
router.post("/save/recommandation", saveRecom);

router.get("/dashboard/repas", chatBot);
router.post("/save/repas", saveMeal);

router.post("/user/profil", [profileValidateur], saveUserProfile);

router.post("/auth/logout", logout);
export default router;
