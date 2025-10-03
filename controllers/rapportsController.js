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

export async function rapportService(req, res) {
  const userId = req.session.user.id;
  const { reportType } = req.body; // Get report type from request body

  const meals = await Meal.getByUerId(userId);
  const userProfile = await UserProfile.findByUserId(userId);

  if (!userProfile) {
    return res.status(400).json({
      error: true,
      message: "Profil utilisateur introuvable. Merci de le compléter.",
    });
  }

  if (meals.length === 0) {
    return res.status(400).json({
      error: true,
      message: "Aucun repas trouvé. Merci d’ajouter vos repas.",
    });
  }

  const mealsDescription = meals
    .map((meal) => `- ${meal.body} (${meal.created_at})`)
    .join("\n");

  // Determine report focus based on type
  let reportFocus = "";
  switch (reportType) {
    case "1":
      reportFocus =
        "Fournir un rapport nutritionnel complet avec toutes les sections détaillées.";
      break;
    case "2":
      reportFocus =
        "Mettre l'accent principal sur l'analyse détaillée des macronutriments (glucides, protéines, lipides).";
      break;
    case "3":
      reportFocus =
        "Se concentrer principalement sur le bilan calorique avec analyse approfondie des calories.";
      break;
    case "4":
      reportFocus =
        "Prioriser l'analyse de l'hydratation et des besoins en eau.";
      break;
    case "5":
      reportFocus =
        "Créer un rapport personnalisé adapté spécifiquement au profil et aux objectifs de l'utilisateur.";
      break;
    default:
      reportFocus = "Fournir un rapport nutritionnel complet.";
  }

  const prompt = `
Vous êtes un assistant spécialisé en nutrition.
Votre tâche est de générer un **rapport nutritionnel quotidien personnalisé** au format structuré (Markdown → HTML).

### Profil Utilisateur
${JSON.stringify(userProfile, null, 2)}

### Historique des Repas
${mealsDescription}

### Focus du Rapport
${reportFocus}

### Instructions pour le Rapport :
1. Fournir un **bilan calorique global** (calories consommées, objectif estimé, différence).
2. Détailler les **macronutriments** (glucides, protéines, lipides) avec comparaison aux besoins estimés.
3. Lister les **repas de la journée** (nom, heure, calories, remarque santé si nécessaire).
4. Ajouter la partie **hydratation** (consommé vs cible recommandée).
5. Donner des **recommandations personnalisées** adaptées au profil (athlète, diabétique, perte de poids, etc.).
6. Retourner le tout en **HTML structuré simple** avec sections bien organisées.

⚠️ IMPORTANT: Utilisez une structure HTML claire avec des sections distinctes pour chaque partie.

Exemple de structure attendue :
<div>
  <h2>Rapport Nutritionnel Quotidien</h2>
  <p>Date: ${new Date().toLocaleDateString("fr-FR")}</p>
</div>

<div>
  <h3>🔥 Bilan Calorique</h3>
  <ul>
    <li><strong>Consommées:</strong> [nombre] kcal</li>
    <li><strong>Objectif:</strong> [nombre] kcal</li>
    <li><strong>Différence:</strong> [nombre] kcal</li>
  </ul>
</div>

<div>
  <h3>📊 Macronutriments</h3>
  <table>
    <thead>
      <tr><th>Nutriment</th><th>Consommé</th><th>Objectif</th><th>Status</th></tr>
    </thead>
    <tbody>
      <tr><td>Protéines</td><td>[nombre]g</td><td>[nombre]g</td><td>[status]</td></tr>
      <tr><td>Glucides</td><td>[nombre]g</td><td>[nombre]g</td><td>[status]</td></tr>
      <tr><td>Lipides</td><td>[nombre]g</td><td>[nombre]g</td><td>[status]</td></tr>
    </tbody>
  </table>
</div>

<div>
  <h3>🍽️ Repas de la journée</h3>
  <ul>
    <li><strong>[Nom du repas]</strong> - [heure] : [calories] kcal</li>
  </ul>
</div>

<div>
  <h3>💧 Hydratation</h3>
  <p><strong>Consommation d'eau:</strong> [nombre] L / [objectif] L</p>
</div>

<div>
  <h3>💡 Recommandations personnalisées</h3>
  <p>[recommandations adaptées au profil utilisateur]</p>
</div>
`;

  const rapport = await aiService(prompt);
  res.json({ rapport });
}
