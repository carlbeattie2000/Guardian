const { Router } = require('express');
const loginRouter = require('./login');
const registerRouter = require('./register');

const authenticationRouter = Router();

authenticationRouter.use('/auth', loginRouter);
authenticationRouter.use('/auth', registerRouter);

module.exports = authenticationRouter;
