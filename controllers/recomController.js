import {aiService} from "../service/ai.service.js"; 
/**
 * User controller function
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 */

export function recommendation(req, res) {
  res.render("recommandation");
}
