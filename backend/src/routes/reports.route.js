const { Router } = require("express");
const FileStorage = require("../lib/file-storage");
const OfficerAuthenticationMiddleware = require("../middleware/officer-authorization.middleware");

const multer = require("multer");
const reportsController = require("../controllers/reports.controller");
const HttpResponse = require("../utils/http-response-helper");

const reportsRouter = Router();
const upload = multer();

reportsRouter.get("/", reportsController.getAll);
reportsRouter.get("/:id", reportsController.getById);

reportsRouter.post("/", upload.array("photos", 12), reportsController.create);
reportsRouter.post("/add-witness/:id", reportsController.createWitness);
reportsRouter.post(
  "/update-status/:id",
  OfficerAuthenticationMiddleware,
  reportsController.updateStatus,
);

reportsRouter.delete(
  "/delete/:id",
  OfficerAuthenticationMiddleware,
  reportsController.delete,
);

module.exports = reportsRouter;
