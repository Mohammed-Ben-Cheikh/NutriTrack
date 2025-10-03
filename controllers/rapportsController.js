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
  const userName = req.session.user.username;
  const { reportType } = req.body;

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

  let reportFocus = "";
  let reportTitle = "";

  switch (reportType) {
    case "medical":
      reportTitle = "Rapport Médical Hebdomadaire - Suivi Patient";
      reportFocus = `
        FOCUS MÉDICAL - SUIVI PATIENT:
        - Analyser les excès de sel et sucre avec graphiques de tendance
        - Calculer et présenter les écarts glycémiques estimés
        - Évaluer les risques nutritionnels selon le profil médical
        - Fournir des recommandations médicales préventives
        - Inclure des alertes sur les dépassements critiques
        - Proposer des ajustements alimentaires thérapeutiques
      `;
      break;
    case "athlete":
      reportTitle = "Rapport Sportif Hebdomadaire - Performance Athlète";
      reportFocus = `
        FOCUS SPORTIF - PERFORMANCE ATHLÈTE:
        - Analyser les courbes de progression nutritionnelle
        - Corréler l'alimentation avec les performances estimées
        - Évaluer l'apport énergétique vs dépense sportive
        - Optimiser la récupération nutritionnelle
        - Planifier la nutrition pré/post entraînement
        - Suivre l'hydratation et électrolytes
      `;
      break;
    case "weight":
      reportTitle = "Rapport Gestion du Poids Hebdomadaire";
      reportFocus = `
        FOCUS GESTION DU POIDS:
        - Suivre l'évolution du poids avec tendances
        - Calculer et présenter l'IMC et son évolution
        - Estimer la masse musculaire vs masse grasse
        - Analyser la balance calorique hebdomadaire
        - Identifier les patterns alimentaires problématiques
        - Proposer des ajustements pour atteindre les objectifs
      `;
      break;
    default:
      reportTitle = "Rapport Nutritionnel Hebdomadaire";
      reportFocus = "Fournir un rapport nutritionnel hebdomadaire complet.";
  }

  const prompt = `
Vous êtes un assistant expert en nutrition et santé.
Générez un **${reportTitle}** au format HTML structuré.

Commencez le rapport par une salutation personnalisée : "Cher ${userName},"

Profil utilisateur :
${JSON.stringify(userProfile, null, 2)}

Historique des repas (7 derniers jours) :
${mealsDescription}

Spécialisation du rapport :
${reportFocus}

Instructions :
- Ajoutez un titre et la période analysée
- Faites une analyse selon le type de rapport
- Résumez les apports nutritionnels hebdomadaires
- Ajoutez des graphiques ASCII simples pour illustrer les tendances
- Donnez des recommandations adaptées au profil
- Proposez un plan d'action pour la semaine suivante

Structure attendue :
<div>
  <h2>${reportTitle}</h2>
  <p> Cher ${userName}, </p>
  <p>Période : ${new Date(
    Date.now() - 7 * 24 * 60 * 60 * 1000
  ).toLocaleDateString("fr-FR")} - ${new Date().toLocaleDateString("fr-FR")}</p>
</div>
<div>
  <h3>Analyse</h3>
  [Analyse spécialisée]
</div>
<div>
  <h3>Tendances</h3>
  [Graphiques ASCII]
</div>
<div>
  <h3>Recommandations</h3>
  [Conseils personnalisés]
</div>
`;

  const rapport = await aiService(prompt);

  let cleanedRapport = rapport;
  if (typeof rapport === "string") {
    cleanedRapport = rapport
      .replace(/^```html\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();
  }

  res.json({ rapport: cleanedRapport });
}
