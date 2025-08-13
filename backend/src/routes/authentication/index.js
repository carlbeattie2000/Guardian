const { Router } = require('express');
const loginRouter = require('./login');

const authenticationRouter = Router();

authenticationRouter.use('/auth', loginRouter);

module.exports = authenticationRouter;
