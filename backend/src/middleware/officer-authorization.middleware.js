const UserModel = require("../models/user.model");
const authenticationService = require("../services/authentication.service");
const HttpError = require("../utils/http-error");
const HttpResponse = require("../utils/http-response-helper");

/**
 * @param {import('express').Request} Request
 * @param {import('express').Response} Response
 * @param {import('express').NextFunction} NextFunction
 */
async function OfficerAuthenticationMiddleware(req, res, next) {
  if (!req.is_officer) {
    throw new HttpError({ code: 401 });
  }

  next();
}

module.exports = OfficerAuthenticationMiddleware;
