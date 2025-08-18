const authenticationService = require("../services/users/authentication.service");

/**
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
async function AuthorisationMiddleware(req, res, next) {
  const { accessToken } = req.cookies;

  if (!accessToken) {
    return HeaderAuthorizationMiddleware(req, res, next);
  }

  handleToken(req, res, next, accessToken);
}

/**
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
async function HeaderAuthorizationMiddleware(req, res, next) {
  let accessToken;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    accessToken = authHeader.substring(7);
  }

  if (!accessToken) {
    return res.sendStatus(401);
  }

  handleToken(req, res, next, accessToken);
}

/**
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @param {string} token
 */
async function handleToken(req, res, next, token) {
  const validatedJwt = authenticationService.verifyToken(token);

  if (validatedJwt.error) {
    return res.sendStatus(validatedJwt.code);
  }

  req.user = validatedJwt.payload.sub;

  next();
}

module.exports = AuthorisationMiddleware;
