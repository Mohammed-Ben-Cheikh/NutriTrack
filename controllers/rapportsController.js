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

  const prompt = `
Vous êtes un assistant spécialisé en nutrition.
Votre tâche est de générer un **rapport nutritionnel quotidien personnalisé** au format structuré (Markdown → HTML).

### Profil Utilisateur
${JSON.stringify(userProfile, null, 2)}

### Historique des Repas
${mealsDescription}

### Instructions pour le Rapport :
1. Fournir un **bilan calorique global** (calories consommées, objectif estimé, différence).
2. Détailler les **macronutriments** (glucides, protéines, lipides) avec comparaison aux besoins estimés.
3. Lister les **repas de la journée** (nom, heure, calories, remarque santé si nécessaire).
4. Ajouter la partie **hydratation** (consommé vs cible recommandée).
5. Donner des **recommandations personnalisées** adaptées au profil (athlète, diabétique, perte de poids, etc.).
6. Retourner le tout en **HTML structuré simple** (titres, sous-titres, listes, tableaux si besoin).

⚠️ Le rendu doit être directement affichable dans la section \`#previewContent\` de \`dashboard-body.ejs\`.

Exemple de structure attendue :
<h2>Rapport Nutritionnel Quotidien</h2>
<p>Date: …</p>

<h3>Bilan Calorique</h3>
<ul>
  <li>Consommées: …</li>
  <li>Objectif: …</li>
  <li>Différence: …</li>
</ul>

<h3>Macronutriments</h3>
<table>...</table>

<h3>Repas</h3>
<ul>...</ul>

<h3>Hydratation</h3>
...

<h3>Recommandations</h3>
<p>...</p>
`;

  const rapport = await aiService(prompt);
  res.json({ rapport });
}
