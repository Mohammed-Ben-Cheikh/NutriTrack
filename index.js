import dotenv from "dotenv";
import express from "express";
import express_session from "express-session";
import path from "path";
import { fileURLToPath } from "url";
import auth from "./middleware/auth.js";
import router from "./routes/index.js";
import mainRouter from "./routes/mainRouter.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());

app.use(
  express_session({
    secret:
      process.env.SESSION_SECRET ||
      "your-default-secret-key-change-this-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use(mainRouter);

app.use(auth);

app.use(router);

app.listen(PORT, () => {
  console.log(`app listening on port http://localhost:${PORT}`);
});
