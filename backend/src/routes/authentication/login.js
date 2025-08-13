const { Router } = require('express');

const loginRouter = Router();


/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login user in
 *     responses:
 *       200:
 *         description: User login successful
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: JSESSIONID=abcde12345; Path=/; HttpOnly
 */
loginRouter.post('/login', (req, res) => {
  res.send('Hello Login');
});

module.exports = loginRouter;
