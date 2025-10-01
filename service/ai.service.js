import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export const aiService = async (prompt) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent([{ text: prompt }]);
    let text = result.response.candidates[0].content.parts[0].text;
    return text;
  } catch (err) {
    console.error(err);
    throw new Error("AI service error");
  }
};
