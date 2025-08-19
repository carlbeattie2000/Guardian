const errorService = require("../services/error-service");
const authenticationService = require("../services/users/authentication.service");
const HttpResponse = require("../utils/HttpResponseHelper");

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function AuthorisationMiddleware(req, res, next) {
  const { accessToken } = req.cookies;

  if (!accessToken) {
    return HeaderAuthorizationMiddleware(req, res, next);
  }

  handleToken(req, res, next, accessToken);
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function HeaderAuthorizationMiddleware(req, res, next) {
  let accessToken;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    accessToken = authHeader.substring(7);
  }

  if (!accessToken) {
    return new HttpResponse(401).sendStatus(res);
  }

  handleToken(req, res, next, accessToken);
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @param {string} token
 */
function handleToken(req, res, next, token) {
  const validatedJwt = authenticationService.verifyToken(token);

  req.user = validatedJwt.payload.sub;

  next();
}

module.exports = AuthorisationMiddleware;
