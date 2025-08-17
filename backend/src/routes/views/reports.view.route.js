const { Router } = require("express");
const reportsService = require("../../services/reports/reports.service");

const reportsViewRouter = Router();

reportsViewRouter.get("/report", (req, res) => {
  res.render("report.pug");
});

reportsViewRouter.get("/add-witness/:id", (req, res) => {
  res.render("witness.pug", { report_id: req.params.id });
});

reportsViewRouter.get("/view-report/:id", async (req, res) => {
  const id = req.params.id;
  const reportRes = await reportsService.getById(id);

  const canView = await reportsService.canUserView(reportRes.data, req.user);

  if (canView) {
    return res.render("reportView.pug", { report: reportRes.data });
  }

  return res.redirect("/");
});

module.exports = reportsViewRouter;
