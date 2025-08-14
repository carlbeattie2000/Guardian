const { Router } = require('express');
const { join } = require('path');
const multer = require('multer');
const FileStorage = require('../../lib/fileStorage');
const reportsService = require('../../services/reports/reports.service');
const reportsController = require('../../controllers/reports.controller');

const reportRouter = Router();
const upload = multer();

reportRouter.post('/', upload.array('photos', 12), reportsController.createReport);

reportRouter.get('/:id', reportsController.getReportById);


reportRouter.get('/image/:path', async (req, res) => {
  res.sendFile(FileStorage.getImagePath(req.params.path));
});


module.exports = reportRouter;
