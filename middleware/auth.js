/**
 * Authentication middleware function
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 */

const auth = (req, res, next) => {
  if (req.session && req.session.isLoggedIn && req.session.user) {
    return next();
  } else {
    return res
      .status(401)
      .send("Vous devez être connecté pour accéder à cette ressource");
  }
};

export default auth;
