import db from "../config/database.js";
class User {
  body;
  userId;
  constructor(body, userId) {
    this.body = body;
    this.userId = userId;
  }

  save() {
    return new Promise((resolve, reject) => {
      const insertUser =
        "INSERT INTO users (username, email, password) VALUES (?, ?, ?);";
      db.connect().query(
        insertUser,
        [this.username, this.email, this.password],
        (err, result) => {
          if (err) {
            console.error("Error inserting user", err);
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });
  }
}

export default User;
