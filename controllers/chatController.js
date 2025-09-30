import Meal from "../models/Meal.js";

/**
 * User controller function
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 */

export function chatBot(req, res) {
  res.render("chat");
}

/**
 * Save or update user profile controller function
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 */
export async function saveMeal(req, res) {
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  }

  const aiResponse = req.body.aiResponse;
  console.log(aiResponse);

  try {
    // Check if Rate Limit 5/DAY
    const checkRateLimit = await Meal.rateLimit(req.session.user.id);

    const meal = new Meal(req.session.user.id, aiResponse);
    console.log(meal);
    
    if (checkRateLimit) {
      return res.json({
        error: true,
        message: "Vous pouvez sauvgarder jusqu'à 5 repas par jour",
      });
    } else {
      await meal.save();
      return res.json({
        success: true,
        message: "repas enregistré avec success",
      });
    }
  } catch (error) {
    console.error("Error saving meal", error);
    return res.status(500).json({
      error: true,
      message: "Erreur lors de la sauvegarde du repas",
    });
  }
}
