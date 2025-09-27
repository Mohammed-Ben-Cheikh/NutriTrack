import db from "../config/database.js";

class UserProfile {
  user_id;
  sexe;
  date_naissance;
  taille_cm;
  poids_actuel_kg;
  poids_cible_kg;
  niveau_activite;
  sport_discipline;
  frequence_seances;
  duree_moyenne_min;
  depense_energetique;
  objectif;
  calories_cible;
  type_pathologie;
  glucides_pct;
  proteines_pct;
  lipides_pct;

  constructor(
    user_id,
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
    lipides_pct
  ) {
    this.user_id = user_id;
    this.sexe = sexe;
    this.date_naissance = date_naissance;
    this.taille_cm = taille_cm;
    this.poids_actuel_kg = poids_actuel_kg;
    this.poids_cible_kg = poids_cible_kg;
    this.niveau_activite = niveau_activite;
    this.sport_discipline = sport_discipline;
    this.frequence_seances = frequence_seances;
    this.duree_moyenne_min = duree_moyenne_min;
    this.depense_energetique = depense_energetique;
    this.objectif = objectif;
    this.calories_cible = calories_cible;
    this.type_pathologie = type_pathologie;
    this.glucides_pct = glucides_pct;
    this.proteines_pct = proteines_pct;
    this.lipides_pct = lipides_pct;
  }

  save() {
    return new Promise((resolve, reject) => {
      const insertProfile = `
        INSERT INTO user_profiles (
          user_id, sexe, date_naissance, taille_cm, poids_actuel_kg, 
          poids_cible_kg, niveau_activite, sport_discipline, frequence_seances, 
          duree_moyenne_min, depense_energetique, objectif, calories_cible, 
          type_pathologie, glucides_pct, proteines_pct, lipides_pct
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      db.connect().query(
        insertProfile,
        [
          this.user_id,
          this.sexe,
          this.date_naissance,
          this.taille_cm,
          this.poids_actuel_kg,
          this.poids_cible_kg,
          this.niveau_activite,
          this.sport_discipline,
          this.frequence_seances,
          this.duree_moyenne_min,
          this.depense_energetique,
          this.objectif,
          this.calories_cible,
          this.type_pathologie,
          this.glucides_pct,
          this.proteines_pct,
          this.lipides_pct,
        ],
        (err, result) => {
          if (err) {
            console.error("Error inserting user profile", err);
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });
  }

  update() {
    return new Promise((resolve, reject) => {
      const updateProfile = `
        UPDATE user_profiles SET 
          sexe = ?, date_naissance = ?, taille_cm = ?, poids_actuel_kg = ?, 
          poids_cible_kg = ?, niveau_activite = ?, sport_discipline = ?, 
          frequence_seances = ?, duree_moyenne_min = ?, depense_energetique = ?, 
          objectif = ?, calories_cible = ?, type_pathologie = ?, 
          glucides_pct = ?, proteines_pct = ?, lipides_pct = ?, 
          updated_at = NOW()
        WHERE user_id = ?
      `;

      db.connect().query(
        updateProfile,
        [
          this.sexe,
          this.date_naissance,
          this.taille_cm,
          this.poids_actuel_kg,
          this.poids_cible_kg,
          this.niveau_activite,
          this.sport_discipline,
          this.frequence_seances,
          this.duree_moyenne_min,
          this.depense_energetique,
          this.objectif,
          this.calories_cible,
          this.type_pathologie,
          this.glucides_pct,
          this.proteines_pct,
          this.lipides_pct,
          this.user_id,
        ],
        (err, result) => {
          if (err) {
            console.error("Error updating user profile", err);
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });
  }

  static findByUserId(userId) {
    return new Promise((resolve, reject) => {
      const findProfile = "SELECT * FROM user_profiles WHERE user_id = ?";
      db.connect().query(findProfile, [userId], (err, result) => {
        if (err) {
          console.error("Error finding user profile", err);
          reject(err);
        } else {
          resolve(result[0] || null);
        }
      });
    });
  }

  static exists(userId) {
    return new Promise((resolve, reject) => {
      const checkProfile =
        "SELECT COUNT(*) as count FROM user_profiles WHERE user_id = ?";
      db.connect().query(checkProfile, [userId], (err, result) => {
        if (err) {
          console.error("Error checking user profile existence", err);
          reject(err);
        } else {
          resolve(result[0].count > 0);
        }
      });
    });
  }

  // Calculate BMI
  calculateIMC() {
    if (this.taille_cm && this.poids_actuel_kg) {
      const tailleM = this.taille_cm / 100;
      return (this.poids_actuel_kg / (tailleM * tailleM)).toFixed(2);
    }
    return null;
  }

  // Validate nutritional percentages sum to 100
  validateNutritionalDistribution() {
    const total =
      (this.glucides_pct || 0) +
      (this.proteines_pct || 0) +
      (this.lipides_pct || 0);
    return total === 100;
  }
}

export default UserProfile;
