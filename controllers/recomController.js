import Meal from "../models/Meal.js";
import UserProfile from "../models/UserProfile.js";

/**
 * User controller function
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 */
export function recommendation(req, res) {
  res.render("recommandation");
}

/**
 * User controller function
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 */
export async function recomService(req, res) {
  const userId = req.session.user.id;

  const meals = await Meal.getByUerId(userId);
  const userProfile = await UserProfile.getByUserId(userId);

  if (!userProfile) {
    return res
      .status(400)
      .json({ error: "User profile not found. Please complete your profile." });
  }

  if (meals.length === 0) {
    return res.status(400).json({
      error: "No meals found. Please log your meals to get recommendations.",
    });
  }
}

/**
 * User controller function
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 */
export async function saveRecom(req, res) {
  const userId = req.session.user.id;

  const meals = await Meal.getByUerId(userId);
  const userProfile = await UserProfile.getByUserId(userId);

  if (!userProfile) {
    return res
      .status(400)
      .json({ error: "User profile not found. Please complete your profile." });
  }

  if (meals.length === 0) {
    return res.status(400).json({
      error: "No meals found. Please log your meals to get recommendations.",
    });
  }
}