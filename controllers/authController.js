import bcryptjs from "bcryptjs";
import { body } from "express-validator";
import db from "../config/database.js";

export const registerValidateur = [
  body("username")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Le prénom doit contenir entre 2 et 50 caractères"),

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
export async function register(req, res) {
  const { username, email, password } = req.body;
  const findUser = "SELECT * FROM USERS WHERE email = ?";
  try {
    db.query(findUser, [email], async (err, result) => {
      if (err) {
        console.error("error in database", err);
        return res.status(500).send("Failed to register user");
      }
      if (result.length > 0) {
        return res.status(409).send("This email is already in use");
      }
      const hashedPassword = await bcryptjs.hash(password, 10);
      const insertUser =
        "INSERT INTO users (username, email, password) VALUES (?, ?, ?);";
      db.query(insertUser, [username, email, hashedPassword], (err) => {
        if (err) {
          console.error("Error inserting user", err);
          return res.status(500).send("Failed to register user");
        }
        return res.status(201).send("User registered successfully");
      });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server error");
  }
}

/**
 * User controller function
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 */
export async function login(req, res) {
  const { email, password } = req.body;
  const findUser = "SELECT * FROM USERS WHERE email = ?";
  try {
    db.query(findUser, [email], async (err, result) => {
      if (err) {
        console.error("error in database", err);
        return res.status(500).send("Failed to login");
      }
      if (result.length === 0) {
        return res.status(404).send("Invalid email or password");
      }
      const isPasswordValid = await bcryptjs.compare(
        password,
        result[0].password
      );
      if (!isPasswordValid) {
        return res.status(401).send("Invalid email or password");
      }
      req.session.user = {
        id: result[0].id,
        username: result[0].username,
        email: result[0].email
      };
      req.session.isLoggedIn = true;
      return res.status(200).send("User logged in successfully");
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server error");
  }
}

/**
 * User controller function
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 */
export function logout(req, res) {}
