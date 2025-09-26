import dotenv from "dotenv";
import mysql2 from "mysql2";
dotenv.config();

const connection = mysql2.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

connection.connect((err) => {
  if (err) {
    console.log(`erreur de connexion a Mysql: ${err}`);
    return;
  }
  console.log("vous êtes connecte a la base Mysql 🏅");
});

export default connection;
