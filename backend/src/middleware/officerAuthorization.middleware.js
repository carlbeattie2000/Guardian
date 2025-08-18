const UserModel = require("../models/user.model");
const authenticationService = require("../services/users/authentication.service");
const HttpError = require("../utils/httpError");
const HttpResponse = require("../utils/HttpResponseHelper");

/**
 * @param {import('express').Request} Request
 * @param {import('express').Response} Response
 * @param {import('express').NextFunction} NextFunction
 */
async function OfficerAuthenticationMiddleware(req, res, next) {
  const { accessToken } = req.cookies;

  if (!accessToken) {
    return new HttpResponse(401).sendStatus(res);
  }

  const verifiedToken = authenticationService.verifyToken(accessToken);

  if (verifiedToken.error) {
    return new HttpResponse(401).sendStatus(res);
  }

  const user = await UserModel.findById(verifiedToken.payload.sub);

  if (user === null) {
    throw new HttpError({ code: 401 });
  }

  if (!user.is_officer) {
    throw new HttpError({ code: 401 });
  }

  req.is_officer = user.is_officer;

  next();
}

module.exports = OfficerAuthenticationMiddleware;
