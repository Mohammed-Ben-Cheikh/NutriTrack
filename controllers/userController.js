/**
 * User controller function
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 */

export function user(req, res) {
  console.log(req.params.id);
  res.render("user");
}
