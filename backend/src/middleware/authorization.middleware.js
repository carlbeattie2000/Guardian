const authenticationService = require("../services/users/authentication.service");

/**
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
async function AuthorisationMiddleware(req, res, next) {
  const { accessToken } = req.cookies;

  if (!accessToken) {
    return res.sendStatus(401);
  }

  const validatedJwt = authenticationService.verifyToken(accessToken);

  if (validatedJwt.error) {
    return res.sendStatus(validatedJwt.code);
  }

  req.user = validatedJwt.payload.sub;

  next();
}

module.exports = AuthorisationMiddleware;
