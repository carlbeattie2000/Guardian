const { Router } = require('express');
const reportRouter = require('./report.route');

const reportsRouter = Router();

reportsRouter.use('/reports', reportRouter);

module.exports = reportsRouter;
