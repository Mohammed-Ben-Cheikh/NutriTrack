/**
 * User controller function
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 */

export function home(req, res) {
  const success = req.query.success;
  const error = req.query.error;
  return res.render("index", { success, error });
}
