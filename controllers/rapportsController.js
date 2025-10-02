import Meal from "../models/Meal.js";
import UserProfile from "../models/UserProfile.js";
import { aiService } from "../service/ai.service.js";

/**
 * User controller function
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 */

export function rapports(req, res) {
  res.render("rapports");
}

/**
 * User controller function
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 */

export async function generateRapports(req, res) {
  const userId = req.session.user.id;
  const meals = await new Meal.getByUerId(userId);
  const userProfile = await new UserProfile.findByUserId(userId);
}
