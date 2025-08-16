const { Router } = require("express");
const multer = require("multer");
const FileStorage = require("../../lib/fileStorage");
const reportsController = require("../../controllers/reports.controller");
const OfficerAuthenticationMiddleware = require("../../middleware/officerAuthorization.middleware");

const reportRouter = Router();
const upload = multer();

reportRouter.post(
  "/",
  upload.array("photos", 12),
  reportsController.createReport,
);

reportRouter.get(
  "/all",
  OfficerAuthenticationMiddleware,
  reportsController.getAll,
);

reportRouter.post("/add-witness/:id", reportsController.createWitness);

reportRouter.get("/:id", reportsController.getReportById);

reportRouter.get("/image/:path", async (req, res) => {
  res.sendFile(FileStorage.getImagePath(req.params.path));
});

module.exports = reportRouter;
