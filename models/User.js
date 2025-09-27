import db from "../config/database.js";
class User {
  email;
  username;
  password;

  constructor(email, username, password) {
    this.email = email;
    this.username = username;
    this.password = password;
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
