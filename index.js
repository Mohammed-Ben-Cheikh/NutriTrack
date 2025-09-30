import dotenv from "dotenv";
dotenv.config();

import { GoogleGenerativeAI } from "@google/generative-ai";
import express from "express";
import express_session from "express-session";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import auth from "./middleware/auth.js";
import router from "./routes/index.js";
import mainRouter from "./routes/mainRouter.js";
// import aiRouter from "./services/ai.service.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const upload = multer({ storage: multer.memoryStorage() });

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

app.post("/ai-service", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    // Convert buffer -> base64
    const imageBase64 = req.file.buffer.toString("base64");

    // Load Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Ask Gemini to analyze the meal
    const prompt = `
    🔍 Analyse Nutritionnelle par Image

1. Identification précise : Reconnaissance des aliments présents dans l’assiette (ex. pizza, salade, poulet, riz).
2. Quantification : Estimation des portions et du poids des aliments.
3. Énergie : Calcul des calories totales du repas.
4. Macronutriments : Répartition en protéines, glucides, lipides.
5. Micronutriments : Apport en fibres, vitamines, minéraux.
6. Objectif utilisateur : Analyse selon le profil (perte de poids, maintien, prise de masse).
7. Ajustement spécifique : Adaptation aux besoins particuliers (diabète, sportif, végétarien, etc.).
8. Détection d’écarts : Excès de sucres, déficit en protéines, graisses saturées trop élevées.
9. Recommandations : Conseils pratiques pour équilibrer le repas.
10. Synthèse : Rapport clair, concis et personnalisé pour guider l’utilisateur.
Reconnaissance des aliments consommés.
Estimation des calories et nutriments en fonction de l’objectif du profil choisi.
Détection automatique d’écarts (ex. trop peu de protéines pour un sportif, excès de sucre pour un diabétique).
⚠️ La réponse finale doit être rédigée en moins de 15 lignes et en formt markdown pro style .
    `;

    const result = await model.generateContent([
      { text: prompt },
      {
        inlineData: {
          mimeType: req.file.mimetype,
          data: imageBase64,
        },
      },
    ]);
    console.log(result);
    // Gemini usually responds with text
    let text = result.response.candidates[0].content.parts[0].text;

    // Parse JSON safely

    res.json(text);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      api: process.env.GOOGLE_API_KEY,
      error: "Server error",
      details: err.message,
    });
  }
});

app.use(auth);

app.use(router);

app.listen(PORT, () => {
  console.log(`app listening on port http://localhost:${PORT}`);
});
