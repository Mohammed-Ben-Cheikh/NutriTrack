import dotenv from "dotenv";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import router from "./routes/index.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.use(router);

app.listen(PORT, () => {
  console.log(`app listening on port http://localhost:${PORT}`);
});
