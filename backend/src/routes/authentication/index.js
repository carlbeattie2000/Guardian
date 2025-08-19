const { Router } = require("express");
const AuthorisationMiddleware = require("../../middleware/authorization.middleware");

const authenticationController = require("../../controllers/authentication.controller");
const HttpError = require("../../utils/httpError");

const authenticationRouter = Router();

authenticationRouter.post("/login", authenticationController.login);
authenticationRouter.post("/register", authenticationController.register);

authenticationRouter.get(
  "/profile",
  AuthorisationMiddleware,
  authenticationController.profile,
);

authenticationRouter.get(
  "/is-authed",
  AuthorisationMiddleware,
  authenticationController.isAuthed,
);

module.exports = authenticationRouter;
