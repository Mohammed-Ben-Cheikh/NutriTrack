import db from "../config/database.js";
class Ai {
  body;
  userId;
  constructor(body, userId) {
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
}

export default Ai;
