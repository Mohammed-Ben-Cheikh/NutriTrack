import mysql2 from "mysql2";

class Database {
  constructor() {
    this.connection = null;
  }
<<<<<<< HEAD
  console.log("vous êtes connecte a la base Mysql 🏅");
});
=======
>>>>>>> bd43f208357b48de937a820dcc0ce30ce7935f49

  connect() {
    if (this.connection) return this.connection;

    this.connection = mysql2.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });
    this.connection.connect((err) => {
      if (err) {
        console.log(`erreur de connexion a Mysql: ${err}`);
        return;
      }
      console.log("vous etre connecte a la base Mysql 🏅");
    });
    return this.connection;
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const db = Database.getInstance();
export default db;
