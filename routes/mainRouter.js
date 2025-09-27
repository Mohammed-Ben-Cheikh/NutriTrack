import express from "express";
import {
  login,
  loginPage,
  loginValidateur,
  register,
  registerPage,
  registerValidateur,
} from "../controllers/authController.js";
import { home } from "../controllers/mainController.js";

const mainRouter = express.Router();

//main route
mainRouter.get("/", home);

mainRouter.get("/login", loginPage);
mainRouter.get("/register", registerPage);

mainRouter.post("/auth/login", [loginValidateur], login);
mainRouter.post("/auth/register", [registerValidateur], register);

export default mainRouter;
