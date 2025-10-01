import db from "../config/database.js";
class Recommandation {
  body;
  userId;
  constructor(userId, body) {
    this.body = body;
    this.userId = userId;
  }

  save() {
    return new Promise((resolve, reject) => {
      const insertMeal = "INSERT INTO meals (user_id, body) VALUES ( ?, ?);";
      db.connect().query(
        insertMeal,
        [this.userId, this.body],
        (err, result) => {
          if (err) {
            console.error("Error inserting meal", err);
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });
  }

  static rateLimit(userId) {
    return new Promise((resolve, reject) => {
      const checkRateLimit =
        "SELECT COUNT(*) as count FROM meals WHERE user_id = ? and DATE(created_at) = CURRENT_DATE()";
      db.connect().query(checkRateLimit, [userId], (err, result) => {
        if (err) {
          console.error("Error checking Meal Rate limit", err);
          reject(err);
        } else {
          resolve(result[0].count >= 5);
        }
      });
    });
  }
}

export default Meal;
