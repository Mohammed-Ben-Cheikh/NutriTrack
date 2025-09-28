--NutriTrack

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  sexe ENUM('H', 'F') NOT NULL,
  date_naissance DATE NOT NULL,
  taille_cm DECIMAL(5,2) NULL,
  poids_actuel_kg DECIMAL(5,2) NULL,
  poids_cible_kg DECIMAL(5,2) NULL,
  niveau_activite ENUM('Sédentaire', 'Modéré', 'Actif', 'Très actif') NULL,
  sport_discipline ENUM('Aucun', 'Endurance', 'Force', 'Mixte') DEFAULT 'Aucun',
  frequence_seances TINYINT UNSIGNED NULL,
  duree_moyenne_min SMALLINT UNSIGNED NULL,
  depense_energetique SMALLINT UNSIGNED NULL,
  objectif ENUM('Perte poids', 'Prise masse', 'Maintien', 'Sport', 'Pathologie') NULL,
  calories_cible SMALLINT UNSIGNED NULL,
  type_pathologie TEXT NULL,
  glucides_pct TINYINT UNSIGNED NULL,
  proteines_pct TINYINT UNSIGNED NULL,
  lipides_pct TINYINT UNSIGNED NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_profile (user_id)
);