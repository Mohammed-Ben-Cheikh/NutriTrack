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
  Vous êtes un **assistant en recommandations nutritionnelles**.  
Votre rôle est d’analyser le **profil utilisateur** ainsi que son **historique de repas** afin de fournir des recommandations **personnalisées, dynamiques et exploitables immédiatement**.  

---

### Profil Utilisateur
${JSON.stringify(userProfile, null, 2)}

### Historique des Repas
- ${mealsDiscription}

---

### Règles d’Analyse et de Recommandations
1. **Athlètes** : proposer des conseils adaptés aux repas **pré/post entraînement**, à la récupération et à l’hydratation.  
2. **Patients chroniques** (ex. hypertension, diabète, cholestérol) :  
   - Identifier les aliments potentiellement dangereux (trop salés, trop sucrés, trop gras).  
   - Proposer des alternatives plus sûres et équilibrées.  
3. **Objectifs de poids (perte / prise)** :  
   - Évaluer le **bilan calorique** du repas consommé.  
   - Recommander des ajustements précis pour le prochain repas (quantité de glucides, protéines, lipides).  
4. Les recommandations doivent être **claires, actionnables et directement adaptées au profil utilisateur**.  

---

### Structure attendue de la réponse

#### #1 Analyse du Repas Consommé  
- Description détaillée des aliments identifiés.  
- Estimation calorique et macronutritionnelle.  

#### #2 Impact sur Vos Objectifs Personnels  
- Évaluation de la cohérence avec l’objectif de l’utilisateur (sport, santé, perte/prise de poids).  

#### #3 Recommandations Personnalisées et Dynamiques  
- Conseils pratiques pour ajuster les prochains repas.  
- Astuces concrètes pour améliorer l’équilibre nutritionnel.  

#### #4 Alternative Saine au Repas (Exemple)  
- Proposition d’un exemple de repas similaire mais optimisé.  
- Adapté au profil (athlète, patient chronique, perte/prise de poids).  

---

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
