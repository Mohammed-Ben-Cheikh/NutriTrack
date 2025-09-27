import bcryptjs from "bcryptjs";
import { body, validationResult } from "express-validator";
import db from "../config/database.js";
import User from "../models/User.js";

export const registerValidateur = [
  body("username")
    .trim()
    .isLength({ min: 2, max: 20 })
    .withMessage("Le prénom doit contenir entre 2 et 20 caractères"),

  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Veuillez fournir un email valide"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Le mot de passe doit contenir au moins 6 caractères"),
];

export const loginValidateur = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Veuillez fournir un email valide"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Le mot de passe doit contenir au moins 6 caractères"),
];

/**
 * User controller function
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 */
export async function registerPage(req, res) {
  if (req.session.isLoggedIn) {
    return res.redirect("/dashboard");
  }
  return res.render("register");
}

/**
 * User controller function
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 */
export async function loginPage(req, res) {
  if (req.session.isLoggedIn) {
    return res.redirect("/dashboard");
  }
  const success = req.query.success;
  return res.render("login", { success });
}

/**
 * User controller function
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 */
export async function register(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render("register", {
      error: errors.array()[0].msg,
    });
  }
  const { username, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res
      .status(400)
      .render("register", { error: "Les mots de passe ne correspondent pas" });
  }

  const findUser = "SELECT * FROM USERS WHERE email = ?";
  try {
    db.connect().query(findUser, [email], async (err, result) => {
      if (err) {
        console.error("error in database", err);
        return res
          .status(500)
          .render("register", { error: "Failed to register user" });
      }
      if (result.length > 0) {
        return res
          .status(409)
          .render("register", { error: "This email is already in use" });
      }
      const hashedPassword = await bcryptjs.hash(password, 10);
      const user = new User(email, username, hashedPassword);
      try {
        await user.save();
        return res.redirect("/login?success=User registered successfully");
      } catch (saveError) {
        console.error("Error inserting user", saveError);
        return res
          .status(500)
          .render("register", { error: "Failed to register user" });
      }
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .render("register", { error: "Une erreur inattendue s'est produite" });
  }
}

/**
 * User controller function
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 */
export async function login(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render("login", {
      error: errors.array()[0].msg,
    });
  }
  const { email, password } = req.body;
  const findUser = "SELECT * FROM USERS WHERE email = ?";
  try {
    db.connect().query(findUser, [email], async (err, result) => {
      if (err) {
        console.error("error in database", err);
        return res.status(500).render("login", { error: "Failed to login" });
      }
      if (result.length === 0) {
        return res
          .status(404)
          .render("login", { error: "Invalid email or password" });
      }
      const isPasswordValid = await bcryptjs.compare(
        password,
        result[0].password
      );
      if (!isPasswordValid) {
        return res
          .status(401)
          .render("login", { error: "Invalid email or password" });
      }
      req.session.user = {
        id: result[0].id,
        username: result[0].username,
        email: result[0].email,
      };
      req.session.isLoggedIn = true;
      return res.redirect("/dashboard/user");
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .render("login", { error: "Une erreur inattendue s'est produite" });
  }
}

/**
 * Logout controller function
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 */
export function logout(req, res) {
  try {
    if (!req.session || !req.session.isLoggedIn) {
      return res.status(400).send("Vous n'êtes pas connecté");
    }
    req.session.destroy((err) => {
      if (err) {
        console.error("Erreur lors de la destruction de la session:", err);
        return res.status(500).send("Impossible de déconnecter l'utilisateur");
      }
      res.clearCookie("connect.sid");
      return res.status(200).send("Déconnexion réussie");
    });
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error);
    return res.status(500).send("Une erreur inattendue s'est produite");
  }
}
