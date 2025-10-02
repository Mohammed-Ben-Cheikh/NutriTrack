import Meal from "../models/Meal.js";
import UserProfile from "../models/UserProfile.js";
import { aiService } from "../service/ai.service.js";
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
  const userProfile = await UserProfile.findByUserId(userId);

  if (!userProfile) {
    return res.status(400).json({
      error: true,
      message: "User profile not found. Please complete your profile.",
    });
  }

  if (meals.length === 0) {
    return res.status(400).json({
      error: true,
      message: "No meals found. Please log your meals to get recommendations.",
    });
  }

  const mealsDiscription = meals.map((meal) => meal.body).join("\n- ");

  const prompt = `
Vous êtes un assistant en recommandations nutritionnelles.
Votre tâche est d’analyser le profil de l’utilisateur et son historique de repas afin de fournir des **recommandations personnalisées et dynamiques**.

### Profil Utilisateur
${JSON.stringify(userProfile, null, 2)}

### Historique des Repas
- ${mealsDiscription}

### Règles :
1. **Athlètes** : donner des conseils pour les repas pré/post entraînement, la récupération et l’hydratation.
2. **Patients chroniques** (ex. hypertension, diabète, cholestérol) : alerter sur les aliments dangereux (trop salés, trop sucrés, trop gras) et proposer des alternatives sûres.
3. **Perte / Prise de poids** : évaluer le bilan calorique et proposer des ajustements pour le prochain repas (réduire/augmenter les glucides, protéines ou lipides).
4. Les recommandations doivent toujours être claires, actionnables et adaptées à l’utilisateur.

À partir de ces données, fournissez **des recommandations précises et adaptées** pour cet utilisateur donner un forma markdown avec des stryle pro.
`;

  const recommendations = await aiService(prompt);
  res.json(recommendations);
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
