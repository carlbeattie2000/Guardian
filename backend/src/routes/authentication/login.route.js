const { Router } = require("express");
const AuthorisationMiddleware = require("../../middleware/authorization.middleware");
const authenticationController = require("../../controllers/authentication.controller");

const loginRouter = Router();

loginRouter.post("/login", authenticationController.login);
loginRouter.get(
  "/is-authed",
  AuthorisationMiddleware,
  authenticationController.isAuthed,
);

module.exports = loginRouter;
