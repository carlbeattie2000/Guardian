const { Router } = require('express');
const authenticationController = require('../../controllers/authentication.controller');

const loginRouter = Router();

loginRouter.post('/login', authenticationController.login);

module.exports = loginRouter;
