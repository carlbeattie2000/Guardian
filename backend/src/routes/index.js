const { Router } = require('express');
const authenticationRouter = require('./authentication');
const reportsRouter = require('./reports');

const router = Router();

router.use('/api/v1', authenticationRouter);
router.use('/api/v1', reportsRouter);

module.exports = router;
