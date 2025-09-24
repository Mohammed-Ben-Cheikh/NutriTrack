import dotenv from "dotenv";
import express from "express";
import path from "path";
import db from "./config/database.js"
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ;


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index", { data: data });
});

app.listen(PORT, () => {
  console.log(`app listening on port http://localhost:${PORT}`);
});
