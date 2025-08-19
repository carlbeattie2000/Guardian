const { Router } = require("express");
const FileStorage = require("../../lib/fileStorage");
const OfficerAuthenticationMiddleware = require("../../middleware/officerAuthorization.middleware");

const multer = require("multer");
const reportsController = require("../../controllers/reports.controller");

const reportsRouter = Router();
const upload = multer();

reportsRouter.post("/", upload.array("photos", 12), reportsController.create);

reportsRouter.get(
  "/all",
  OfficerAuthenticationMiddleware,
  reportsController.getAll,
);

reportsRouter.post("/add-witness/:id", reportsController.createWitness);

reportsRouter.get("/:id", reportsController.getById);

reportsRouter.get("/image/:path", async (req, res) => {
  res.sendFile(FileStorage.getImagePath(req.params.path));
});

module.exports = reportsRouter;
