const { Router } = require('express');

const loginRouter = Router();

loginRouter.post('/login', (req, res) => {
  res.send('Hello Login');
});

module.exports = loginRouter;
