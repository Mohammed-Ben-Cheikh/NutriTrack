import { body, validationResult } from "express-validator";
import db from "../config/database.js";
import UserProfile from "../models/UserProfile.js";

export const profileValidateur = [
  body("sexe")
    .isIn(["H", "F"])
    .withMessage("Le sexe doit être 'H' (Homme) ou 'F' (Femme)"),

  body("date_naissance")
    .isDate()
    .withMessage("Veuillez fournir une date de naissance valide")
    .custom((value) => {
      const birthDate = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 13 || age > 120) {
        throw new Error("L'âge doit être compris entre 13 et 120 ans");
      }
      return true;
    }),

  body("taille_cm")
    .optional({ nullable: true })
    .isNumeric()
    .isFloat({ min: 100, max: 250 })
    .withMessage("La taille doit être comprise entre 100 et 250 cm"),

  body("poids_actuel_kg")
    .optional({ nullable: true })
    .isNumeric()
    .isFloat({ min: 30, max: 300 })
    .withMessage("Le poids actuel doit être compris entre 30 et 300 kg"),

  body("poids_cible_kg")
    .optional({ nullable: true })
    .isNumeric()
    .isFloat({ min: 30, max: 300 })
    .withMessage("Le poids cible doit être compris entre 30 et 300 kg"),

  body("niveau_activite")
    .optional({ nullable: true })
    .isIn(["Sédentaire", "Modéré", "Actif", "Très actif"])
    .withMessage("Niveau d'activité invalide"),

  body("sport_discipline")
    .optional({ nullable: true })
    .isIn(["Aucun", "Endurance", "Force", "Mixte"])
    .withMessage("Discipline sportive invalide"),

  body("frequence_seances")
    .optional({ nullable: true })
    .isInt({ min: 0, max: 7 })
    .withMessage("La fréquence des séances doit être entre 0 et 7 par semaine"),

  body("duree_moyenne_min")
    .optional({ nullable: true })
    .isInt({ min: 0, max: 300 })
    .withMessage("La durée moyenne doit être entre 0 et 300 minutes"),

  body("depense_energetique")
    .optional({ nullable: true })
    .isInt({ min: 0, max: 5000 })
    .withMessage("La dépense énergétique doit être entre 0 et 5000 kcal/jour"),

  body("objectif")
    .optional({ nullable: true })
    .isIn(["Perte poids", "Prise masse", "Maintien", "Sport", "Pathologie"])
    .withMessage("Objectif invalide"),

  body("calories_cible")
    .optional({ nullable: true })
    .isInt({ min: 800, max: 4000 })
    .withMessage(
      "Les calories cibles doivent être entre 800 et 4000 kcal/jour"
    ),

  body("type_pathologie")
    .optional({ nullable: true })
    .isLength({ max: 500 })
    .withMessage(
      "La description de la pathologie ne doit pas dépasser 500 caractères"
    ),

  body("glucides_pct")
    .optional({ nullable: true })
    .isInt({ min: 0, max: 100 })
    .withMessage("Le pourcentage de glucides doit être entre 0 et 100"),

  body("proteines_pct")
    .optional({ nullable: true })
    .isInt({ min: 0, max: 100 })
    .withMessage("Le pourcentage de protéines doit être entre 0 et 100"),

  body("lipides_pct")
    .optional({ nullable: true })
    .isInt({ min: 0, max: 100 })
    .withMessage("Le pourcentage de lipides doit être entre 0 et 100"),

  // Custom validation for nutritional distribution
  body().custom((value) => {
    const glucides = parseInt(value.glucides_pct) || 0;
    const proteines = parseInt(value.proteines_pct) || 0;
    const lipides = parseInt(value.lipides_pct) || 0;
    const total = glucides + proteines + lipides;

    if (total > 0 && total !== 100) {
      throw new Error(
        "La somme des pourcentages nutritionnels doit être égale à 100%"
      );
    }
    return true;
  }),
];

/**
 * User profile page controller function
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 */
export async function userProfilPage(req, res) {
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  }

  try {
    // Get existing profile data if it exists
    const existingProfile = await UserProfile.findByUserId(req.session.user.id);

    return res.render("userProfil", {
      profile: existingProfile || {},
      user: req.session.user,
    });
  } catch (error) {
    console.error("Error loading user profile page:", error);
    return res.status(500).render("userProfil", {
      error: "Erreur lors du chargement du profil",
      profile: {},
      user: req.session.user,
    });
  }
}

/**
 * Save or update user profile controller function
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 */
export async function saveUserProfile(req, res) {
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render("userProfil", {
      error: errors.array()[0].msg,
      profile: req.body,
      user: req.session.user,
    });
  }

  const {
    sexe,
    date_naissance,
    taille_cm,
    poids_actuel_kg,
    poids_cible_kg,
    niveau_activite,
    sport_discipline,
    frequence_seances,
    duree_moyenne_min,
    depense_energetique,
    objectif,
    calories_cible,
    type_pathologie,
    glucides_pct,
    proteines_pct,
    lipides_pct,
  } = req.body;

  try {
    // Check if profile already exists
    const profileExists = await UserProfile.exists(req.session.user.id);

    const userProfile = new UserProfile(
      req.session.user.id,
      sexe,
      date_naissance,
      taille_cm || null,
      poids_actuel_kg || null,
      poids_cible_kg || null,
      niveau_activite || null,
      sport_discipline || "Aucun",
      frequence_seances || null,
      duree_moyenne_min || null,
      depense_energetique || null,
      objectif || null,
      calories_cible || null,
      type_pathologie || null,
      glucides_pct || null,
      proteines_pct || null,
      lipides_pct || null
    );

    if (profileExists) {
      await userProfile.update();
      return res.render("userProfil", {
        success: "Profil mis à jour avec succès",
        profile: req.body,
        user: req.session.user,
      });
    } else {
      await userProfile.save();
      return res.render("userProfil", {
        success: "Profil créé avec succès",
        profile: req.body,
        user: req.session.user,
      });
    }
  } catch (error) {
    console.error("Error saving user profile:", error);
    return res.status(500).render("userProfil", {
      error: "Erreur lors de la sauvegarde du profil",
      profile: req.body,
      user: req.session.user,
    });
  }
}

/**
 * Get user profile data (API endpoint)
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 */
export async function getUserProfile(req, res) {
  if (!req.session.isLoggedIn) {
    return res.status(401).json({ error: "Non authentifié" });
  }

  try {
    const profile = await UserProfile.findByUserId(req.session.user.id);

    if (!profile) {
      return res.status(404).json({ error: "Profil non trouvé" });
    }

    // Calculate additional metrics
    const profileWithMetrics = {
      ...profile,
      imc:
        profile.taille_cm && profile.poids_actuel_kg
          ? (profile.poids_actuel_kg / (profile.taille_cm / 100) ** 2).toFixed(
              2
            )
          : null,
      age: profile.date_naissance
        ? new Date().getFullYear() -
          new Date(profile.date_naissance).getFullYear()
        : null,
    };

    return res.json(profileWithMetrics);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}

/**
 * Delete user profile
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 */
export async function deleteUserProfile(req, res) {
  if (!req.session.isLoggedIn) {
    return res.status(401).json({ error: "Non authentifié" });
  }

  try {
    const deleteProfile = "DELETE FROM user_profiles WHERE user_id = ?";
    db.connect().query(deleteProfile, [req.session.user.id], (err, result) => {
      if (err) {
        console.error("Error deleting user profile:", err);
        return res.status(500).json({ error: "Erreur lors de la suppression" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Profil non trouvé" });
      }

      return res.json({ message: "Profil supprimé avec succès" });
    });
  } catch (error) {
    console.error("Error deleting user profile:", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}
