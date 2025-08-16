const { Router } = require("express");
const loginRouter = require("./login.route");
const registerRouter = require("./register.route");

const authenticationRouter = Router();

authenticationRouter.use("/auth", loginRouter);
authenticationRouter.use("/auth", registerRouter);

module.exports = authenticationRouter;
