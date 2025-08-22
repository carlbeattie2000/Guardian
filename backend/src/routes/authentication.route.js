const { Router } = require("express");
const AuthorisationMiddleware = require("../middleware/authorization.middleware");

const authenticationController = require("../controllers/authentication.controller");

const authenticationRouter = Router();

authenticationRouter.post("/login", authenticationController.login);
authenticationRouter.post("/register", authenticationController.register);
authenticationRouter.post(
  "/logout",
  AuthorisationMiddleware,
  authenticationController.logout,
);
authenticationRouter.post(
  "/logout-all",
  AuthorisationMiddleware,
  authenticationController.logoutAllSessions,
);
authenticationRouter.post("/refresh", authenticationController.refreshToken);

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
