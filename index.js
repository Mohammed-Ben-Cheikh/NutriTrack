import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;
let data = [
  {
    name: "mohammed",
    age: 16,
    isLogin: true,
  },
  {
    name: "omar",
    age: 13,
    isLogin: true,
  },
];

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index", { data: data });
});


app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
