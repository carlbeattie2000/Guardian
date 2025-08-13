const { Router } = require('express');
const authenticationController = require('../../controllers/authentication.controller');

const registerRouter = Router();

registerRouter.post('/register', authenticationController.register);

module.exports = registerRouter;
