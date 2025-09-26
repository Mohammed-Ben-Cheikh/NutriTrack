import express from "express";
import {
  login,
  loginPage,
  register,
  registerPage,
} from "../controllers/authController.js";
import { home } from "../controllers/mainController.js";

const mainRouter = express.Router();

//main route
mainRouter.get("/", home);

mainRouter.get("/login", loginPage);
mainRouter.get("/register", registerPage);

mainRouter.post("/auth/login", login);
mainRouter.post("/auth/register", register);


export default mainRouter;
