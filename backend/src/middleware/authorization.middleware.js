const errorService = require("../services/error-service");
const authenticationService = require("../services/authentication.service");
const HttpResponse = require("../utils/http-response-helper");
const UserModel = require("../models/user.model");

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

  await handleToken(req, res, next, accessToken);
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

  await handleToken(req, res, next, accessToken);
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @param {string} token
 */
async function handleToken(req, res, next, token) {
  const validatedJwt = await authenticationService.verifyToken(token);

  req.user = validatedJwt.sub;
  req.is_officer = validatedJwt.is_officer;

  next();
}

module.exports = AuthorisationMiddleware;
