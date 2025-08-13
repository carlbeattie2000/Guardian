const { Router } = require('express');
const authenticationRouter = require('./authentication');

const router = Router();

router.use('/api/v1', authenticationRouter);

module.exports = router;
