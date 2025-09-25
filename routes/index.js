import express from "express";
import { home } from "../controllers/mainController.js";
import { user } from "../controllers/userController.js";

const router = express.Router();

router.get("/", home);
router.get("/user/:id", user);

export default router;
