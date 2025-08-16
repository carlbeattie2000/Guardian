const UserModel = require("../models/user.model");
const authenticationService = require("../services/users/authentication.service");

/**
 * @param {import('express').Request} Request
 * @param {import('express').Response} Response
 * @param {import('express').NextFunction} NextFunction
 */
async function OfficerAuthenticationMiddleware(req, res, next) {
  const { accessToken } = req.cookies;

  if (!accessToken) {
    return res.sendStatus(401);
  }

  const verifiedToken = authenticationService.verifyToken(accessToken);

  if (verifiedToken.error) {
    return res.sendStatus(401);
  }

  const user = await UserModel.findById(verifiedToken.body.sub);

  if (user === null) {
    return next();
  }

  req.is_officer = user.is_officer;

  next();
}

module.exports = OfficerAuthenticationMiddleware;
